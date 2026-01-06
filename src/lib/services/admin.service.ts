// Admin API Routes
export const ADMIN_ROUTES = {
  PRODUCTS: {
    BASE: "/api/admin/products",
    BY_ID: (id: string) => `/api/admin/products?id=${id}`,
  },
} as const;

// Types
export interface Benefit {
  id?: number;
  title: string;
  description: string;
  icon?: string;
}

export type HowToUseStep = string;

export interface DermatologistNote {
  id?: number;
  note: string;
}

export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  isActive: boolean;
  benefits?: Benefit[];
  howToUse?: string[];
  dermatologistNotes?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: string;
  category: string | null;
  image: string | null;
  slug: string;
  stock: number;
  is_active: boolean;
  benefits: any[] | null;
  how_to_use: any[] | null;
  dermatologist_notes: any[] | null;
  created_at: Date;
  updated_at: Date;
}

// Get all products (admin)
export async function getAllProducts(): Promise<ProductResponse[]> {
  const response = await fetch(ADMIN_ROUTES.PRODUCTS.BASE, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch products");
  }

  const data = await response.json();
  return data.products;
}

// Get single product (admin)
export async function getProduct(id: string): Promise<ProductResponse> {
  const response = await fetch(ADMIN_ROUTES.PRODUCTS.BY_ID(id), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch product");
  }

  const data = await response.json();
  return data.product;
}

// Create new product
export async function createProduct(
  productData: ProductFormData
): Promise<ProductResponse> {
  const response = await fetch(ADMIN_ROUTES.PRODUCTS.BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create product");
  }

  const data = await response.json();
  return data.product;
}

// Update product
export async function updateProduct(
  id: string,
  updates: Partial<ProductFormData>
): Promise<ProductResponse> {
  const response = await fetch(ADMIN_ROUTES.PRODUCTS.BASE, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update product");
  }

  const data = await response.json();
  return data.product;
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(ADMIN_ROUTES.PRODUCTS.BY_ID(id), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete product");
  }
}
