/**
 * RazorpayCheckout Component
 * 
 * This component handles the complete Razorpay payment flow:
 * 1. Creates order on backend
 * 2. Opens Razorpay checkout modal
 * 3. Handles payment success/failure
 * 4. Verifies payment on backend
 * 5. Shows appropriate feedback to user
 * 
 * Usage:
 * ```tsx
 * <RazorpayCheckout
 *   amount={1000} // in rupees
 *   cartItems={[{ productId: '1', quantity: 1, price: 1000 }]}
 *   onSuccess={(orderId) => console.log('Order created:', orderId)}
 *   onError={(error) => console.error('Payment failed:', error)}
 * />
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import { Button, Spinner, Box, Text } from "@chakra-ui/react";
import {
  createRazorpayOrder,
  verifyPayment,
  convertToPaise,
  getRazorpayKeyId,
} from "@/lib/services/razorpay.service";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

// Razorpay instance types
import type {
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from '@/types/razorpay.types';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface RazorpayCheckoutProps {
  amount: number; // Amount in rupees
  cartItems: CartItem[];
  shippingAddress?: Record<string, string>;
  onSuccess?: (orderId: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  disabled?: boolean;
}

export default function RazorpayCheckout({
  amount,
  cartItems,
  shippingAddress,
  onSuccess,
  onError,
  buttonText = "Pay Now",
  disabled = false,
}: RazorpayCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  /**
   * Load Razorpay checkout script
   * This script is required to open the Razorpay payment modal
   */
  useEffect(() => {
    // Check if script already exists
    if (document.getElementById("razorpay-script")) {
      setScriptLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  /**
   * Handle payment success callback from Razorpay
   * 
   * Called when user completes payment successfully
   * We verify the signature on backend before trusting it
   */
  const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
    try {
      setLoading(true);

      // Step 1: Verify payment on backend
      // This is CRITICAL for security - never trust client-side payment status
      const verificationResult = await verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        orderDetails: {
          cartItems,
          shippingAddress,
        },
      });

      if (verificationResult.verified) {
        // Payment verified successfully
        console.log("Payment verified successfully!", verificationResult);
        
        // Call success callback
        if (onSuccess) {
          onSuccess(verificationResult.orderId || "");
        }

        // Redirect to orders page
        router.push("/orders?success=true");
      } else {
        // Verification failed
        throw new Error(verificationResult.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error in payment success handler:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Payment verification failed";
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle payment failure callback from Razorpay
   * 
   * Called when payment fails or user cancels
   */
  const handlePaymentFailure = (error: RazorpayErrorResponse) => {
    console.error("Payment failed:", error);
    
    const errorMessage =
      error.error?.reason || error.error?.description || "Payment failed. Please try again.";
    
    if (onError) {
      onError(errorMessage);
    }
    
    setLoading(false);
  };

  /**
   * Open Razorpay checkout modal
   * 
   * This function:
   * 1. Creates order on backend
   * 2. Opens Razorpay payment modal
   * 3. Configures payment options and callbacks
   */
  const openRazorpayCheckout = async () => {
    if (!scriptLoaded) {
      alert("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    try {
      setLoading(true);

      // Validate Razorpay key is configured
      let keyId;
      try {
        keyId = getRazorpayKeyId();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        throw new Error(
          "Payment gateway not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local file and restart the server."
        );
      }

      // Step 1: Create order on backend
      const orderResponse = await createRazorpayOrder({
        amount: convertToPaise(amount), // Convert rupees to paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user?.id || "guest",
          itemCount: cartItems.length.toString(),
        },
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || "Failed to create order");
      }

      // Step 2: Configure Razorpay options
      const options = {
        key: keyId, // Your Razorpay Key ID (already validated)
        amount: orderResponse.amount, // Amount in paise
        currency: orderResponse.currency,
        name: "Unveil.Skin", // Your business name
        description: `Purchase of ${cartItems.length} item(s)`,
        order_id: orderResponse.orderId, // Order ID from backend
        
        // Customer details (pre-fill if available)
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
          contact: user?.user_metadata?.phone || "",
        },

        // Theme configuration
        theme: {
          color: "#000000", // Your brand color
        },

        // Payment success handler
        handler: handlePaymentSuccess,

        // Payment failure/cancellation handler
        modal: {
          ondismiss: () => {
            console.log("Payment modal closed");
            setLoading(false);
          },
        },
      };

      // Step 3: Open Razorpay checkout modal
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded');
      }
      
      const razorpay = new window.Razorpay(options);
      
      // Handle payment failures
      razorpay.on("payment.failed", handlePaymentFailure);
      
      // Open the modal
      razorpay.open();
      
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initiate payment";
      
      if (onError) {
        onError(errorMessage);
      }
      
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button
        onClick={openRazorpayCheckout}
        disabled={disabled || loading || !scriptLoaded}
        className="w-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        size="lg"
      >
        {loading ? (
          <Box className="flex items-center gap-2">
            <Spinner size="sm" />
            <span>Processing...</span>
          </Box>
        ) : (
          buttonText
        )}
      </Button>

      {!scriptLoaded && (
        <Text className="text-sm text-zinc-500 mt-2 text-center">
          Loading payment gateway...
        </Text>
      )}
    </Box>
  );
}
