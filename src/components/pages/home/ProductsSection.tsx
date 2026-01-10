import ProductsGrid from './ProductsGrid';
import ProductCard from "./ProductCard";
import { Product as ProductModel } from "@/lib/models";
import { type Product } from "@/lib/services/product.service";
import { Section } from "@/components/layout/Section";
import { unstable_cache } from "next/cache";

// Server-side data fetching with cache
const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    try {
      const products = await ProductModel.findAll({
        where: { is_active: true },
        order: [['created_at', 'DESC']],
      });

      return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        details_description: p.details_description,
        price: typeof p.price === 'string' ? p.price : String(p.price),
        images: p.images,
        videos: p.videos,
        stock: p.stock,
        category: p.category,
        benefits: p.benefits,
        how_to_use: p.how_to_use,
        dermatologist_notes: p.dermatologist_notes,
        content_markdown: p.content_markdown,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  ['all-products'],
  { revalidate: 3600, tags: ['products'] }
);

export default async function ProductsSection() {
  const products = await getProducts();

  return (
    <Section id="products">
      <ProductsGrid>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </ProductsGrid>
    </Section>
  );
}
