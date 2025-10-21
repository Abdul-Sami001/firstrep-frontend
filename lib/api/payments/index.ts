// lib/api/payments/index.ts
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

export interface VerifyPaymentRequest {
    session_id: string;
}

export interface VerifyPaymentResponse {
    order_id: string;
    payment_status: string;
    order_status: string;
    message: string;
}

// Production API Methods
export const paymentsApi = {
    // Verify payment after Stripe checkout
    verifyPayment: (data: VerifyPaymentRequest) =>
        api.post<VerifyPaymentResponse>('/payments/verify-payment/', data),

    // Get payment details
    getPayment: (id: string) =>
        api.get<Payment>(`/payments/payments/${id}/`),

    // Create refund (admin only)
    createRefund: (data: { payment_id: string; amount?: number }) =>
        api.post('/payments/refund/', data),
};