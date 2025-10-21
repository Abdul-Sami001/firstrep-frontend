// hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddToCartRequest, UpdateCartItemRequest, CheckoutRequest } from '@/lib/api/cart';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Get cart
export const useCart = () => {
    return useQuery({
        queryKey: QUERY_KEYS.CART.ALL,
        queryFn: cartApi.getCart,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Add to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.addToCart,
        onSuccess: () => {
            // Invalidate cart queries to refresh cart
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
        onError: (error) => {
            console.error('Failed to add to cart:', error);
        },
    });
};

// Update cart item
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCartItemRequest }) =>
            cartApi.updateCartItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
        onError: (error) => {
            console.error('Failed to update cart item:', error);
        },
    });
};

// Remove from cart
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.removeFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
        onError: (error) => {
            console.error('Failed to remove from cart:', error);
        },
    });
};

// Checkout cart (creates order and Stripe session)
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