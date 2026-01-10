/**
 * Example Cart Page with Razorpay Integration
 * 
 * This is a complete example showing how to use all Razorpay components together.
 * 
 * Features:
 * - Displays cart items
 * - Shows total amount
 * - Handles authentication
 * - Integrates Razorpay checkout
 * - Success/error handling
 * 
 * Usage:
 * Copy this to src/app/cart/page.tsx or use as reference
 */

"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Separator,
  Button,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setCartItems } from "@/lib/redux/slices/cartSlice";
import { getCart } from "@/lib/services/cart.service";
import CartItem from "@/components/cart/CartItem";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { useRouter } from "next/navigation";

/**
 * Main Cart Page Component
 * 
 * Flow:
 * 1. Load cart items from backend (or localStorage for guests)
 * 2. Display cart items with quantity controls
 * 3. Show cart summary with total
 * 4. Checkout button with Razorpay integration
 */
export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get cart state from Redux
  const { items, total, itemCount } = useAppSelector((state) => state.cart);
  const { isGuest } = useAppSelector((state) => state.auth);

  /**
   * Load cart on component mount
   * For authenticated users: fetch from backend
   * For guests: load from localStorage
   */
  useEffect(() => {
    const loadCart = async () => {
      if (!isGuest) {
        // Authenticated user - fetch from backend
        try {
          const cartData = await getCart();
          dispatch(setCartItems(cartData.items));
        } catch (error) {
          console.error("Failed to load cart:", error);
        }
      } else {
        // Guest user - load from localStorage
        const guestCart = localStorage.getItem("guestCart");
        if (guestCart) {
          const cartItems = JSON.parse(guestCart);
          dispatch(setCartItems(cartItems));
        }
      }
    };

    loadCart();
  }, [isGuest, dispatch]);

  /**
   * Handle successful payment
   * Redirected here with ?success=true query parameter
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      // Clear cart after successful payment
      dispatch(setCartItems([]));
      if (isGuest) {
        localStorage.removeItem("guestCart");
      }
    }
  }, [dispatch, isGuest]);

  /**
   * Handle continue shopping
   */
  const handleContinueShopping = () => {
    router.push("/products");
  };

  /**
   * Empty cart view
   */
  if (items.length === 0) {
    return (
      <Container maxW="container.lg" py={10}>
        <Box textAlign="center" py={20}>
          <Heading size="xl" mb={4}>
            Your cart is empty
          </Heading>
          <Text className="text-zinc-600 dark:text-zinc-400" mb={6}>
            Add some amazing products to your cart!
          </Text>
          <Button
            onClick={handleContinueShopping}
            className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  /**
   * Cart with items view
   */
  return (
    <Container maxW="container.xl" py={10}>
      {/* Page Header */}
      <Heading size="2xl" mb={2}>
        Shopping Cart
      </Heading>
      <Text className="text-zinc-600 dark:text-zinc-400" mb={8}>
        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
      </Text>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <Stack gap={4}>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) => {
                  // Handle quantity update
                  console.log("Update quantity:", quantity);
                }}
                onRemove={() => {
                  // Handle remove
                  console.log("Remove item");
                }}
              />
            ))}
          </Stack>

          {/* Continue Shopping Link */}
          <Box mt={6}>
            <Button
              variant="ghost"
              onClick={handleContinueShopping}
            >
              ← Continue Shopping
            </Button>
          </Box>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <Box
            className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 sticky top-4"
            borderWidth="1px"
          >
            <Heading size="lg" mb={4}>
              Order Summary
            </Heading>

            {/* Summary Details */}
            <Stack gap={3} mb={4}>
              <div className="flex justify-between">
                <Text>Subtotal</Text>
                <Text fontWeight="medium">₹{total.toFixed(2)}</Text>
              </div>
              
              <div className="flex justify-between">
                <Text>Shipping</Text>
                <Text fontWeight="medium" className="text-green-600">
                  Free
                </Text>
              </div>

              <Separator />

              <div className="flex justify-between">
                <Text fontSize="lg" fontWeight="bold">
                  Total
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  ₹{total.toFixed(2)}
                </Text>
              </div>
            </Stack>

            {/* Checkout Button with Razorpay Integration */}
            <CheckoutButton
              useRazorpay={true}
              disabled={items.length === 0}
            >
              Proceed to Payment
            </CheckoutButton>

            {/* Security Badge */}
            <Box mt={4} textAlign="center">
              <Text fontSize="sm" className="text-zinc-500">
                🔒 Secure payment powered by Razorpay
              </Text>
            </Box>

            {/* Payment Methods */}
            <Box mt={4} pt={4} borderTopWidth="1px">
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                We Accept:
              </Text>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-xs">
                  💳 Cards
                </div>
                <div className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-xs">
                  🏦 Net Banking
                </div>
                <div className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-xs">
                  📱 UPI
                </div>
                <div className="px-2 py-1 bg-white dark:bg-zinc-800 rounded text-xs">
                  👛 Wallets
                </div>
              </div>
            </Box>

            {/* Support Info */}
            <Box mt={4} pt={4} borderTopWidth="1px">
              <Text fontSize="sm" className="text-zinc-500">
                ✓ Free shipping on all orders<br />
                ✓ Easy returns within 30 days<br />
                ✓ 24/7 customer support
              </Text>
            </Box>
          </Box>
        </div>
      </div>

      {/* Trust Indicators */}
      <Box mt={12} pt={8} borderTopWidth="1px">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <Box>
            <Text fontSize="2xl" mb={2}>🚚</Text>
            <Text fontWeight="bold" mb={1}>Free Shipping</Text>
            <Text fontSize="sm" className="text-zinc-500">
              On all orders, always
            </Text>
          </Box>
          <Box>
            <Text fontSize="2xl" mb={2}>🔒</Text>
            <Text fontWeight="bold" mb={1}>Secure Payments</Text>
            <Text fontSize="sm" className="text-zinc-500">
              100% secure with Razorpay
            </Text>
          </Box>
          <Box>
            <Text fontSize="2xl" mb={2}>↩️</Text>
            <Text fontWeight="bold" mb={1}>Easy Returns</Text>
            <Text fontSize="sm" className="text-zinc-500">
              30 day return policy
            </Text>
          </Box>
        </div>
      </Box>
    </Container>
  );
}
