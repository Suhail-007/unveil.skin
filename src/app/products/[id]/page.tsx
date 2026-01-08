import { Suspense } from 'react';
import ProductPageContent from '@/components/pages/products/ProductPageContent';
import ProductPageSkeleton from '@/components/pages/products/ProductPageSkeleton';
import { Product } from '@/lib/models';
import { type Product as ProductType } from '@/lib/services/product.service';
import { unstable_cache } from 'next/cache';

// Cache the page for 1 hour (3600 seconds)
export const revalidate = 3600;

const getProduct = unstable_cache(
  async (id: string): Promise<ProductType | null> => {
    try {
      const product = await Product.findOne({
        where: { id, is_active: true },
      });

    if (!product) return null;

    return {
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
    };
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  ['product-by-id'],
  { revalidate: 3600, tags: ['products'] }
);

// Generate static params for all active products at build time
export async function generateStaticParams() {
  const products = await Product.findAll({
    where: { is_active: true },
    attributes: ['id'],
  });

  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const s = await params;
  console.log('🚀 ~ ProductPage ~ params:', s);
  const product = await getProduct(s.id);

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent product={product} />
    </Suspense>
  );
}
