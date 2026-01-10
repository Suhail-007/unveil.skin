/**
 * Razorpay Payment Verification API Route
 * 
 * This endpoint verifies the payment signature from Razorpay
 * and creates an order in the database
 * 
 * SECURITY CRITICAL:
 * - Signature verification MUST happen on server
 * - Never trust client-side payment status
 * - Always verify signature before creating order
 * 
 * Flow:
 * 1. User completes payment on Razorpay
 * 2. Razorpay returns payment details to client
 * 3. Client sends payment details here for verification
 * 4. Server verifies signature using crypto
 * 5. If valid, create order in database
 * 6. Return verification status to client
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import sequelize from '@/lib/sequelize';
import { Order } from '@/lib/models/Order';
import { OrderItem } from '@/lib/models/OrderItem';
import { CartItem } from '@/lib/models/CartItem';
import { Product } from '@/lib/models/Product';

/**
 * Verify Razorpay payment signature
 * 
 * Razorpay signs the payment with your secret key
 * We verify this signature to ensure payment is legitimate
 * 
 * Formula: HMAC SHA256 of (order_id + "|" + payment_id) using secret
 * 
 * @param orderId - Razorpay order ID
 * @param paymentId - Razorpay payment ID
 * @param signature - Signature from Razorpay
 * @returns true if signature is valid
 */
function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  
  // Create expected signature
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  // Compare signatures (timing-safe comparison)
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}

export async function POST(request: NextRequest) {
  const transaction = await sequelize.transaction();
  
  try {
    // Step 1: Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      );
    }

    // Step 2: Parse payment details from request
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    // Step 3: Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      await transaction.rollback();
      return NextResponse.json(
        { error: 'Missing payment details. Please try again.' },
        { status: 400 }
      );
    }

    // Step 4: Verify payment signature
    // This is the MOST IMPORTANT security check
    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      await transaction.rollback();
      console.error('Payment signature verification failed', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
      
      return NextResponse.json(
        { 
          success: false,
          verified: false,
          message: 'Payment verification failed. If payment was deducted, it will be refunded.',
        },
        { status: 400 }
      );
    }

    // Step 5: Get cart items for the user
    let cartItems = [];
    let totalAmount = 0;

    if (orderDetails?.cartItems) {
      // Use provided cart items (for guest checkout or direct checkout)
      cartItems = orderDetails.cartItems;
      totalAmount = cartItems.reduce(
        (sum: number, item: { price: number; quantity: number }) => 
          sum + (item.price * item.quantity), 
        0
      );
    } else {
      // Get cart items from database (for logged-in users)
      const dbCartItems = await CartItem.findAll({
        where: { userId: user.id },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'price'],
        }],
        transaction,
      });

      if (dbCartItems.length === 0) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'Cart is empty. Cannot create order.' },
          { status: 400 }
        );
      }

      cartItems = dbCartItems.map((item) => {
        const product = item.product as InstanceType<typeof Product> | undefined;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(product?.price?.toString() || '0'),
        };
      });

      totalAmount = cartItems.reduce(
        (sum: number, item: { price: number; quantity: number }) => 
          sum + (item.price * item.quantity), 
        0
      );
    }

    // Step 6: Create order in database
    const order = await Order.create(
      {
        userId: user.id,
        status: 'paid', // Payment is verified
        totalAmount,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        shippingAddress: orderDetails?.shippingAddress || {},
      },
      { transaction }
    );

    // Step 7: Create order items
    await OrderItem.bulkCreate(
      cartItems.map((item: { productId: string; quantity: number; price: number }) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      { transaction }
    );

    // Step 8: Decrease product quantities
    for (const item of cartItems) {
      await sequelize.query(
        'UPDATE products SET stock = stock - :purchasedQty WHERE id = :productId AND stock >= :purchasedQty',
        {
          replacements: { 
            purchasedQty: item.quantity, 
            productId: item.productId 
          },
          transaction,
        }
      );
    }

    // Step 9: Clear user's cart after successful order
    await CartItem.destroy({
      where: { userId: user.id },
      transaction,
    });

    // Step 10: Commit transaction
    await transaction.commit();

    // Step 11: Return success response
    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully!',
      orderId: order.id,
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      },
    });

  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();
    
    console.error('Error verifying payment:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to verify payment. Please contact support.';

    return NextResponse.json(
      { 
        success: false,
        verified: false,
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
