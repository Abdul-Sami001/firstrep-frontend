// hooks/useCart.ts - Production-Ready Cart Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddToCartRequest } from '@/lib/api/cart';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Get current cart
export const useCart = () => {
    return useQuery({
        queryKey: QUERY_KEYS.CART.ALL,
        queryFn: cartApi.getCart,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

// Add item to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.addToCart,
        onSuccess: () => {
            // Invalidate cart queries to refetch updated cart
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
        onError: (error) => {
            console.error('Failed to add item to cart:', error);
        },
    });
};

// NEW: update cart item quantity (absolute)
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
            cartApi.updateCartItem(id, { quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
    });
};

// Remove item from cart
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.removeFromCart,
        onSuccess: () => {
            // Invalidate cart queries to refetch updated cart
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
        onError: (error) => {
            console.error('Failed to remove item from cart:', error);
        },
    });
};

// Checkout cart
export const useCheckout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.checkout,
        onSuccess: () => {
            // Invalidate cart queries to clear cart
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            // Invalidate orders queries to show new order
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
        },
        onError: (error) => {
            console.error('Failed to checkout:', error);
        },
    });
};
