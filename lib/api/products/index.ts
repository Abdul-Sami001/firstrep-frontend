// lib/api/products/index.ts
import { api } from '../client';

// Types
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    images: string[];
    category: {
        id: string;
        name: string;
        slug: string;
    };
    brand?: {
        id: string;
        name: string;
    };
    variants: ProductVariant[];
    in_stock: boolean;
    stock_quantity: number;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: string;
    size: string;
    color: string;
    price?: number;
    stock_quantity: number;
    sku: string;
}

export interface ProductFilters {
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    search?: string;
    ordering?: 'name' | 'price' | '-price' | 'created_at' | '-created_at';
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// API Methods
export const productsApi = {
    // Get all products with pagination and filters
    getProducts: (params?: ProductFilters & { page?: number; page_size?: number }) =>
        api.get<PaginatedResponse<Product>>('/products/', { params }),

    // Get single product by ID or slug
    getProduct: (id: string) =>
        api.get<Product>(`/products/${id}/`),

    // Search products
    searchProducts: (query: string, filters?: Omit<ProductFilters, 'search'>) =>
        api.get<PaginatedResponse<Product>>('/products/search/', {
            params: { search: query, ...filters }
        }),

    // Get products by category
    getProductsByCategory: (categorySlug: string, filters?: Omit<ProductFilters, 'category'>) =>
        api.get<PaginatedResponse<Product>>(`/categories/${categorySlug}/products/`, {
            params: filters
        }),

    // Get featured products
    getFeaturedProducts: () =>
        api.get<Product[]>('/products/featured/'),

    // Get related products
    getRelatedProducts: (productId: string) =>
        api.get<Product[]>(`/products/${productId}/related/`),

    // Get product reviews
    getProductReviews: (productId: string) =>
        api.get<any[]>(`/products/${productId}/reviews/`),

    // Add product review
    addProductReview: (productId: string, review: { rating: number; comment: string }) =>
        api.post(`/products/${productId}/reviews/`, review),
};