// lib/api/payments/index.ts - Production-Ready Payments API
import { api } from '../client';

// Backend-Matching Types
export interface Payment {
    id: string;
    order: string; // Order ID
    stripe_id?: string | null;
    amount: number;
    currency: string;
    status: 'created' | 'processing' | 'succeeded' | 'failed' | 'refunded';
    created_at: string;
    updated_at: string;
    metadata?: Record<string, any>;
}

export interface CreateCheckoutRequest {
    order_id: string;
}

export interface CreateCheckoutResponse {
    checkout_url: string;
    session_id: string;
}

export interface RefundRequest {
    payment_id: string;
    amount?: number; // Optional partial refund
}

export interface RefundResponse {
    detail: string;
    refund: any; // Stripe refund object
}

// Production API Methods
export const paymentsApi = {
    // Create Stripe checkout session
    createCheckoutSession: (data: CreateCheckoutRequest) =>
        api.post<CreateCheckoutResponse>('/payments/create-checkout-session/', data),

    // Get payment details
    getPayment: (id: string) =>
        api.get<Payment>(`/payments/payments/${id}/`),

    // Create refund (admin only)
    createRefund: (data: RefundRequest) =>
        api.post<RefundResponse>('/payments/refund/', data),
};