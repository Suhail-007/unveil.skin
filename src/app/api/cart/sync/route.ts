import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CartItem } from '@/lib/sequelize/models';

export async function POST(request: Request) {
  try {
    const { guestCart } = await request.json();

    if (!guestCart || !Array.isArray(guestCart)) {
      return NextResponse.json(
        { error: 'Guest cart data is required' },
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

    // Merge guest cart with user cart
    for (const item of guestCart) {
      const existingCartItem = await CartItem.findOne({
        where: { userId, productId: item.productId },
      });

      if (existingCartItem) {
        // Update quantity if item already exists
        existingCartItem.quantity += item.quantity;
        await existingCartItem.save();
      } else {
        // Create new cart item
        await CartItem.create({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    return NextResponse.json(
      { message: 'Cart synced successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
