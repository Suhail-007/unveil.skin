import { NextResponse } from 'next/server';
import { Product } from '@/lib/models';

export async function GET() {
  try {
    const products = await Product.findAll({
      where: { is_active: true },
      order: [['created_at', 'ASC']],
    });

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price.toString()),
      images: product.images,
      videos: product.videos,
      slug: product.slug,
      stock: product.stock,
      category: product.category,
      benefits: product.benefits,
      how_to_use: product.how_to_use,
      dermatologist_notes: product.dermatologist_notes,
      content_markdown: product.content_markdown,
      details_description: product.details_description,
    }));

    return NextResponse.json(
      {
        products: formattedProducts,
        message: 'Products fetched successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
