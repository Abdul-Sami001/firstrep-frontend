// hooks/useWishlist.ts - Production-Ready Wishlist Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi, Wishlist, AddToWishlistRequest, WishlistCheckResponse } from '@/lib/api/wishlist';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes

// Get current user's or guest's wishlist
export const useWishlist = () => {
    return useQuery({
        queryKey: QUERY_KEYS.WISHLIST.ALL,
        queryFn: wishlistApi.getWishlist,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    });
};

// Check if product is in wishlist (cached boolean check)
export const useIsInWishlist = (productId: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.WISHLIST.CHECK(productId),
        queryFn: () => wishlistApi.checkInWishlist(productId),
        enabled: !!productId,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        select: (data: WishlistCheckResponse) => data.is_in_wishlist,
    });
};

// Add to wishlist mutation (optimistic update)
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.addToWishlist,
        onMutate: async (variables) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
            await queryClient.cancelQueries({ 
                queryKey: QUERY_KEYS.WISHLIST.CHECK(variables.product) 
            });

            // Snapshot previous values
            const previousWishlist = queryClient.getQueryData<Wishlist>(QUERY_KEYS.WISHLIST.ALL);
            const previousCheck = queryClient.getQueryData<WishlistCheckResponse>(
                QUERY_KEYS.WISHLIST.CHECK(variables.product)
            );

            // Optimistically update wishlist
            if (previousWishlist) {
                const newItem = {
                    id: `temp-${Date.now()}`,
                    wishlist: previousWishlist.id,
                    product: variables.product,
                    variant: variables.variant || null,
                    price_at_add: 0, // Will be updated by backend
                    added_at: new Date().toISOString(),
                };

                queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, {
                    ...previousWishlist,
                    items: [...previousWishlist.items, newItem],
                });
            }

            // Optimistically update check result
            queryClient.setQueryData(QUERY_KEYS.WISHLIST.CHECK(variables.product), {
                is_in_wishlist: true,
                item_id: `temp-${Date.now()}`,
            });

            return { previousWishlist, previousCheck };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousWishlist) {
                queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, context.previousWishlist);
            }
            if (context?.previousCheck) {
                queryClient.setQueryData(
                    QUERY_KEYS.WISHLIST.CHECK(variables.product), 
                    context.previousCheck
                );
            }
        },
        onSuccess: (data, variables) => {
            // Update cache with real data
            queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, data);
            queryClient.setQueryData(QUERY_KEYS.WISHLIST.CHECK(variables.product), {
                is_in_wishlist: true,
                item_id: data.items[data.items.length - 1]?.id,
            });
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
    });
};

// Remove from wishlist mutation (optimistic update)
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.removeFromWishlist,
        onMutate: async (itemId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });

            // Snapshot previous value
            const previousWishlist = queryClient.getQueryData<Wishlist>(QUERY_KEYS.WISHLIST.ALL);

            // Optimistically update
            if (previousWishlist) {
                const itemToRemove = previousWishlist.items.find(item => item.id === itemId);
                
                queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, {
                    ...previousWishlist,
                    items: previousWishlist.items.filter(item => item.id !== itemId),
                });

                // Update check result for this product
                if (itemToRemove) {
                    queryClient.setQueryData(QUERY_KEYS.WISHLIST.CHECK(itemToRemove.product), {
                        is_in_wishlist: false,
                    });
                }
            }

            return { previousWishlist };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousWishlist) {
                queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, context.previousWishlist);
            }
        },
        onSuccess: (data, variables) => {
            // Update cache with real data
            queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, data);
        },
        onSettled: () => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
    });
};

// Clear wishlist mutation
export const useClearWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.clearWishlist,
        onSuccess: (data) => {
            // Update cache with empty wishlist
            queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, data);
            
            // Invalidate all check queries
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.CHECK('') });
        },
        onError: (error) => {
            console.error('Failed to clear wishlist:', error);
        },
    });
};

// Merge guest wishlist to user account (called on login)
export const useMergeGuestWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.mergeGuestWishlist,
        onSuccess: (data) => {
            // Update cache with merged wishlist
            queryClient.setQueryData(QUERY_KEYS.WISHLIST.ALL, data);
            
            // Invalidate all check queries to refresh
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            console.error('Failed to merge guest wishlist:', error);
        },
    });
};

// Toggle wishlist item (add if not present, remove if present)
export const useToggleWishlist = () => {
    const addMutation = useAddToWishlist();
    const removeMutation = useRemoveFromWishlist();

    return {
        mutate: async (productId: string, variantId?: string, itemId?: string) => {
            if (itemId) {
                // Item exists, remove it
                return removeMutation.mutate(itemId);
            } else {
                // Item doesn't exist, add it
                return addMutation.mutate({ product: productId, variant: variantId });
            }
        },
        isPending: addMutation.isPending || removeMutation.isPending,
        error: addMutation.error || removeMutation.error,
    };
};
