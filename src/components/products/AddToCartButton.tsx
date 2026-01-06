"use client";

import { useState, useEffect } from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addToCart as addToCartAction, updateQuantity, removeFromCart } from "@/lib/redux/slices/cartSlice";
import { addToCart as addToCartAPI, updateCartItem, removeCartItem } from "@/lib/services/cart.service";
import type { CartItem } from "@/lib/redux/slices/cartSlice";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice?: number;
  productImage?: string;
  onAddToCart?: () => void;
}

const MotionButton = motion(Button);
const MotionHStack = motion(HStack);

export default function AddToCartButton({ 
  productId, 
  productName,
  productPrice = 0,
  productImage,
  onAddToCart 
}: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);
  const { isGuest } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
  // Find existing cart item
  const existingItem = items.find(item => item.productId === productId);
  const quantity = existingItem?.quantity || 0;

  // Sync guest cart to localStorage
  useEffect(() => {
    if (isGuest && typeof window !== 'undefined') {
      localStorage.setItem('guestCart', JSON.stringify(items));
    }
  }, [items, isGuest]);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      if (isGuest) {
        // Guest mode: Add to Redux only
        const newItem: CartItem = {
          id: `temp-${Date.now()}`,
          productId,
          name: productName,
          price: productPrice,
          quantity: 1,
          image: productImage,
        };
        dispatch(addToCartAction(newItem));
      } else {
        // Authenticated: Call API
        const response = await addToCartAPI({ productId, quantity: 1 });
        
        // Refresh cart from API or update Redux based on response
        if (response.cartItem) {
          // If API returns the cart item, update Redux
          dispatch(addToCartAction(response.cartItem as CartItem));
        }
      }
      
      if (onAddToCart) {
        onAddToCart();
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (!existingItem) return;
    
    setIsLoading(true);
    try {
      const newQuantity = existingItem.quantity + 1;
      
      if (isGuest) {
        // Guest mode: Update Redux only
        dispatch(updateQuantity({ id: existingItem.id, quantity: newQuantity }));
      } else {
        // Authenticated: Call API
        await updateCartItem({ cartItemId: existingItem.id, quantity: newQuantity });
        dispatch(updateQuantity({ id: existingItem.id, quantity: newQuantity }));
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (!existingItem) return;
    
    setIsLoading(true);
    try {
      const newQuantity = existingItem.quantity - 1;
      
      if (newQuantity === 0) {
        // Remove from cart
        if (isGuest) {
          dispatch(removeFromCart(existingItem.id));
        } else {
          await removeCartItem({ cartItemId: existingItem.id });
          dispatch(removeFromCart(existingItem.id));
        }
      } else {
        // Update quantity
        if (isGuest) {
          dispatch(updateQuantity({ id: existingItem.id, quantity: newQuantity }));
        } else {
          await updateCartItem({ cartItemId: existingItem.id, quantity: newQuantity });
          dispatch(updateQuantity({ id: existingItem.id, quantity: newQuantity }));
        }
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-14">
      <AnimatePresence mode="wait">
        {quantity === 0 ? (
          <MotionButton
            key="add-button"
            size="lg"
            borderRadius="full"
            px={8}
            h={14}
            fontSize="md"
            fontWeight="semibold"
            variant="outline"
            className="border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black w-full"
            onClick={handleAddToCart}
            disabled={isLoading}
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </MotionButton>
        ) : (
          <MotionHStack
            key="counter"
            h={14}
            borderRadius="full"
            border="2px"
            className="border-black dark:border-white"
            justify="space-between"
            px={4}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button
              size="sm"
              borderRadius="full"
              onClick={handleDecrement}
              variant="ghost"
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
              minW={10}
              disabled={isLoading}
            >
              −
            </Button>
            <Text fontSize="md" fontWeight="semibold" minW={8} textAlign="center">
              {quantity}
            </Text>
            <Button
              size="sm"
              borderRadius="full"
              onClick={handleIncrement}
              variant="ghost"
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
              minW={10}
              disabled={isLoading}
            >
              +
            </Button>
          </MotionHStack>
        )}
      </AnimatePresence>
    </div>
  );
}
