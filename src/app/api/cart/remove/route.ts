import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CartItem } from '@/lib/sequelize/models';

export async function DELETE(request: Request) {
  try {
    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Find cart item and verify ownership
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Delete cart item
    await cartItem.destroy();

    return NextResponse.json(
      { message: 'Cart item removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
