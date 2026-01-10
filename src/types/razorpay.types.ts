/**
 * TypeScript Type Definitions for Razorpay
 * 
 * Provides type safety for Razorpay integration
 * These types match the Razorpay API responses and webhook payloads
 */

/**
 * Razorpay Order Object
 * Returned when creating an order via Razorpay API
 */
export interface RazorpayOrder {
  id: string; // Unique order identifier (e.g., "order_ABC123")
  entity: "order";
  amount: number; // Amount in paise (smallest currency unit)
  amount_paid: number; // Amount paid so far
  amount_due: number; // Amount remaining to be paid
  currency: string; // Three-letter ISO code (e.g., "INR")
  receipt: string; // Custom receipt ID
  offer_id: string | null;
  status: "created" | "attempted" | "paid"; // Order status
  attempts: number; // Number of payment attempts
  notes: Record<string, string>; // Custom metadata
  created_at: number; // Unix timestamp
}

/**
 * Razorpay Payment Object
 * Contains payment details after successful payment
 */
export interface RazorpayPayment {
  id: string; // Payment ID (e.g., "pay_XYZ123")
  entity: "payment";
  amount: number; // Amount in paise
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  order_id: string; // Associated order ID
  invoice_id: string | null;
  international: boolean;
  method: "card" | "netbanking" | "wallet" | "emi" | "upi";
  amount_refunded: number;
  refund_status: "null" | "partial" | "full";
  captured: boolean;
  description: string;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null; // Virtual Payment Address (for UPI)
  email: string;
  contact: string;
  notes: Record<string, string>;
  fee: number; // Platform fee
  tax: number; // Tax on fee
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  acquirer_data: {
    auth_code?: string;
    rrn?: string; // Reference Retrieval Number
  };
  created_at: number;
}

/**
 * Razorpay Checkout Options
 * Configuration for opening Razorpay payment modal
 */
export interface RazorpayCheckoutOptions {
  key: string; // Razorpay Key ID
  amount: number; // Amount in paise
  currency: string;
  name: string; // Business name
  description?: string; // Purchase description
  image?: string; // Business logo URL
  order_id: string; // Order ID from create order API
  
  // Customer information (optional - pre-fills form)
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: "card" | "netbanking" | "wallet" | "emi" | "upi";
  };
  
  // Customization options
  theme?: {
    color?: string; // Primary color
    backdrop_color?: string;
  };
  
  // Callback handlers
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  
  // Additional settings
  notes?: Record<string, string>;
  subscription_id?: string;
  recurring?: "0" | "1";
  subscription_card_change?: "0" | "1";
  remember_customer?: boolean;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  timeout?: number;
  remember?: boolean;
}

/**
 * Razorpay Success Response
 * Received in handler callback after successful payment
 */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string; // Payment ID
  razorpay_order_id: string; // Order ID
  razorpay_signature: string; // HMAC signature for verification
}

/**
 * Razorpay Error Response
 * Received on payment failure
 */
export interface RazorpayErrorResponse {
  error: {
    code: string; // Error code (e.g., "BAD_REQUEST_ERROR")
    description: string; // Human readable error message
    source: string; // Source of error (e.g., "customer")
    step: string; // Step where error occurred
    reason: string; // Reason for failure
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

/**
 * Razorpay Instance
 * The main Razorpay object loaded from checkout script
 */
export interface RazorpayInstance {
  open: () => void; // Open payment modal
  close: () => void; // Close payment modal
  on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
}

/**
 * Razorpay Constructor
 * Used to create Razorpay instance
 */
export interface RazorpayConstructor {
  new (options: RazorpayCheckoutOptions): RazorpayInstance;
}

/**
 * Webhook Event Types
 * Events sent by Razorpay webhooks
 */
export type RazorpayWebhookEvent =
  | "payment.authorized"
  | "payment.captured"
  | "payment.failed"
  | "order.paid"
  | "refund.created"
  | "refund.processed"
  | "subscription.charged"
  | "subscription.completed"
  | "subscription.cancelled";

/**
 * Webhook Payload
 * Structure of webhook request from Razorpay
 */
export interface RazorpayWebhookPayload {
  entity: "event";
  account_id: string;
  event: RazorpayWebhookEvent;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPayment;
    };
    order?: {
      entity: RazorpayOrder;
    };
  };
  created_at: number;
}

/**
 * Refund Object
 * Details of a refund transaction
 */
export interface RazorpayRefund {
  id: string;
  entity: "refund";
  amount: number;
  currency: string;
  payment_id: string;
  notes: Record<string, string>;
  receipt: string | null;
  acquirer_data: {
    arn?: string; // Acquirer Reference Number
  };
  created_at: number;
  batch_id: string | null;
  status: "pending" | "processed" | "failed";
  speed_processed: "normal" | "optimum";
  speed_requested: "normal" | "optimum";
}

/**
 * Error Codes
 * Common Razorpay error codes
 */
export enum RazorpayErrorCode {
  BAD_REQUEST = "BAD_REQUEST_ERROR",
  GATEWAY_ERROR = "GATEWAY_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

/**
 * Payment Methods
 * Supported payment methods
 */
export enum RazorpayPaymentMethod {
  CARD = "card",
  NETBANKING = "netbanking",
  WALLET = "wallet",
  UPI = "upi",
  EMI = "emi",
  CARDLESS_EMI = "cardless_emi",
  PAYLATER = "paylater",
}

/**
 * Currency Codes
 * Supported currencies (partial list)
 */
export enum RazorpayCurrency {
  INR = "INR", // Indian Rupee
  USD = "USD", // US Dollar
  EUR = "EUR", // Euro
  GBP = "GBP", // British Pound
  AED = "AED", // UAE Dirham
  SGD = "SGD", // Singapore Dollar
}

/**
 * Declare global Window interface for Razorpay
 */
declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

export {};
