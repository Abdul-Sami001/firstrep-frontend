// lib/api/cart/index.ts
import { api } from '../client';

// Types
export interface CartItem {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
        images: string[];
        slug: string;
    };
    variant?: {
        id: string;
        size: string;
        color: string;
        price?: number;
    };
    quantity: number;
    total_price: number;
    added_at: string;
}

export interface Cart {
    id: string;
    items: CartItem[];
    total_items: number;
    subtotal: number;
    shipping_cost: number;
    total: number;
    created_at: string;
    updated_at: string;
}

export interface AddToCartRequest {
    product_id: string;
    variant_id?: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

// API Methods
export const cartApi = {
    // Get current cart
    getCart: () =>
        api.get<Cart>('/cart/'),

    // Add item to cart
    addToCart: (data: AddToCartRequest) =>
        api.post<CartItem>('/cart/items/', data),

    // Update cart item quantity
    updateCartItem: (itemId: string, data: UpdateCartItemRequest) =>
        api.patch<CartItem>(`/cart/items/${itemId}/`, data),

    // Remove item from cart
    removeCartItem: (itemId: string) =>
        api.delete(`/cart/items/${itemId}/`),

    // Clear entire cart
    clearCart: () =>
        api.delete('/cart/'),

    // Apply coupon code
    applyCoupon: (code: string) =>
        api.post<{ discount_amount: number; message: string }>('/cart/coupon/', { code }),

    // Remove coupon
    removeCoupon: () =>
        api.delete('/cart/coupon/'),
};