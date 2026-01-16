// lib/api/products/index.ts - Production-Ready Types
import { api } from '../client';

// Backend-Matching Types
export interface Category {
    id: string;
    name: string;
    slug: string;
    parent?: string | null;
    children?: Category[]; // Nested categories
    image?: string | null; // Category image URL
    hover_image?: string | null; // Category hover image URL
}

export interface ProductVariant {
    id: string;
    product: string;
    sku: string;
    attributes: Record<string, any>; // JSON field from backend
    price_override?: number;
    stock: number;
    is_active: boolean;
}

export interface ProductImage {
    id: string;
    product: string;
    image: string; // URL to image
    alt_text: string;
    position: number;
}

// Sale information interface
export interface SaleInfo {
    sale_price: number;
    original_price: number;
    discount_amount: number;
    discount_percentage: number;
    sale?: {
        id: string;
        name?: string;
        description?: string;
        start_date?: string;
        end_date?: string;
        [key: string]: any;
    };
}

export interface Product {
    id: string;
    seller: string;
    category?: Category | null;
    title: string;
    slug: string;
    description: string;
    // Pricing fields
    price: number; // Legacy/backward compatibility - maps to retail_price
    retail_price: number; // Base/regular price - always present
    cost_price?: number; // Internal cost (admin/internal use only)
    current_price: number; // Price to display (sale price if on sale, otherwise retail_price)
    is_on_sale: boolean; // Boolean flag indicating if product has active sale
    sale_info?: SaleInfo | null; // Sale details (null if not on sale)
    currency: string;
    is_active: boolean;
    specifications: Record<string, any>; // JSON field
    popularity: number;
    created_at: string;
    updated_at: string;
    // Related data
    variants: ProductVariant[];
    images: ProductImage[];
    // Computed fields
    total_stock?: number;
    // Rating fields (added for reviews integration)
    average_rating?: number;
    review_count?: number;
    verified_review_count?: number;
    rating_distribution?: Record<string, number>;
}

export interface ProductFilters {
    category__slug?: string;
    currency?: string;
    is_active?: boolean;
    search?: string;
    ordering?: 'price' | '-price' | 'created_at' | '-created_at' | 'popularity' | '-popularity' | 'title' | '-title';
    min_price?: number;
    max_price?: number;
    seller?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Production API Methods
export const productsApi = {
    // Get categories (returns paginated response)
    getCategories: () =>
        api.get<PaginatedResponse<Category>>('/categories/'),

    // Get all products with pagination and filters
    getProducts: (params?: ProductFilters & { page?: number; page_size?: number }) =>
        api.get<PaginatedResponse<Product>>('/products/', {
            params: {
                ...params,
                page_size: params?.page_size || 20,
            }
        }),

    // Get single product by UUID
    getProduct: (id: string) =>
        api.get<Product>(`/products/${id}/`),

    // Get seller's products
    getMyProducts: (params?: { page?: number; page_size?: number }) =>
        api.get<PaginatedResponse<Product>>('/my/', {
            params: {
                ...params,
                page_size: params?.page_size || 20,
            }
        }),

    // Create product (for sellers)
    createProduct: (data: Partial<Product>) =>
        api.post<Product>('/products/', data),

    // Update product (for sellers)
    updateProduct: (id: string, data: Partial<Product>) =>
        api.patch<Product>(`/products/${id}/`, data),

    // Delete product (for sellers)
    deleteProduct: (id: string) =>
        api.delete(`/products/${id}/`),
};