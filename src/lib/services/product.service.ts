/**
 * Products Service - Handles all product API calls
 */

export interface MediaItem {
  isMain: boolean;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  images: MediaItem[] | null;
  videos: MediaItem[] | null;
  slug: string;
  stock: number;
  category: string | null;
  benefits?: Record<string, string> | null;
  how_to_use?: Record<string, string> | null;
  dermatologist_notes?: Record<string, string> | null;
  content_markdown?: string | null;
  details_description?: string | null;
}

export interface ProductsResponse {
  products: Product[];
  message?: string;
  error?: string;
}

// Route constants
export const PRODUCT_ROUTES = {
  BASE: '/api/products',
} as const;

// API Functions
export async function getProducts(): Promise<ProductsResponse> {
  const response = await fetch(PRODUCT_ROUTES.BASE, {
    cache: 'no-store', // Always fetch fresh data
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to fetch products');
  }

  return response.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { products } = await getProducts();
    return products.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
