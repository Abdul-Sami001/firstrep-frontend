// lib/api/orders/index.ts
import { api } from '../client';

// Backend-Matching Types (Updated to match your API response)
export interface OrderItem {
    id: number; // Changed from string to number
    product: string | null; // Product ID (can be null in some cases)
    variant?: string | null; // Variant ID
    quantity: number;
    price: string; // Changed to string to match API
    subtotal: string; // Changed to string to match API
    product_name?: string | null; // Product title
    variant_sku?: string | null; // Variant SKU
    product_image?: string | null; // Product image URL
    size?: string | null; // Product size from variant
    color?: string | null; // Product color from variant
}

export interface Order {
    id: string;
    user: string | null; // User ID (null for guest orders)
    guest_email?: string | null; // Guest email for guest orders
    guest_tracking_token?: string | null; // Tracking token for guest orders
    total: string; // Changed to string to match API
    vat: string; // Changed to string to match API
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: 'stripe' | 'paypal' | 'cod' | 'bank_transfer';
    payment_reference?: string;
    created_at: string;
    shipping_address?: string;
    billing_address?: string;
    tracking_number?: string | null; // Shipping carrier tracking number
    items: OrderItem[];
    // Reseller attribution fields (from backend)
    reseller_id?: string | null;
    storefront_id?: string | null;
    storefront_slug?: string | null;
    // Marketing discount fields (from backend)
    applied_gift_card_code?: string | null;
    applied_gift_card_amount?: string;
    applied_referral_code?: string | null;
    applied_referral_discount?: string;
    applied_loyalty_points?: number;
    applied_loyalty_discount?: string;
    total_discount?: string;
    // Cancellation and return request fields
    cancellation_requests?: OrderCancellationRequest[];
    return_requests?: OrderReturnRequest[];
}

// Cancellation Request Types
export interface OrderCancellationRequest {
    id: string;
    order: Order;
    reason: 'changed_mind' | 'found_cheaper' | 'wrong_item' | 'delayed_delivery' | 'other';
    reason_display: string;
    reason_details?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    status_display: string;
    requested_by_user?: string | null;
    guest_email?: string | null;
    admin_notes?: string;
    processed_by?: string | null;
    processed_at?: string | null;
    created_at: string;
    updated_at: string;
}

// Return Request Types
export interface ReturnItem {
    id: string;
    order_item: OrderItem;
    quantity: number;
    reason?: string;
}

export interface OrderReturnRequest {
    id: string;
    order: Order;
    reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'size_issue' | 'other';
    reason_display: string;
    reason_details?: string;
    status: 'pending' | 'approved' | 'rejected' | 'returned' | 'refunded' | 'cancelled';
    status_display: string;
    return_items: ReturnItem[];
    return_label_url?: string;
    return_tracking_number?: string;
    return_received_at?: string | null;
    refund_amount?: string | null;
    admin_notes?: string;
    requested_by_user?: string | null;
    guest_email?: string | null;
    processed_by?: string | null;
    processed_at?: string | null;
    created_at: string;
    updated_at: string;
}

// Request Payload Types
export interface CancellationRequestPayload {
    reason: 'changed_mind' | 'found_cheaper' | 'wrong_item' | 'delayed_delivery' | 'other';
    reason_details?: string;
    email?: string; // Required for guest requests
}

export interface ReturnRequestPayload {
    reason: 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'size_issue' | 'other';
    reason_details?: string;
    return_items: {
        order_item_id: string;
        quantity: number;
        reason?: string;
    }[];
    email?: string; // Required for guest requests
}

export interface OrderFilters {
    status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
}

// Production API Methods
export const ordersApi = {
    // Get user's orders
    getOrders: (filters?: OrderFilters) =>
        api.get<Order[]>('/orders/', {
            params: filters
        }),

    // Get single order details
    getOrder: (id: string) =>
        api.get<Order>(`/orders/${id}/`),

    // Track order by guest tracking token (public endpoint, no auth required)
    trackOrder: (trackingToken: string) =>
        api.get<Order>(`/orders/track/${trackingToken}/`),

    // Cancel order
    cancelOrder: (id: string) =>
        api.post(`/orders/${id}/cancel/`),

    // Request cancellation (authenticated)
    requestCancellation: (orderId: string, data: CancellationRequestPayload) =>
        api.post<OrderCancellationRequest>(`/orders/${orderId}/request-cancellation/`, data),

    // Request cancellation (guest)
    requestCancellationGuest: (trackingToken: string, data: CancellationRequestPayload) =>
        api.post<OrderCancellationRequest>(`/orders/track/${trackingToken}/request-cancellation/`, data),

    // Request return (authenticated)
    requestReturn: (orderId: string, data: ReturnRequestPayload) =>
        api.post<OrderReturnRequest>(`/orders/${orderId}/request-return/`, data),

    // Request return (guest)
    requestReturnGuest: (trackingToken: string, data: ReturnRequestPayload) =>
        api.post<OrderReturnRequest>(`/orders/track/${trackingToken}/request-return/`, data),
};