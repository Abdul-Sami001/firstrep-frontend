// lib/api/orders/index.ts - Production-Ready Orders API
import { api } from '../client';

// Backend-Matching Types
export interface OrderItem {
    id: string;
    product: string; // Product ID
    variant?: string | null; // Variant ID
    quantity: number;
    price: number;
    subtotal: number;
}

export interface Order {
    id: string;
    user: string; // User ID
    total: number;
    vat: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    created_at: string;
    shipping_address?: string;
    billing_address?: string;
    items: OrderItem[];
}

export interface OrderFilters {
    status?: string;
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

    // Cancel order (if you add this endpoint later)
    cancelOrder: (id: string) =>
        api.post(`/orders/${id}/cancel/`),
};