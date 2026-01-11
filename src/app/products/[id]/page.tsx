import { Suspense } from 'react';
import ProductPageContent from '@/components/pages/products/ProductPageContent';
import ProductPageSkeleton from '@/components/pages/products/ProductPageSkeleton';
import { Product } from '@/lib/models';
import { type Product as ProductType } from '@/lib/services/product.service';
import { unstable_cache } from 'next/cache';
import { type Metadata } from 'next';

// Cache the page for 2 hours (7200 seconds)
export const revalidate = 7200;

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
  { revalidate: 7200, tags: ['products'] }
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

// Generate metadata for product pages
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found | unveil.skin',
      description: 'The product you are looking for could not be found.',
    };
  }

  const mainImage = product.images 
    ? Object.values(product.images).find(img => img.isMain)?.url || Object.values(product.images)[0]?.url
    : '/assets/placeholder.jpg';

  const displayPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);

  // Generate keywords from product data
  const keywords = [
    product.name,
    product.category,
    'ORDYN by unveil.skin',
    'dermatologist-formulated',
    'India skincare',
    ...(product.benefits ? Object.keys(product.benefits) : []),
  ].filter(Boolean).map(kw => kw!.toLowerCase());

  return {
    title: `${product.name} | unveil.skin`,
    description: product.details_description || product.description || `Shop ${product.name} from ORDYN by unveil.skin. Dermatologist-formulated skincare for Indian climates.`,
    keywords,
    openGraph: {
      title: `${product.name} | ORDYN by unveil.skin`,
      description: product.details_description || product.description || '',
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      siteName: 'unveil.skin',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ORDYN by unveil.skin`,
      description: product.details_description || product.description || '',
      images: [mainImage],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://unveil.skin'}/products/${id}`,
    },
    other: {
      'product:price:amount': displayPrice > 0 ? displayPrice.toFixed(2) : 'Coming Soon',
      'product:price:currency': 'INR',
      'product:availability': 'preorder',
      'product:brand': 'ORDYN by unveil.skin',
      'product:category': product.category || 'Skincare',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const s = await params;
  const product = await getProduct(s.id);

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent product={product} />
    </Suspense>
  );
}
