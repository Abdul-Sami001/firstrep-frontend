// contexts/WishlistContext.tsx - Global Wishlist State Management
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { wishlistApi, Wishlist, WishlistItem } from '@/lib/api/wishlist';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { isExpectedError, logError, UnauthorizedError } from '@/lib/utils/errors';
import { isGuestCapableEndpoint } from '@/lib/utils/api-endpoints';
import { useToast } from '@/hooks/use-toast';

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
    const { toast } = useToast();
    const router = useRouter();

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
            toast({
                title: "Added to wishlist",
                description: "Product has been added to your wishlist.",
                variant: "default",
            });
        },
        onError: (error: any) => {
            logError(error, 'AddToWishlist');
            // Check if it's an authentication error
            if (error instanceof UnauthorizedError || error?.response?.status === 401) {
                toast({
                    title: "Login required",
                    description: "Please login to add items to your wishlist.",
                    variant: "destructive",
                    action: (
                        <button
                            onClick={() => router.push('/CustomerLogin')}
                            className="text-sm font-medium underline underline-offset-4 hover:no-underline"
                        >
                            Login
                        </button>
                    ),
                });
            } else {
                toast({
                    title: "Failed to add to wishlist",
                    description: error?.response?.data?.detail || error?.message || "Something went wrong. Please try again.",
                    variant: "destructive",
                });
            }
        },
    });

    // Remove from wishlist mutation
    const removeFromWishlistMutation = useMutation({
        mutationFn: wishlistApi.removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
            toast({
                title: "Removed from wishlist",
                description: "Product has been removed from your wishlist.",
                variant: "default",
            });
        },
        onError: (error: any) => {
            logError(error, 'RemoveFromWishlist');
            toast({
                title: "Failed to remove from wishlist",
                description: error?.response?.data?.detail || error?.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        },
    });

    // Clear wishlist mutation
    const clearWishlistMutation = useMutation({
        mutationFn: wishlistApi.clearWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
            toast({
                title: "Wishlist cleared",
                description: "All items have been removed from your wishlist.",
                variant: "default",
            });
        },
        onError: (error: any) => {
            logError(error, 'ClearWishlist');
            toast({
                title: "Failed to clear wishlist",
                description: error?.response?.data?.detail || error?.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
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
        // Check authentication before adding to wishlist
        if (!isAuthenticated) {
            toast({
                title: "Login required",
                description: "Please login to add items to your wishlist.",
                variant: "destructive",
                action: (
                    <button
                        onClick={() => router.push('/CustomerLogin')}
                        className="text-sm font-medium underline underline-offset-4 hover:no-underline"
                    >
                        Login
                    </button>
                ),
            });
            return;
        }
        addToWishlistMutation.mutate({ product: productId, variant: variantId });
    };

    const removeFromWishlist = (itemId: string) => {
        // Check authentication before removing from wishlist
        if (!isAuthenticated) {
            toast({
                title: "Login required",
                description: "Please login to manage your wishlist.",
                variant: "destructive",
                action: (
                    <button
                        onClick={() => router.push('/CustomerLogin')}
                        className="text-sm font-medium underline underline-offset-4 hover:no-underline"
                    >
                        Login
                    </button>
                ),
            });
            return;
        }
        removeFromWishlistMutation.mutate(itemId);
    };

    const toggleWishlist = (productId: string, variantId?: string, itemId?: string) => {
        // Check authentication before toggling wishlist
        if (!isAuthenticated) {
            toast({
                title: "Login required",
                description: "Please login to add items to your wishlist.",
                variant: "destructive",
                action: (
                    <button
                        onClick={() => router.push('/CustomerLogin')}
                        className="text-sm font-medium underline underline-offset-4 hover:no-underline"
                    >
                        Login
                    </button>
                ),
            });
            return;
        }
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
