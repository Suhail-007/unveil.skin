import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CartItem } from '@/lib/sequelize/models';
import { Op } from 'sequelize';

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

    // Get all product IDs from guest cart
    const productIds = guestCart.map(item => item.productId);

    // Fetch all existing cart items in a single query
    const existingCartItems = await CartItem.findAll({
      where: { 
        userId,
        productId: {
          [Op.in]: productIds
        }
      },
    });

    // Create a map for quick lookups
    const existingItemsMap = new Map(
      existingCartItems.map(item => [item.productId, item])
    );

    // Prepare bulk operations
    const itemsToUpdate: CartItem[] = [];
    const itemsToCreate: { userId: string; productId: string; quantity: number }[] = [];

    for (const item of guestCart) {
      const existingItem = existingItemsMap.get(item.productId);
      
      if (existingItem) {
        // Update quantity for existing item
        existingItem.quantity += item.quantity;
        itemsToUpdate.push(existingItem);
      } else {
        // Prepare new item for bulk creation
        itemsToCreate.push({
          userId,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    // Perform bulk operations
    await Promise.all([
      ...itemsToUpdate.map(item => item.save()),
      itemsToCreate.length > 0 ? CartItem.bulkCreate(itemsToCreate) : Promise.resolve(),
    ]);

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
