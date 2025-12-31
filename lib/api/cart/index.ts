// lib/api/cart/index.ts
import { api } from '../client';

// Backend-Matching Types (based on your API response)
export interface CartItem {
    id: string;
    product: string; // Product ID
    product_name: string;
    variant?: string | null; // Variant ID
    variant_name?: string | null;
    quantity: number;
    price_at_time: number;
    subtotal: number;
    product_image?: string | null; // Product image URL
    size?: string | null; // Product size from variant
    color?: string | null; // Product color from variant
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

export interface CheckoutRequest {
    shipping_address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    payment_method: 'stripe' | 'paypal' | 'cod' | 'bank_transfer';
}

export interface CheckoutResponse {
    order_id: string;
    checkout_url: string;
    message: string;
}

// Production API Methods
export const cartApi = {
    // Get current cart (user or guest)
    getCart: () =>
        api.get<Cart>('/cart/'),

    // Add item to cart
    addToCart: (data: AddToCartRequest) =>
        api.post<Cart>('/cart/add/', data),

    // Update cart item quantity (using your PATCH endpoint)
    updateCartItem: (id: string, data: UpdateCartItemRequest) =>
        api.patch<Cart>(`/cart/items/${id}/`, data),

    // Remove item from cart
    removeFromCart: (itemId: string) =>
        api.delete(`/cart/remove/${itemId}/`),

    // Checkout cart (creates order and Stripe session)
    checkout: (data: CheckoutRequest) =>
        api.post<CheckoutResponse>('/cart/checkout/', data),
};