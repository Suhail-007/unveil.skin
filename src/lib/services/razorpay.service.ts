/**
 * Razorpay Service - Handles all Razorpay payment operations
 * 
 * This service provides methods to:
 * 1. Create Razorpay orders on the server
 * 2. Verify payment signatures for security
 * 3. Handle payment success/failure callbacks
 * 
 * Flow:
 * 1. Client calls createRazorpayOrder() to create an order on backend
 * 2. Backend creates order with Razorpay API and returns order details
 * 3. Client opens Razorpay checkout with order_id
 * 4. User completes payment on Razorpay
 * 5. Razorpay calls success handler with payment details
 * 6. Client calls verifyPayment() to verify signature on backend
 * 7. Backend verifies signature and updates order status
 */

// API Route constants
export const RAZORPAY_ROUTES = {
  CREATE_ORDER: '/api/razorpay/create-order',
  VERIFY_PAYMENT: '/api/razorpay/verify-payment',
} as const;

// Types for Razorpay operations
export interface CreateOrderParams {
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency?: string; // Default: INR
  receipt?: string; // Custom receipt ID for reference
  notes?: Record<string, string>; // Additional metadata
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string; // Razorpay order ID
  amount: number; // Amount in paise
  currency: string;
  error?: string;
}

export interface VerifyPaymentParams {
  razorpay_order_id: string; // Order ID from Razorpay
  razorpay_payment_id: string; // Payment ID from Razorpay
  razorpay_signature: string; // Signature to verify authenticity
  orderDetails?: {
    cartItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress?: Record<string, string>;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  verified: boolean;
  message: string;
  orderId?: string; // Our database order ID
  error?: string;
}

/**
 * Create a Razorpay order on the backend
 * 
 * This function:
 * 1. Sends order details to backend
 * 2. Backend creates order with Razorpay API
 * 3. Returns order_id needed for checkout
 * 
 * @param params - Order creation parameters
 * @returns Promise with order details or error
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<CreateOrderResponse> {
  try {
    const response = await fetch(RAZORPAY_ROUTES.CREATE_ORDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create Razorpay order');
    }

    return {
      success: true,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return {
      success: false,
      orderId: '',
      amount: 0,
      currency: 'INR',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify payment signature after successful payment
 * 
 * This function:
 * 1. Sends payment details to backend
 * 2. Backend verifies signature using Razorpay secret
 * 3. Creates order in database if verified
 * 4. Returns verification status
 * 
 * Security Note: Signature verification MUST happen on server
 * to prevent tampering with payment status
 * 
 * @param params - Payment verification parameters
 * @returns Promise with verification result
 */
export async function verifyPayment(
  params: VerifyPaymentParams
): Promise<VerifyPaymentResponse> {
  try {
    const response = await fetch(RAZORPAY_ROUTES.VERIFY_PAYMENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify payment');
    }

    return {
      success: true,
      verified: data.verified,
      message: data.message,
      orderId: data.orderId,
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      verified: false,
      message: 'Payment verification failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get Razorpay key ID for frontend
 * 
 * This should be your publishable key (key_id), not the secret
 * Safe to expose on client side
 */
export function getRazorpayKeyId(): string {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    throw new Error(
      'NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured. ' +
      'Add it to your .env.local file and restart the dev server.'
    );
  }
  
  return keyId;
}

/**
 * Convert amount to paise (smallest currency unit)
 * Razorpay expects amounts in paise (1 rupee = 100 paise)
 * 
 * @param amount - Amount in rupees
 * @returns Amount in paise
 */
export function convertToPaise(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert amount from paise to rupees
 * 
 * @param paise - Amount in paise
 * @returns Amount in rupees
 */
export function convertToRupees(paise: number): number {
  return paise / 100;
}
