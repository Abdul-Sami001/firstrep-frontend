// hooks/useReviews.ts - Production-Ready Review Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi, Review, ReviewFilters, CreateReviewRequest, UpdateReviewRequest, RatingStats, PaginatedReviews } from '@/lib/api/reviews';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { logError } from '@/lib/utils/errors';
import { useAuth } from '@/contexts/AuthContext';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 3 * 60 * 1000; // 3 minutes
const STATS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Get product reviews with pagination and filters (public endpoint)
export const useProductReviews = (productId: string, filters?: ReviewFilters & { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.PRODUCT(productId, filters),
        queryFn: async () => {
            const response = await reviewsApi.getProductReviews(productId, filters);
            // Backend may return array directly or paginated format - normalize to paginated format
            if (Array.isArray(response)) {
                return {
                    count: response.length,
                    next: null,
                    previous: null,
                    results: response,
                } as PaginatedReviews;
            }
            // If already paginated, return as is
            return response;
        },
        enabled: !!productId,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000, // 10 minutes
        // Don't refetch on window focus to prevent excessive calls
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Reviews are public - retry on network errors, not on 4xx
            if (error && typeof error === 'object' && 'response' in error) {
                const status = (error as any).response?.status;
                if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
                    return false;
                }
            }
            return failureCount < 2;
        },
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
        queryKey: [...QUERY_KEYS.REVIEWS.MY(), params], // Include params in query key for proper caching
        queryFn: async () => {
            const response = await reviewsApi.getMyReviews(params);
            // Backend returns array directly, normalize to paginated format
            if (Array.isArray(response)) {
                return {
                    count: response.length,
                    next: null,
                    previous: null,
                    results: response,
                } as PaginatedReviews;
            }
            // If already paginated, return as is
            return response;
        },
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        // Don't refetch on window focus to prevent excessive calls
        refetchOnWindowFocus: false,
    });
};

// Get product rating statistics (cached, public endpoint)
export const useProductRatingStats = (productId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.REVIEWS.STATS(productId),
        queryFn: () => reviewsApi.getProductRatingStats(productId),
        enabled: !!productId,
        staleTime: STATS_STALE_TIME,
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: (failureCount, error) => {
            // Rating stats are public - retry on network errors, not on 4xx
            if (error && typeof error === 'object' && 'response' in error) {
                const status = (error as any).response?.status;
                if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
                    return false;
                }
            }
            return failureCount < 2;
        },
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
            logError(error, 'CreateReview');
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
            logError(error, 'UpdateReview');
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
            logError(error, 'DeleteReview');
        },
    });
};

// Toggle helpful vote mutation (optimistic update)
export const useToggleHelpful = (reviewId: string, productId?: string) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async () => {
            // Check if already helpful - look in product reviews list or detail
            let review: Review | undefined;
            
            // Try to get from product reviews list first
            if (productId) {
                const productReviews = queryClient.getQueryData<PaginatedReviews>(
                    QUERY_KEYS.REVIEWS.PRODUCT(productId)
                );
                review = productReviews?.results?.find(r => r.id === reviewId);
            }
            
            // Fallback to detail query
            if (!review) {
                review = queryClient.getQueryData<Review>(QUERY_KEYS.REVIEWS.DETAIL(reviewId));
            }
            
            // Check if user has already voted
            const hasVoted = review?.helpful_votes?.some(vote => vote.user === user?.id) || false;
            
            // Call appropriate endpoint based on current vote state
            if (hasVoted) {
                return reviewsApi.unmarkHelpful(reviewId);
            } else {
                return reviewsApi.markHelpful(reviewId);
            }
        },
        onMutate: async () => {
            // Cancel outgoing refetches for both detail and product reviews
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.REVIEWS.DETAIL(reviewId) });
            if (productId) {
                await queryClient.cancelQueries({ queryKey: QUERY_KEYS.REVIEWS.PRODUCT(productId) });
            }

            // Snapshot previous values
            const previousReview = queryClient.getQueryData<Review>(QUERY_KEYS.REVIEWS.DETAIL(reviewId));
            const previousProductReviews = productId 
                ? queryClient.getQueryData<PaginatedReviews>(QUERY_KEYS.REVIEWS.PRODUCT(productId))
                : null;

            // Check if user has already voted to determine toggle direction
            const hasVoted = previousReview?.helpful_votes?.some(vote => vote.user === user?.id) || false;
            const countChange = hasVoted ? -1 : 1;

            // Optimistically update product reviews list if available
            if (productId && previousProductReviews) {
                const updatedResults = previousProductReviews.results.map(r => {
                    if (r.id === reviewId) {
                        const newHelpfulCount = Math.max(0, r.helpful_count + countChange);
                        const updatedVotes = hasVoted
                            ? (r.helpful_votes || []).filter(vote => vote.user !== user?.id)
                            : [...(r.helpful_votes || []), {
                                id: 'temp',
                                review: reviewId,
                                user: user?.id || '',
                                created_at: new Date().toISOString()
                            }];
                        return {
                            ...r,
                            helpful_count: newHelpfulCount,
                            helpful_votes: updatedVotes,
                        };
                    }
                    return r;
                });

                queryClient.setQueryData(QUERY_KEYS.REVIEWS.PRODUCT(productId), {
                    ...previousProductReviews,
                    results: updatedResults,
                });
            }

            // Optimistically update detail query if available
            if (previousReview) {
                const newHelpfulCount = Math.max(0, previousReview.helpful_count + countChange);
                const updatedVotes = hasVoted
                    ? (previousReview.helpful_votes || []).filter(vote => vote.user !== user?.id)
                    : [...(previousReview.helpful_votes || []), {
                        id: 'temp',
                        review: reviewId,
                        user: user?.id || '',
                        created_at: new Date().toISOString()
                    }];
                queryClient.setQueryData(QUERY_KEYS.REVIEWS.DETAIL(reviewId), {
                    ...previousReview,
                    helpful_count: newHelpfulCount,
                    helpful_votes: updatedVotes,
                });
            }

            return { previousReview, previousProductReviews };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousReview) {
                queryClient.setQueryData(QUERY_KEYS.REVIEWS.DETAIL(reviewId), context.previousReview);
            }
            if (context?.previousProductReviews && productId) {
                queryClient.setQueryData(QUERY_KEYS.REVIEWS.PRODUCT(productId), context.previousProductReviews);
            }
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.DETAIL(reviewId) });
            if (productId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.PRODUCT(productId) });
            }
        },
    });
};
