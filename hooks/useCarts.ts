// hooks/useCart.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, AddToCartRequest, UpdateCartItemRequest } from '@/lib/api/cart';
import { QUERY_KEYS } from '@/lib/utils/constants';

export const useCart = () => {
    return useQuery({
        queryKey: QUERY_KEYS.CART.ALL,
        queryFn: cartApi.getCart,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddToCartRequest) => cartApi.addToCart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, data }: { itemId: string; data: UpdateCartItemRequest }) =>
            cartApi.updateCartItem(itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => cartApi.removeCartItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
    });
};

export const useApplyCoupon = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (code: string) => cartApi.applyCoupon(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
        },
    });
};