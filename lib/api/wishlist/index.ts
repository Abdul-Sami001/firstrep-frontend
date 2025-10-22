// lib/api/wishlist/index.ts - Wishlist API Module
import { api } from '../client';

// Backend-Matching Types (based on your Django models)
export interface WishlistItem {
    id: string;
    wishlist: string; // Wishlist ID
    product: string; // Product ID
    product_name?: string; // Populated in list views
    product_image?: string; // Populated in list views
    product_price?: number; // Populated in list views
    product_currency?: string; // Populated in list views
    variant?: string | null; // Variant ID
    variant_name?: string | null; // Populated in list views
    price_at_add: number;
    added_at: string;
}

export interface Wishlist {
    id: string;
    user?: string | null; // User ID (null for guest)
    session_key?: string | null; // Session key for guest
    items: WishlistItem[];
    created_at: string;
    updated_at: string;
}

export interface AddToWishlistRequest {
    product: string; // Product ID
    variant?: string; // Variant ID (optional)
}

export interface WishlistCheckResponse {
    is_in_wishlist: boolean;
    item_id?: string; // If in wishlist, the item ID
}

// Production API Methods
export const wishlistApi = {
    // Get current user's or guest's wishlist
    getWishlist: async () => {
        const response = await api.get<Wishlist[]>('/wishlist/');
        // Backend returns array with single wishlist, extract it
        return response[0] || null;
    },

    // Add item to wishlist
    addToWishlist: (data: AddToWishlistRequest) =>
        api.post<Wishlist>('/wishlist/add_item/', data),

    // Remove item from wishlist
    removeFromWishlist: (itemId: string) =>
        api.delete(`/wishlist/remove/${itemId}/`),

    // Clear entire wishlist
    clearWishlist: () =>
        api.post('/wishlist/clear/'),

    // Check if product is in wishlist
    checkInWishlist: (productId: string) =>
        api.get<WishlistCheckResponse>(`/wishlist/check_item/${productId}/`),

    // Merge guest wishlist to user account (called on login)
    mergeGuestWishlist: () =>
        api.post<Wishlist>('/wishlist/merge_guest/'),
};
