import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import sequelize from '@/lib/sequelize';
import { Order } from '@/lib/models/Order';
import { OrderItem } from '@/lib/models/OrderItem';
import { Product } from '@/lib/models/Product';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

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
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'image', 'price'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => {
        const orderData = order.toJSON() as Order;
        return {
          id: orderData.id,
          total: orderData.total,
          status: orderData.status,
          createdAt: orderData.createdAt,
          orderItems: orderData.orderItems?.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            product: item.product
              ? {
                  name: item.product.name,
                  image: item.product.image,
                }
              : null,
          })),
        };
      }),
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
