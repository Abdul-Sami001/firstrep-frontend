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
    price_at_time: number; // Price paid (current_price if on sale, retail_price if not)
    retail_price_at_time?: number; // Original/retail price at time of adding to cart (for showing savings)
    subtotal: number;
    product_image?: string | null; // Product image URL
    size?: string | null; // Product size from variant
    color?: string | null; // Product color from variant
    // Note: Backend should provide retail_price_at_time to show original price vs sale price
}

export interface AppliedPromotionInfo {
    code: string;
    name: string;
    discount_amount: string;
    description?: string;
}

export interface Cart {
    id: string;
    user?: string | null; // User ID
    session_key?: string | null;
    items: CartItem[];
    total: number;
    // Discount fields (from backend)
    applied_gift_card_code?: string | null;
    applied_gift_card_amount?: number | string;
    applied_referral_code?: string | null;
    applied_referral_discount?: number | string;
    applied_loyalty_points?: number;
    applied_loyalty_discount?: number | string;
    applied_promotion_code?: string | null;
    applied_promotion_discount?: number | string;
    applied_promotion_info?: AppliedPromotionInfo | null; // Promotion details from backend
    total_discount?: number | string;
}

export interface AddToCartRequest {
    product: string; // Product ID
    variant?: string; // Variant ID
    quantity?: number;
    // Note: Backend should use current_price (not retail_price) when storing price_at_time
    // If backend supports explicit price, we can add it here:
    // price?: number; // Optional: Explicit price to use (should be current_price if product is on sale)
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
    email?: string; // Required for guest checkout, optional for authenticated users
    payment_method: 'stripe' | 'paypal' | 'cod' | 'bank_transfer';
    storefront_id?: string; // Optional: UUID or slug of Storefront for reseller attribution
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