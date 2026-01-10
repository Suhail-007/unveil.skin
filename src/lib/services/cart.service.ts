/**
 * Cart Service - Handles all cart API calls
 */

import type { CartItem } from '@/lib/redux/slices/cartSlice';

// Route constants
export const CART_ROUTES = {
  BASE: '/api/cart',
  SYNC: '/api/cart/sync',
} as const;

// Types
export interface CartResponse {
  items: CartItem[];
  error?: string;
}

export interface AddToCartParams {
  productId: string;
  quantity?: number;
}

export interface UpdateCartParams {
  cartItemId: string;
  quantity: number;
}

export interface RemoveFromCartParams {
  cartItemId: string;
}

export interface SyncCartParams {
  guestCart: CartItem[];
}

// API Functions
export async function getCart(): Promise<CartResponse> {
  const response = await fetch(CART_ROUTES.BASE);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to fetch cart');
  }

  return response.json();
}

export async function addToCart(params: AddToCartParams): Promise<{ cartItem?: unknown; product?: unknown; message: string }> {
  const response = await fetch(CART_ROUTES.BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to add to cart');
  }

  return data;
}

export async function updateCartItem(params: UpdateCartParams): Promise<{ success: boolean }> {
  const response = await fetch(CART_ROUTES.BASE, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to update cart');
  }

  return { success: true };
}

export async function removeCartItem(params: RemoveFromCartParams): Promise<{ success: boolean }> {
  const response = await fetch(CART_ROUTES.BASE, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to remove from cart');
  }

  return { success: true };
}

export async function syncGuestCart(params: SyncCartParams): Promise<{ message: string }> {
  const response = await fetch(CART_ROUTES.SYNC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to sync cart');
  }

  return data;
}
