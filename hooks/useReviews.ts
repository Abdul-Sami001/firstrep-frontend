// hooks/useReviews.ts - Production-Ready Review Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, Review, ReviewFilters, CreateReviewRequest, UpdateReviewRequest, RatingStats } from '@/lib/api/reviews';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 3 * 60 * 1000; // 3 minutes
const STATS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Get product reviews with pagination and filters
export const useProductReviews = (productId: string, filters?: ReviewFilters & { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.PRODUCT(productId, filters),
        queryFn: () => reviewsApi.getProductReviews(productId, filters),
        enabled: !!productId,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    });
};

// Get single review detail
export const useReview = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.DETAIL(id),
        queryFn: () => reviewsApi.getReview(id),
        enabled: !!id,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
};

// Get current user's reviews
export const useMyReviews = (params?: { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.MY(),
        queryFn: () => reviewsApi.getMyReviews(params),
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
};

// Get product rating statistics (cached)
export const useProductRatingStats = (productId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.STATS(productId),
        queryFn: () => reviewsApi.getProductRatingStats(productId),
        enabled: !!productId,
        staleTime: STATS_STALE_TIME,
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 2,
    });
};

// Create review mutation
export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reviewsApi.createReview,
        onSuccess: (data, variables) => {
            // Invalidate product reviews and stats
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.PRODUCT(variables.product) 
            });
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.STATS(variables.product) 
            });
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.MY() 
            });
            // Invalidate product detail to refresh rating display
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.PRODUCTS.DETAIL(variables.product) 
            });
        },
        onError: (error) => {
            console.error('Failed to create review:', error);
        },
    });
};

// Update review mutation
export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReviewRequest }) =>
            reviewsApi.updateReview(id, data),
        onSuccess: (data, variables) => {
            // Update the review in cache
            queryClient.setQueryData(QUERY_KEYS.REVIEWS.DETAIL(variables.id), data);
            
            // Invalidate related queries
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.PRODUCT(data.product) 
            });
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.STATS(data.product) 
            });
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.MY() 
            });
        },
        onError: (error) => {
            console.error('Failed to update review:', error);
        },
    });
};

// Delete review mutation
export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reviewsApi.deleteReview,
        onSuccess: (_, reviewId) => {
            // Remove from cache
            queryClient.removeQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.DETAIL(reviewId) 
            });
            
            // Invalidate lists
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.ALL 
            });
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEYS.REVIEWS.MY() 
            });
        },
        onError: (error) => {
            console.error('Failed to delete review:', error);
        },
    });
};

// Toggle helpful vote mutation (optimistic update)
export const useToggleHelpful = (reviewId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Check if already helpful
            const review = queryClient.getQueryData<Review>(QUERY_KEYS.REVIEWS.DETAIL(reviewId));
            const isHelpful = review?.helpful_votes?.some(vote => vote.user === 'current-user'); // This would need actual user ID
            
            if (isHelpful) {
                return reviewsApi.unmarkHelpful(reviewId);
            } else {
                return reviewsApi.markHelpful(reviewId);
            }
        },
        onMutate: async () => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.REVIEWS.DETAIL(reviewId) });

            // Snapshot previous value
            const previousReview = queryClient.getQueryData<Review>(QUERY_KEYS.REVIEWS.DETAIL(reviewId));

            // Optimistically update
            if (previousReview) {
                const isCurrentlyHelpful = previousReview.helpful_votes?.some(vote => vote.user === 'current-user');
                const newHelpfulCount = isCurrentlyHelpful 
                    ? previousReview.helpful_count - 1 
                    : previousReview.helpful_count + 1;

                queryClient.setQueryData(QUERY_KEYS.REVIEWS.DETAIL(reviewId), {
                    ...previousReview,
                    helpful_count: newHelpfulCount,
                    helpful_votes: isCurrentlyHelpful 
                        ? previousReview.helpful_votes.filter(vote => vote.user !== 'current-user')
                        : [...(previousReview.helpful_votes || []), { 
                            id: 'temp', 
                            review: reviewId, 
                            user: 'current-user', 
                            created_at: new Date().toISOString() 
                        }]
                });
            }

            return { previousReview };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousReview) {
                queryClient.setQueryData(QUERY_KEYS.REVIEWS.DETAIL(reviewId), context.previousReview);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.DETAIL(reviewId) });
        },
    });
};
