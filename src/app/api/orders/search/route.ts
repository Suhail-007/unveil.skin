import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Order, OrderItem, Product, sequelize } from '@/lib/models';
import { Op } from 'sequelize';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get search params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';

    await sequelize.authenticate();

    // Build where clause
    const whereClause: any = {
      userId: user.id,
    };

    // Add status filter if provided
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Add search by order number if query provided
    if (query) {
      // Search by order ID (case insensitive, partial match)
      whereClause.id = {
        [Op.iLike]: `${query}%`, // Matches from the beginning of the ID
      };
    }

    // Fetch orders with filters
    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'images', 'price'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 100, // Limit results for performance
    });

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        shippingAddress: order.shippingAddress,
        created_at: order.created_at,
        orderItems: order.orderItems?.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                images: item.product.images,
              }
            : null,
        })),
      })),
      count: orders.length,
    });
  } catch (error) {
    console.error('Order search error:', error);
    return NextResponse.json(
      { error: 'Failed to search orders' },
      { status: 500 }
    );
  }
}
