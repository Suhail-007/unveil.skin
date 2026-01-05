import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { Product } from '@/lib/models/Product';
import { CartItem } from '@/lib/models/CartItem';

export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // For authenticated users, save to database
    if (session?.user) {
      const userId = session.user.id;

      // Check if item already exists in cart
      const existingCartItem = await CartItem.findOne({
        where: { userId, productId },
      });

      if (existingCartItem) {
        // Update quantity
        existingCartItem.quantity += quantity;
        await existingCartItem.save();

        return NextResponse.json(
          {
            cartItem: existingCartItem,
            message: 'Cart updated successfully',
          },
          { status: 200 }
        );
      } else {
        // Create new cart item
        const newCartItem = await CartItem.create({
          userId,
          productId,
          quantity,
        });

        return NextResponse.json(
          {
            cartItem: newCartItem,
            message: 'Item added to cart successfully',
          },
          { status: 201 }
        );
      }
    }

    // For guest users, return product info to store in localStorage
    return NextResponse.json(
      {
        product: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.toString()),
          image: product.image,
        },
        quantity,
        message: 'Item added to cart (guest mode)',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
