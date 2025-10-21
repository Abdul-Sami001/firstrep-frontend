// hooks/usePayments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, VerifyPaymentRequest } from '@/lib/api/payments';
import { QUERY_KEYS } from '@/lib/utils/constants';

// Performance-optimized query options
const DEFAULT_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Get payment details
export const usePayment = (id: string) => {
    return useQuery({
        queryKey: ['payments', 'detail', id],
        queryFn: () => paymentsApi.getPayment(id),
        enabled: !!id,
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_CACHE_TIME,
        retry: 2,
    });
};

// Verify payment after Stripe checkout
export const useVerifyPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentsApi.verifyPayment,
        onSuccess: (data) => {
            // Invalidate orders queries to show updated order status
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAIL(data.order_id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
        },
        onError: (error) => {
            console.error('Failed to verify payment:', error);
        },
    });
};

// Create refund (admin only)
export const useCreateRefund = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentsApi.createRefund,
        onSuccess: (_, variables) => {
            // Invalidate payment queries to refetch updated payment
            queryClient.invalidateQueries({ queryKey: ['payments', 'detail', variables.payment_id] });
        },
        onError: (error) => {
            console.error('Failed to create refund:', error);
        },
    });
};