// lib/api/orders/index.ts
import { api } from '../client';

// Types
export interface OrderItem {
    id: string;
    product: {
        id: string;
        name: string;
        slug: string;
        images: string[];
    };
    variant?: {
        size: string;
        color: string;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface ShippingAddress {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}

export interface Order {
    id: string;
    order_number: string;
    items: OrderItem[];
    shipping_address: ShippingAddress;
    billing_address?: ShippingAddress;
    subtotal: number;
    shipping_cost: number;
    tax_amount: number;
    discount_amount: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    tracking_number?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateOrderRequest {
    shipping_address: ShippingAddress;
    billing_address?: ShippingAddress;
    payment_method: string;
    notes?: string;
}

// API Methods
export const ordersApi = {
    // Get user's orders
    getOrders: (params?: { page?: number; page_size?: number; status?: string }) =>
        api.get<any>('/orders/', { params }),

    // Get single order
    getOrder: (orderId: string) =>
        api.get<Order>(`/orders/${orderId}/`),

    // Create new order
    createOrder: (data: CreateOrderRequest) =>
        api.post<Order>('/orders/', data),

    // Cancel order
    cancelOrder: (orderId: string, reason?: string) =>
        api.patch(`/orders/${orderId}/cancel/`, { reason }),

    // Track order
    trackOrder: (orderId: string) =>
        api.get<{ status: string; tracking_number?: string; estimated_delivery?: string }>(`/orders/${orderId}/track/`),
};