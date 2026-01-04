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

    // Get all cart items for the user with product details using eager loading
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          required: true, // Inner join to ensure product exists
        },
      ],
    });

    // Transform to match frontend cart item structure using included product data
    const formattedItems = cartItems.map((item) => {
      // TypeScript doesn't know about the included association, so we cast it
      const product = (item as any).product as InstanceType<typeof Product>;
      
      return {
        id: item.id,
        productId: item.productId,
        name: product?.name || '',
        price: parseFloat(product?.price?.toString() || '0'),
        quantity: item.quantity,
        image: product?.image,
      };
    });

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
