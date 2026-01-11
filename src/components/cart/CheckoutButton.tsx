/**
 * CheckoutButton Component
 *
 * Smart checkout button that:
 * 1. Checks if user is authenticated
 * 2. Shows auth modal if guest
 * 3. Opens Razorpay checkout if authenticated
 *
 * Can be used with custom onCheckout callback or
 * default Razorpay integration
 */

'use client';

import { useState } from 'react';
import { Button, Box, Portal } from '@chakra-ui/react';
import { useAppSelector } from '@/lib/redux/hooks';
import AuthModal from '../auth/AuthModal';
import RazorpayCheckout from './RazorpayCheckout';
import ShippingAddressForm, { type ShippingAddress } from './ShippingAddressForm';
import { toaster } from '../ui/toaster';
import { useFeatureFlags } from '@/lib/features/FeatureFlagsContext';

interface CheckoutButtonProps {
  onCheckout?: () => void;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  useRazorpay?: boolean; // Enable Razorpay integration
}

export default function CheckoutButton({
  onCheckout,
  children = 'Proceed to Payment',
  size = 'lg',
  disabled = false,
  useRazorpay = true, // Default to Razorpay
}: CheckoutButtonProps) {
  const { flags } = useFeatureFlags();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const { isGuest } = useAppSelector(state => state.auth);
  const { items, total } = useAppSelector(state => state.cart);

  const handleClick = () => {
    // Check if checkout is enabled
    if (!flags.enableCheckout) {
      toaster.create({
        title: 'Checkout unavailable',
        description: 'Checkout is currently disabled',
        duration: 3000,
        type: 'warning',
      });
      return;
    }
    
    // Check if user is authenticated
    if (isGuest) {
      // Show auth modal if user is a guest
      setShowAuthModal(true);
      return;
    }

    // Check if cart is empty
    if (items.length === 0) {
      toaster.create({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout',
        duration: 3000,
        type: 'info',
      });
      return;
    }

    // Show shipping address form first
    if (useRazorpay) {
      setShowShippingForm(true);
    } else if (onCheckout) {
      // Use custom checkout handler
      onCheckout();
    }
  };

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setShowShippingForm(false);
    setShowRazorpay(true);
  };

  const handlePaymentSuccess = (orderId: string) => {
    toaster.create({
      title: 'Payment successful!',
      description: `Order #${orderId} created successfully`,
      type: 'success',
      duration: 5000,
    });
    setShowRazorpay(false);
  };

  const handlePaymentError = (error: string) => {
    toaster.create({
      title: 'Payment failed',
      description: error,
      type: 'error',
      duration: 5000,
    });
    setShowRazorpay(false);
  };

  // Convert cart items to format expected by Razorpay
  const cartItemsForRazorpay = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <>
      {showRazorpay && useRazorpay && shippingAddress ? (
        // Show Razorpay checkout
        <RazorpayCheckout
          amount={total}
          cartItems={cartItemsForRazorpay}
          shippingAddress={shippingAddress}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          buttonText={children as string}
        />
      ) : (
        // Show regular checkout button
        <Button
          size={size}
          onClick={handleClick}
          disabled={disabled}
          className='bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200'>
          {children}
        </Button>
      )}

      {/* Auth modal for guest users */}
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} allowGuest={false} />

      {/* Shipping Address Form Modal */}
      {showShippingForm && (
        <Portal>
          <Box
            position="fixed"
            inset="0"
            bg="blackAlpha.600"
            zIndex={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            onClick={() => setShowShippingForm(false)}
          >
            <Box
              maxW="600px"
              w="full"
              onClick={(e) => e.stopPropagation()}
            >
              <ShippingAddressForm onSubmit={handleShippingSubmit} />
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
}
