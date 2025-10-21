// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderFilters } from '@/lib/api/orders';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// Get user's orders
export const useOrders = (filters?: OrderFilters) => {
    return useQuery({
        queryKey: QUERY_KEYS.ORDERS.LIST(filters),
        queryFn: () => ordersApi.getOrders(filters),
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

// Get single order details
export const useOrder = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.ORDERS.DETAIL(id),
        queryFn: () => ordersApi.getOrder(id),
        enabled: !!id,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 2,
    });
};

// Cancel order
export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ordersApi.cancelOrder,
        onSuccess: (_, orderId) => {
            // Invalidate orders queries to refetch updated order
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAIL(orderId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
        },
        onError: (error) => {
            console.error('Failed to cancel order:', error);
        },
    });
};