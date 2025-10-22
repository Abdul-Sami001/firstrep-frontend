// lib/api/reviews/index.ts - Reviews API Module
import { api } from '../client';

// Backend-Matching Types (based on your Django models)
export interface ReviewMedia {
    id: string;
    review: string;
    media_type: 'image' | 'video';
    file: string; // URL to uploaded file
    caption: string;
    position: number;
    created_at: string;
}

export interface ReviewHelpful {
    id: string;
    review: string;
    user: string;
    created_at: string;
}

export interface Review {
    id: string;
    product: string; // Product ID
    product_name?: string; // Populated in list views
    user: string; // User ID
    user_name?: string; // Populated in list views
    user_email?: string; // Populated in list views
    rating: number; // 1-5
    title: string;
    content: string;
    is_verified_purchase: boolean;
    order?: string | null; // Order ID that verified purchase
    is_approved: boolean;
    is_flagged: boolean;
    flagged_reason?: string;
    helpful_count: number;
    media: ReviewMedia[];
    helpful_votes: ReviewHelpful[];
    created_at: string;
    updated_at: string;
}

export interface RatingStats {
    average_rating: number;
    review_count: number;
    verified_count: number;
    rating_distribution: {
        '1': number;
        '2': number;
        '3': number;
        '4': number;
        '5': number;
    };
}

export interface CreateReviewRequest {
    product: string;
    rating: number;
    title: string;
    content: string;
    media?: File[]; // Files to upload
}

export interface UpdateReviewRequest {
    rating?: number;
    title?: string;
    content?: string;
    media?: File[]; // New files to add
    remove_media?: string[]; // Media IDs to remove
}

export interface ReviewFilters {
    product?: string;
    rating?: number;
    is_verified_purchase?: boolean;
    is_approved?: boolean;
    ordering?: 'created_at' | '-created_at' | 'helpful_count' | '-helpful_count' | 'rating' | '-rating';
    search?: string;
}

export interface PaginatedReviews {
    count: number;
    next: string | null;
    previous: string | null;
    results: Review[];
}

// Production API Methods
export const reviewsApi = {
    // Create review with media upload
    createReview: (data: CreateReviewRequest) => {
        const formData = new FormData();
        formData.append('product', data.product);
        formData.append('rating', data.rating.toString());
        formData.append('title', data.title);
        formData.append('content', data.content);
        
        // Add media files
        if (data.media && data.media.length > 0) {
            data.media.forEach((file, index) => {
                formData.append(`media_${index}`, file);
            });
        }
        
        return api.post<Review>('/reviews/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Get reviews with filters and pagination
    getReviews: (params?: ReviewFilters & { page?: number; page_size?: number }) =>
        api.get<PaginatedReviews>('/reviews/', {
            params: {
                ...params,
                page_size: params?.page_size || 20,
            }
        }),

    // Get single review
    getReview: (id: string) =>
        api.get<Review>(`/reviews/${id}/`),

    // Update review
    updateReview: (id: string, data: UpdateReviewRequest) => {
        const formData = new FormData();
        
        if (data.rating !== undefined) formData.append('rating', data.rating.toString());
        if (data.title) formData.append('title', data.title);
        if (data.content) formData.append('content', data.content);
        
        // Add new media files
        if (data.media && data.media.length > 0) {
            data.media.forEach((file, index) => {
                formData.append(`media_${index}`, file);
            });
        }
        
        // Add media IDs to remove
        if (data.remove_media && data.remove_media.length > 0) {
            data.remove_media.forEach((mediaId, index) => {
                formData.append(`remove_media_${index}`, mediaId);
            });
        }
        
        return api.patch<Review>(`/reviews/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete review
    deleteReview: (id: string) =>
        api.delete(`/reviews/${id}/`),

    // Mark review as helpful (toggle)
    markHelpful: (id: string) =>
        api.post(`/reviews/${id}/mark_helpful/`),

    // Remove helpful vote
    unmarkHelpful: (id: string) =>
        api.delete(`/reviews/${id}/unmark_helpful/`),

    // Get current user's reviews
    getMyReviews: (params?: { page?: number; page_size?: number }) =>
        api.get<PaginatedReviews>('/reviews/my_reviews/', {
            params: {
                ...params,
                page_size: params?.page_size || 20,
            }
        }),

    // Get product reviews
    getProductReviews: async (productId: string, params?: Omit<ReviewFilters, 'product'> & { page?: number; page_size?: number }) => {
        console.log('Fetching product reviews for:', productId, 'with params:', params);
        try {
            const result = await api.get<PaginatedReviews>(`/reviews/products/${productId}/`, {
                params: {
                    ...params,
                    page_size: params?.page_size || 20,
                }
            });
            console.log('Product reviews API response:', result);
            return result;
        } catch (error) {
            console.error('Product reviews API error:', error);
            throw error;
        }
    },

    // Get product rating statistics
    getProductRatingStats: async (productId: string) => {
        console.log('Fetching rating stats for:', productId);
        try {
            const result = await api.get<RatingStats>(`/products/${productId}/rating-stats/`);
            console.log('Rating stats API response:', result);
            return result;
        } catch (error) {
            console.error('Rating stats API error:', error);
            throw error;
        }
    },
};
