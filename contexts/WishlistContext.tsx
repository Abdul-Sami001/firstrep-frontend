// contexts/WishlistContext.tsx - Global Wishlist State Management
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi, Wishlist, WishlistItem } from '@/lib/api/wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { isExpectedError, logError } from '@/lib/utils/errors';
import { isGuestCapableEndpoint } from '@/lib/utils/api-endpoints';

interface WishlistContextType {
    wishlist: Wishlist | null | undefined;
    wishlistItems: WishlistItem[];
    addToWishlist: (productId: string, variantId?: string) => void;
    removeFromWishlist: (itemId: string) => void;
    toggleWishlist: (productId: string, variantId?: string, itemId?: string) => void;
    isInWishlist: (productId: string, variantId?: string) => boolean;
    getWishlistItemId: (productId: string, variantId?: string) => string | null;
    clearWishlist: () => void;
    totalItems: number;
    isLoading: boolean;
    error: any;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

interface WishlistProviderProps {
    children: React.ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
    const { isAuthenticated, user } = useAuth();
    const queryClient = useQueryClient();

    // Get wishlist data with silent error handling
    const { data: wishlist, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.WISHLIST.ALL,
        queryFn: async () => {
            try {
                const result = await wishlistApi.getWishlist();
                return result;
            } catch (err) {
                // Wishlist can work for guests (session-based) or authenticated users
                // 401 might be expected if backend requires auth, but we'll handle gracefully
                // Check if it's an expected error (protected endpoint)
                if (isExpectedError(err, '/wishlist/')) {
                    // Return null for unauthenticated users (expected behavior)
                    return null;
                }
                // Log unexpected errors
                logError(err, 'WishlistContext');
                // Return null to prevent UI crashes, but error state is still available
                return null;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: true, // Always enabled for both guest and authenticated users
        retry: (failureCount, error) => {
            // Don't retry on expected errors (authentication issues for protected endpoints)
            if (isExpectedError(error, '/wishlist/')) {
                return false;
            }
            // Retry unexpected errors up to 2 times
            return failureCount < 2;
        },
        retryDelay: 1000,
    });

    // Add to wishlist mutation
    const addToWishlistMutation = useMutation({
        mutationFn: wishlistApi.addToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            logError(error, 'AddToWishlist');
        },
    });

    // Remove from wishlist mutation
    const removeFromWishlistMutation = useMutation({
        mutationFn: wishlistApi.removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            logError(error, 'RemoveFromWishlist');
        },
    });

    // Clear wishlist mutation
    const clearWishlistMutation = useMutation({
        mutationFn: wishlistApi.clearWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            logError(error, 'ClearWishlist');
        },
    });

    // Merge guest wishlist on login
    const mergeGuestWishlistMutation = useMutation({
        mutationFn: wishlistApi.mergeGuestWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            logError(error, 'MergeGuestWishlist');
        },
    });

    // Trigger wishlist merge when user logs in
    useEffect(() => {
        if (isAuthenticated && user && !mergeGuestWishlistMutation.isPending) {
            // Check if we have a session-based wishlist to merge
            const currentWishlist = queryClient.getQueryData<Wishlist>(QUERY_KEYS.WISHLIST.ALL);
            if (currentWishlist?.session_key && !currentWishlist.user) {
                mergeGuestWishlistMutation.mutate();
            }
        }
    }, [isAuthenticated, user, queryClient, mergeGuestWishlistMutation]);

    const addToWishlist = (productId: string, variantId?: string) => {
        addToWishlistMutation.mutate({ product: productId, variant: variantId });
    };

    const removeFromWishlist = (itemId: string) => {
        removeFromWishlistMutation.mutate(itemId);
    };

    const toggleWishlist = (productId: string, variantId?: string, itemId?: string) => {
        if (itemId) {
            removeFromWishlist(itemId);
        } else {
            addToWishlist(productId, variantId);
        }
    };

    const isInWishlist = (productId: string, variantId?: string): boolean => {
        if (!wishlist?.items) return false;
        return wishlist.items.some((item: WishlistItem) => 
            item.product === productId && 
            (!variantId || item.variant === variantId)
        );
    };

    const getWishlistItemId = (productId: string, variantId?: string): string | null => {
        if (!wishlist?.items) return null;
        const item = wishlist.items.find((item: WishlistItem) => 
            item.product === productId && 
            (!variantId || item.variant === variantId)
        );
        return item?.id || null;
    };

    const clearWishlist = () => {
        clearWishlistMutation.mutate();
    };

    const wishlistItems = wishlist?.items || [];
    const totalItems = wishlistItems.length;

    const value: WishlistContextType = {
        wishlist,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistItemId,
        clearWishlist,
        totalItems,
        isLoading: isLoading || addToWishlistMutation.isPending || removeFromWishlistMutation.isPending,
        error: error || addToWishlistMutation.error || removeFromWishlistMutation.error,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
