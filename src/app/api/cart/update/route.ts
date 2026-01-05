import { NextResponse } from 'next/server';
import { CartItem } from '@/lib/models/CartItem';
import { requireAuth } from '@/lib/auth/session';

export async function PUT(request: Request) {
  try {
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Require authentication - throws 401 if not authenticated
    const { userId } = await requireAuth();

    // Find cart item and verify ownership
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    return NextResponse.json(
      {
        cartItem: cartItem,
        message: 'Cart item updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
