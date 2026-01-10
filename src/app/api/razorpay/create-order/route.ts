/**
 * Razorpay Create Order API Route
 * 
 * This endpoint creates a new order in Razorpay system
 * 
 * Flow:
 * 1. Client sends amount and order details
 * 2. Server validates the request
 * 3. Server creates order with Razorpay API
 * 4. Returns order_id to client for checkout
 * 
 * Security:
 * - Uses server-side API key (never exposed to client)
 * - Validates amount and parameters
 * - Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';

/**
 * Initialize Razorpay instance with credentials
 * 
 * Make sure to set these environment variables:
 * - RAZORPAY_KEY_ID: Your Razorpay Key ID
 * - RAZORPAY_KEY_SECRET: Your Razorpay Key Secret (keep this secret!)
 */
// Don't initialize Razorpay at module load time. Instantiate after
// verifying env vars inside the request handler to avoid SDK errors
// when environment variables are not set in the runtime.


export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      );
    }

    // Step 2: Parse request body
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes = {} } = body;

    // Step 3: Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be greater than 0.' },
        { status: 400 }
      );
    }

    // Step 4: Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Initialize Razorpay instance now that credentials are verified
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Step 5: Create order with Razorpay
    // This registers the order in Razorpay's system
    const options = {
      amount, // Amount in paise (1 rupee = 100 paise)
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`, // Optional receipt ID
      notes: {
        ...notes,
        userId: user.id, // Track which user created this order
        createdAt: new Date().toISOString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // Step 6: Return order details to client
    // Client will use order.id to open Razorpay checkout
    return NextResponse.json({
      success: true,
      orderId: order.id, // This is the Razorpay order ID
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // Provide user-friendly error messages
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to create order. Please try again.';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
