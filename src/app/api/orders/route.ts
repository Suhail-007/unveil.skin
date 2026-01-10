import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Order, OrderItem, Product, sequelize } from '@/lib/models';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sequelize.authenticate();

    // Fetch user's orders with order items and products
    const orders = await Order.findAll({
      where: { userId: user.id },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'images', 'price'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      orders: orders.map(order => {
        const orderData = order;
        return {
          id: orderData.id,
          total: orderData.totalAmount,
          status: orderData.status,
          createdAt: orderData.created_at,
          orderItems: orderData.orderItems?.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            product: item.product
              ? {
                  name: item.product.name,
                  image: item.product.images?.[0]?.url,
                }
              : null,
          })),
        };
      }),
    });
  } catch (error) {
      console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
