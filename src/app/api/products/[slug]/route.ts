import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: id } = await params;

    const product = await Product.findOne({
      where: { id, is_active: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        details_description: product.details_description,
        price: typeof product.price === 'string' ? product.price : String(product.price),
        images: product.images,
        videos: product.videos,
        stock: product.stock,
        category: product.category,
        benefits: product.benefits,
        how_to_use: product.how_to_use,
        dermatologist_notes: product.dermatologist_notes,
        content_markdown: product.content_markdown,
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
