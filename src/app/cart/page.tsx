"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Box, Button, Container, Heading, Stack, Text, Separator } from "@chakra-ui/react";
import CartItem from "@/components/cart/CartItem";
import CheckoutButton from "@/components/cart/CheckoutButton";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setCartItems, updateQuantity, removeFromCart } from "@/lib/redux/slices/cartSlice";
import { updateCartItem, removeCartItem } from "@/lib/services/cart.service";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);
  const { isGuest } = useAppSelector((state) => state.auth);

  // Load cart from localStorage for guests
  useEffect(() => {
    if (isGuest && typeof window !== "undefined") {
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        const cartItems = JSON.parse(guestCart);
        dispatch(setCartItems(cartItems));
      }
    }
  }, [isGuest, dispatch]);

  // Persist cart to localStorage for guests
  useEffect(() => {
    if (isGuest && typeof window !== "undefined") {
      localStorage.setItem("guestCart", JSON.stringify(items));
    }
  }, [items, isGuest]);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (isGuest) {
      dispatch(updateQuantity({ id, quantity }));
    } else {
      try {
        await updateCartItem({ cartItemId: id, quantity });
        dispatch(updateQuantity({ id, quantity }));
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    }
  };

  const handleRemove = async (id: string) => {
    if (isGuest) {
      dispatch(removeFromCart(id));
    } else {
      try {
        await removeCartItem({ cartItemId: id });
        dispatch(removeFromCart(id));
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    }
  };

  return (
    <Box minH="100vh" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      <Container maxW="5xl" py={20}>
        <Stack gap={8}>
          <Box>
            <Heading
              as="h1"
              fontSize="3xl"
              fontWeight="bold"
              mb={2}
              className="text-black dark:text-white"
            >
              Shopping Cart
            </Heading>
            <Text className="text-zinc-600 dark:text-zinc-400">
              {items.length > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
            </Text>
          </Box>

          {items.length === 0 ? (
            <Box
              p={12}
              borderRadius="2xl"
              textAlign="center"
              className="bg-white/80 dark:bg-zinc-950/70 border border-zinc-200/60 dark:border-zinc-800/60"
            >
              <Text fontSize="lg" mb={6} className="text-zinc-600 dark:text-zinc-400">
                Your cart is empty
              </Text>
              <Link href="/">
                <Button
                  className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Continue Shopping
                </Button>
              </Link>
            </Box>
          ) : (
            <Stack gap={6} direction={{ base: "column", lg: "row" }} align="start">
              <Box flex={1} width="full">
                <Stack gap={4}>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemove}
                    />
                  ))}
                </Stack>
              </Box>

              <Box
                width={{ base: "full", lg: "400px" }}
                p={6}
                borderRadius="2xl"
                className="bg-white/80 dark:bg-zinc-950/70 border border-zinc-200/60 dark:border-zinc-800/60 sticky top-6"
              >
                <Stack gap={4}>
                  <Heading as="h2" fontSize="xl" fontWeight="semibold" className="text-black dark:text-white">
                    Order Summary
                  </Heading>

                  <Separator className="border-zinc-200 dark:border-zinc-800" />

                  <Stack gap={2}>
                    <Stack direction="row" justify="space-between">
                      <Text className="text-zinc-600 dark:text-zinc-400">Subtotal</Text>
                      <Text fontWeight="medium">₹{total.toFixed(2)}</Text>
                    </Stack>
                    <Stack direction="row" justify="space-between">
                      <Text className="text-zinc-600 dark:text-zinc-400">Shipping</Text>
                      <Text fontWeight="medium" className="text-green-600 dark:text-green-400">
                        FREE
                      </Text>
                    </Stack>
                  </Stack>

                  <Separator className="border-zinc-200 dark:border-zinc-800" />

                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="bold" fontSize="lg" className="text-black dark:text-white">
                      Total
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" className="text-black dark:text-white">
                      ₹{total.toFixed(2)}
                    </Text>
                  </Stack>

                  <CheckoutButton />

                  <Link href="/">
                    <Button variant="ghost" width="full">
                      Continue Shopping
                    </Button>
                  </Link>
                </Stack>
              </Box>
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
