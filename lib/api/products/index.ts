// lib/api/products/index.ts - Production-Ready Types
import { api } from '../client';

// Backend-Matching Types
export interface Category {
    id: string;
    name: string;
    slug: string;
    parent?: string | null;
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

export interface Product {
    id: string;
    seller: string;
    category?: Category | null;
    title: string;
    slug: string;
    description: string;
    price: number;
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
    // Get categories
    getCategories: () =>
        api.get<Category[]>('/categories/'),

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