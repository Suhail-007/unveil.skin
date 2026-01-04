import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { CartItem, Product } from '@/lib/sequelize/models';

export async function GET() {
  try {
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

    // Get all cart items for the user with product details
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    // Transform to match frontend cart item structure
    const formattedItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name || '',
      price: parseFloat(item.product?.price?.toString() || '0'),
      quantity: item.quantity,
      image: item.product?.image,
    }));

    return NextResponse.json(
      {
        items: formattedItems,
        message: 'Cart fetched successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
