// lib/api/cart/index.ts - Production-Ready Cart API
import { api } from '../client';

// Backend-Matching Types
export interface CartItem {
    id: string;
    product: string; // Product ID
    product_name: string;
    variant?: string | null; // Variant ID
    variant_name?: string | null;
    quantity: number;
    price_at_time: number;
    subtotal: number;
}

export interface Cart {
    id: string;
    user?: string | null; // User ID
    session_key?: string | null;
    items: CartItem[];
    total: number;
}

export interface AddToCartRequest {
    product: string; // Product ID
    variant?: string; // Variant ID
    quantity?: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
export interface CheckoutResponse {
    detail: string;
    order_id: string;
}

// Production API Methods
export const cartApi = {
    // Get current cart (user or guest)
    getCart: () =>
        api.get<Cart>('/cart/'),

    // Add item to cart
    addToCart: (data: AddToCartRequest) =>
        api.post<Cart>('/cart/add/', data),

    updateCartItem: (id: string, data: UpdateCartItemRequest) =>
        api.patch<Cart>(`/cart/items/${id}/`, data),
    
    // Remove item from cart
    removeFromCart: (itemId: string) =>
        api.delete(`/cart/remove/${itemId}/`),

    // Checkout cart (create order)
    checkout: () =>
        api.post<CheckoutResponse>('/cart/checkout/'),
};