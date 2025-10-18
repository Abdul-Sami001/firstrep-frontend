// hooks/usePayments.ts - Production-Ready Payments Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, CreateCheckoutRequest, RefundRequest } from '@/lib/api/payments';
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

// Create checkout session
export const useCreateCheckout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: paymentsApi.createCheckoutSession,
        onSuccess: (data) => {
            // Redirect to Stripe checkout
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            }
        },
        onError: (error) => {
            console.error('Failed to create checkout session:', error);
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