"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  Separator,
  Drawer,
} from "@chakra-ui/react";
import CartItem from "./CartItem";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setCartItems, updateQuantity, removeFromCart } from "@/lib/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import { updateCartItem, removeCartItem } from "@/lib/services/cart.service";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
      // For guests, just update Redux
      dispatch(updateQuantity({ id, quantity }));
    } else {
      // For authenticated users, call API
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
      // For guests, just update Redux
      dispatch(removeFromCart(id));
    } else {
      // For authenticated users, call API
      try {
        await removeCartItem({ cartItemId: id });
        dispatch(removeFromCart(id));
      } catch (error) {
        console.error("Failed to remove from cart:", error);
      }
    }
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/cart");
      onClose();
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={(details) => !details.open && onClose()} placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Shopping Cart</Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body>
            {items.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text className="text-zinc-500 dark:text-zinc-400">
                  Your cart is empty
                </Text>
              </Box>
            ) : (
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
            )}
          </Drawer.Body>

          {items.length > 0 && (
            <Drawer.Footer>
              <Stack width="full" gap={4}>
                <Separator className="border-zinc-200 dark:border-zinc-800" />
                
                <Box>
                  <Stack direction="row" justify="space-between" mb={2}>
                    <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
                      Items ({itemCount})
                    </Text>
                    <Text fontSize="sm" fontWeight="medium">
                      ₹{total.toFixed(2)}
                    </Text>
                  </Stack>
                  <Stack direction="row" justify="space-between">
                    <Text fontWeight="semibold" className="text-black dark:text-white">
                      Total
                    </Text>
                    <Text fontWeight="bold" fontSize="lg" className="text-black dark:text-white">
                      ₹{total.toFixed(2)}
                    </Text>
                  </Stack>
                </Box>

                <Button
                  size="lg"
                  onClick={handleCheckout}
                  className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </Drawer.Footer>
          )}
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
