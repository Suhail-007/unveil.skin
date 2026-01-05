import { NextResponse } from 'next/server';
import { CartItem } from '@/lib/models/CartItem';
import { Product } from '@/lib/models/Product';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    // Require authentication - throws 401 if not authenticated
    const { userId } = await requireAuth();

    // Get all cart items for the user with product details
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [Product],
    });

    // Transform to match frontend cart item structure
    const formattedItems = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: parseFloat(item.product.price.toString()),
      quantity: item.quantity,
      image: item.product.image,
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
    
    // If it's a 401 auth error, rethrow it
    if (error instanceof Response && error.status === 401) {
      return error;
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
