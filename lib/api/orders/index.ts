// lib/api/orders/index.ts
import { api } from '../client';

// Backend-Matching Types (Updated to match your API response)
export interface OrderItem {
    id: number; // Changed from string to number
    product: string; // Product ID
    variant?: string | null; // Variant ID
    quantity: number;
    price: string; // Changed to string to match API
    subtotal: string; // Changed to string to match API
}

export interface Order {
    id: string;
    user: string; // User ID
    total: string; // Changed to string to match API
    vat: string; // Changed to string to match API
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: 'stripe' | 'paypal' | 'cod' | 'bank_transfer';
    payment_reference?: string;
    created_at: string;
    shipping_address?: string;
    billing_address?: string;
    items: OrderItem[];
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

    // Cancel order
    cancelOrder: (id: string) =>
        api.post(`/orders/${id}/cancel/`),
};