// contexts/WishlistContext.tsx - Global Wishlist State Management
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi, Wishlist, WishlistItem } from '@/lib/api/wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_KEYS } from '@/lib/utils/constants';

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

    // Get wishlist data
    const { data: wishlist, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.WISHLIST.ALL,
        queryFn: async () => {
            console.log('Fetching wishlist...');
            try {
                const result = await wishlistApi.getWishlist();
                console.log('Wishlist API response:', result);
                return result;
            } catch (err) {
                console.error('Wishlist API error:', err);
                throw err;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: true, // Always enabled for both guest and authenticated users
    });

    // Add to wishlist mutation
    const addToWishlistMutation = useMutation({
        mutationFn: wishlistApi.addToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            console.error('Failed to add to wishlist:', error);
        },
    });

    // Remove from wishlist mutation
    const removeFromWishlistMutation = useMutation({
        mutationFn: wishlistApi.removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            console.error('Failed to remove from wishlist:', error);
        },
    });

    // Clear wishlist mutation
    const clearWishlistMutation = useMutation({
        mutationFn: wishlistApi.clearWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            console.error('Failed to clear wishlist:', error);
        },
    });

    // Merge guest wishlist on login
    const mergeGuestWishlistMutation = useMutation({
        mutationFn: wishlistApi.mergeGuestWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
        },
        onError: (error) => {
            console.error('Failed to merge guest wishlist:', error);
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
