import { NextResponse } from 'next/server';
import { CartItem, sequelize } from '@/lib/models';
import { requireAuth } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    const { guestCart } = await request.json();

    if (!guestCart || !Array.isArray(guestCart)) {
      return NextResponse.json(
        { error: 'Guest cart data is required' },
        { status: 400 }
      );
    }

    // Require authentication - throws 401 if not authenticated
    const { userId } = await requireAuth();

    // Get all product IDs from guest cart
    const productIds = guestCart.map(item => item.productId);

    // Fetch all existing cart items in a single query
    const existingCartItems = await CartItem.findAll({
      where: {
        userId,
        productId: productIds,
      },
    });

    // Create a map for quick lookups
    const existingItemsMap = new Map(
      existingCartItems.map(item => [item.productId, item])
    );

    // Use a transaction to ensure atomicity
    await sequelize.transaction(async (t) => {
      for (const item of guestCart) {
        const existingItem = existingItemsMap.get(item.productId);

        if (existingItem) {
          // Update quantity for existing item
          existingItem.quantity += item.quantity;
          await existingItem.save({ transaction: t });
        } else {
          // Create new item
          await CartItem.create({
            userId,
            productId: item.productId,
            quantity: item.quantity,
          }, { transaction: t });
        }
      }
    });

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
