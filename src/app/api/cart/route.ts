import { NextResponse } from 'next/server';
import { getSessionFromHeaders, requireAuth } from '@/lib/auth/session';
import { CartItem, Product } from '@/lib/models';

export async function GET() {
  try {
    const { userId } = await requireAuth();

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
        },
      ],
    });

    const formattedItems = cartItems.map(item => {
      const product = item.product;

      return {
        id: item.id,
        productId: item.productId,
        name: product?.name ?? '',
        price: product?.price != null ? parseFloat(product.price.toString()) : 0,
        quantity: item.quantity,
        image: product?.image ?? null,
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

    if (error instanceof Response && error.status === 401) {
      return error;
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: { productId?: string; quantity?: number } = await request.json();
    const productId = body.productId;
    const quantity = typeof body.quantity === 'number' ? body.quantity : 1;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const session = await getSessionFromHeaders();

    if (session.isAuthenticated && session.userId) {
      const userId = session.userId;

      const existingCartItem = await CartItem.findOne({
        where: { userId, productId },
      });

      if (existingCartItem) {
        existingCartItem.quantity += quantity;
        await existingCartItem.save();

        return NextResponse.json({ cartItem: existingCartItem, message: 'Cart updated successfully' }, { status: 200 });
      }

      const newCartItem = await CartItem.create({
        userId,
        productId,
        quantity,
      });

      return NextResponse.json({ cartItem: newCartItem, message: 'Item added to cart successfully' }, { status: 201 });
    }

    return NextResponse.json(
      {
        product: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.toString()),
          image: product.image ?? null,
        },
        quantity,
        message: 'Item added to cart (guest mode)',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: 'Cart item ID and quantity are required' }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
    }

    const { userId } = await requireAuth();

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return NextResponse.json({ cartItem, message: 'Cart item updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update cart error:', error);

    if (error instanceof Response && error.status === 401) {
      return error;
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID is required' }, { status: 400 });
    }

    const { userId } = await requireAuth();

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await cartItem.destroy();

    return NextResponse.json({ message: 'Cart item removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Remove from cart error:', error);

    if (error instanceof Response && error.status === 401) {
      return error;
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
