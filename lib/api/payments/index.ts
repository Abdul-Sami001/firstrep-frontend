// lib/api/payments/index.ts
import { api } from '../client';

// Types
export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
    client_secret: string;
    payment_method_types: string[];
}

export interface CreatePaymentIntentRequest {
    order_id: string;
    payment_method_id?: string;
}

// API Methods
export const paymentsApi = {
    // Create payment intent
    createPaymentIntent: (data: CreatePaymentIntentRequest) =>
        api.post<PaymentIntent>('/payments/create-intent/', data),

    // Confirm payment
    confirmPayment: (paymentIntentId: string, paymentMethodId?: string) =>
        api.post<{ status: string; message?: string }>(`/payments/${paymentIntentId}/confirm/`, {
            payment_method_id: paymentMethodId
        }),

    // Get payment methods
    getPaymentMethods: () =>
        api.get<any[]>('/payments/methods/'),

    // Add payment method
    addPaymentMethod: (data: any) =>
        api.post('/payments/methods/', data),

    // Remove payment method
    removePaymentMethod: (methodId: string) =>
        api.delete(`/payments/methods/${methodId}/`),
};