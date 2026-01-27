// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, OrderFilters, CancellationRequestPayload, ReturnRequestPayload } from '@/lib/api/orders';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { useToast } from '@/hooks/use-toast';

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

// Track order by guest tracking token (public endpoint, no auth required)
export const useTrackOrder = (trackingToken: string | null) => {
    return useQuery({
        queryKey: ['orders', 'track', trackingToken],
        queryFn: () => ordersApi.trackOrder(trackingToken!),
        enabled: !!trackingToken,
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

// Request cancellation (authenticated)
export const useRequestCancellation = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: string; data: CancellationRequestPayload }) => {
            // Ensure orderId is a string and trim any whitespace
            const cleanOrderId = String(orderId).trim();
            console.log('Requesting cancellation for order:', cleanOrderId);
            return ordersApi.requestCancellation(cleanOrderId, data);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAIL(variables.orderId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
            toast({
                title: "Cancellation request submitted",
                description: "Your cancellation request has been submitted and is under review.",
            });
        },
        onError: (error: any) => {
            console.error('Cancellation request error:', error);
            const errorMessage = error?.response?.data?.detail || 
                               error?.response?.data?.message ||
                               error?.message ||
                               'Failed to submit cancellation request. Please try again or contact support.';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });
};

// Request cancellation (guest)
export const useRequestCancellationGuest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ trackingToken, data }: { trackingToken: string; data: CancellationRequestPayload }) =>
            ordersApi.requestCancellationGuest(trackingToken, data),
        onSuccess: (data) => {
            // Invalidate track queries
            queryClient.invalidateQueries({ queryKey: ['orders', 'track'] });
            toast({
                title: "Cancellation request submitted",
                description: "Your cancellation request has been submitted and is under review.",
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.detail || 'Failed to submit cancellation request';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });
};

// Request return (authenticated)
export const useRequestReturn = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ orderId, data }: { orderId: string; data: ReturnRequestPayload }) =>
            ordersApi.requestReturn(orderId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.DETAIL(variables.orderId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
            toast({
                title: "Return request submitted",
                description: "Your return request has been submitted and is under review.",
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.detail || 'Failed to submit return request';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });
};

// Request return (guest)
export const useRequestReturnGuest = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ trackingToken, data }: { trackingToken: string; data: ReturnRequestPayload }) =>
            ordersApi.requestReturnGuest(trackingToken, data),
        onSuccess: () => {
            // Invalidate track queries
            queryClient.invalidateQueries({ queryKey: ['orders', 'track'] });
            toast({
                title: "Return request submitted",
                description: "Your return request has been submitted and is under review.",
            });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.detail || 'Failed to submit return request';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        },
    });
};