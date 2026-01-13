// lib/api/marketing/index.ts
import { api } from '../client';

// ============================================================================
// Types - Matching Backend API Response
// ============================================================================

// Loyalty Account Types
export interface LoyaltyAccount {
    id: string;
    contact_email: string;
    program_name: string;
    points_balance: number;
    lifetime_points: number;
    created_at?: string;
    updated_at?: string;
}

// Loyalty Transaction Types
export interface LoyaltyTransaction {
    id: string;
    account: string; // LoyaltyAccount ID
    account_email?: string; // Account email (from API)
    transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
    points_amount: number; // API returns points_amount, not points
    description?: string;
    order?: string | null; // Order ID if related to order
    created_at: string;
}

export interface RedeemLoyaltyPointsRequest {
    points: number;
}

export interface RedeemLoyaltyPointsResponse {
    discount_amount: number;
    discount_code?: string;
    message: string;
}

// Referral Types
export interface Referral {
    id: string;
    referrer: string; // User ID
    referral_code: string;
    status: 'pending' | 'completed' | 'expired';
    created_at: string;
    completed_at?: string | null;
    referrer_reward?: string | null;
    referee_reward?: string | null;
}

export interface MyReferralCode {
    referral_code: string;
    status: 'pending' | 'completed' | 'expired';
    total_referrals: number;
    completed_referrals: number;
    created_at: string;
}

export interface CreateReferralRequest {
    // Optional: May be empty if system auto-generates code
    referral_code?: string;
}

export interface CreateReferralResponse {
    id: string;
    referral_code: string;
    status: 'pending';
    created_at: string;
}

// Gift Card Types
export interface GiftCard {
    id: string;
    code: string;
    balance: string; // Decimal as string
    initial_balance: string; // Decimal as string
    status: 'active' | 'redeemed' | 'expired';
    expires_at?: string | null;
    created_at: string;
    recipient_email?: string | null;
}

export interface GiftCardTransaction {
    id: string;
    gift_card: string; // GiftCard ID
    transaction_type: 'purchase' | 'redemption' | 'refund';
    amount: string; // Decimal as string
    order?: string | null; // Order ID if related to order
    created_at: string;
}

export interface RedeemGiftCardRequest {
    code: string;
    amount?: number; // Optional: partial redemption amount
    order_id?: string; // Optional: order ID if redeeming during checkout
}

export interface RedeemGiftCardResponse {
    gift_card: GiftCard;
    amount_applied: string;
    remaining_balance: string;
    message: string;
}

export interface CreateGiftCardRequest {
    amount: number; // Gift card amount in pounds
    recipient_email?: string; // Optional: email to send gift card to
    recipient_name?: string; // Optional: recipient's name
    message?: string; // Optional: personal message
    expires_at?: string; // Optional: expiration date (ISO format)
}

export interface CreateGiftCardResponse {
    gift_card: GiftCard;
    checkout_url?: string; // If payment required, redirect to this URL
    message: string;
}

// ============================================================================
// API Methods - Production Ready
// ============================================================================

export const marketingApi = {
    // ========================================================================
    // Loyalty Account Endpoints
    // ========================================================================
    
    /**
     * Get current user's loyalty account
     * GET /api/v1/marketing/loyalty/account/
     * Permission: IsAuthenticated
     */
    getLoyaltyAccount: (): Promise<LoyaltyAccount> =>
        api.get<LoyaltyAccount>('/marketing/loyalty/account/'),

    /**
     * Get loyalty transaction history
     * GET /api/v1/marketing/loyalty/transactions/
     * Permission: IsAuthenticated
     */
    getLoyaltyTransactions: (params?: { page?: number; page_size?: number }) =>
        api.get<{ results: LoyaltyTransaction[]; count: number; next: string | null; previous: string | null }>(
            '/marketing/loyalty/transactions/',
            { params }
        ),

    /**
     * Redeem loyalty points for discount
     * POST /api/v1/marketing/loyalty/redeem/
     * Permission: IsAuthenticated
     */
    redeemLoyaltyPoints: (data: RedeemLoyaltyPointsRequest): Promise<RedeemLoyaltyPointsResponse> =>
        api.post<RedeemLoyaltyPointsResponse>('/marketing/loyalty/redeem/', data),

    // ========================================================================
    // Referral Endpoints
    // ========================================================================
    
    /**
     * Get current user's referral code
     * GET /api/v1/marketing/referrals/my-code/
     * Permission: IsAuthenticated
     */
    getMyReferralCode: (): Promise<MyReferralCode> =>
        api.get<MyReferralCode>('/marketing/referrals/my-code/'),

    /**
     * Create a new referral code (if user doesn't have one)
     * POST /api/v1/marketing/referrals/
     * Permission: IsAuthenticated
     */
    createReferral: (data?: CreateReferralRequest): Promise<CreateReferralResponse> =>
        api.post<CreateReferralResponse>('/marketing/referrals/', data || {}),

    /**
     * List user's referrals
     * GET /api/v1/marketing/referrals/
     * Permission: IsAuthenticated
     */
    getReferrals: (params?: { page?: number; page_size?: number }) =>
        api.get<{ results: Referral[]; count: number; next: string | null; previous: string | null }>(
            '/marketing/referrals/',
            { params }
        ),

    // ========================================================================
    // Gift Card Endpoints
    // ========================================================================
    
    /**
     * Get gift card details by ID or code
     * GET /api/v1/marketing/gift-cards/{id}/
     * Permission: IsAuthenticated (or public with code)
     */
    getGiftCard: (id: string): Promise<GiftCard> =>
        api.get<GiftCard>(`/marketing/gift-cards/${id}/`),

    /**
     * Get gift card by code (for checking balance)
     * GET /api/v1/marketing/gift-cards/?code=GIFT-CODE
     * Permission: IsAuthenticated or public
     */
    getGiftCardByCode: (code: string): Promise<GiftCard> =>
        api.get<GiftCard>('/marketing/gift-cards/', { params: { code } }),

    /**
     * List user's gift cards
     * GET /api/v1/marketing/gift-cards/
     * Permission: IsAuthenticated
     */
    getGiftCards: (params?: { page?: number; page_size?: number }) =>
        api.get<{ results: GiftCard[]; count: number; next: string | null; previous: string | null }>(
            '/marketing/gift-cards/',
            { params }
        ),

    /**
     * Create/purchase a gift card
     * POST /api/v1/marketing/gift-cards/
     * Permission: IsAuthenticated
     */
    createGiftCard: (data: CreateGiftCardRequest): Promise<CreateGiftCardResponse> =>
        api.post<CreateGiftCardResponse>('/marketing/gift-cards/', data),

    /**
     * Redeem gift card
     * POST /api/v1/marketing/gift-cards/{id}/redeem/
     * Permission: IsAuthenticated
     */
    redeemGiftCard: (id: string, data: RedeemGiftCardRequest): Promise<RedeemGiftCardResponse> =>
        api.post<RedeemGiftCardResponse>(`/marketing/gift-cards/${id}/redeem/`, data),

    // ========================================================================
    // Checkout Integration Endpoints
    // ========================================================================
    
    /**
     * Validate gift card code for checkout
     * POST /api/v1/marketing/gift-cards/validate/
     * Permission: Public
     */
    validateGiftCard: (code: string): Promise<{ valid: boolean; balance: string; max_discount: string; message: string }> =>
        api.post('/marketing/gift-cards/validate/', { code }),

    /**
     * Apply gift card to cart
     * POST /api/v1/marketing/gift-cards/apply-to-cart/
     * Permission: Public
     */
    applyGiftCardToCart: (code: string, cartId: string): Promise<{
        success: boolean;
        applied_amount: string;
        remaining_balance: string;
        cart_totals: {
            subtotal: string;
            gift_card_discount: string;
            total_discount: string;
            discounted_subtotal: string;
            vat: string;
            total: string;
        };
    }> =>
        api.post('/marketing/gift-cards/apply-to-cart/', { code, cart_id: cartId }),

    /**
     * Validate referral code for checkout
     * POST /api/v1/marketing/referrals/validate/
     * Permission: Public
     */
    validateReferralCode: (code: string): Promise<{
        valid: boolean;
        discount_amount: string | null;
        discount_type: string | null;
        discount_value: string | null;
        message: string;
    }> =>
        api.post('/marketing/referrals/validate/', { code }),

    /**
     * Apply referral code to cart
     * POST /api/v1/marketing/referrals/apply-to-cart/
     * Permission: Public
     */
    applyReferralToCart: (code: string, cartId: string): Promise<{
        success: boolean;
        applied_discount: string;
        cart_totals: {
            subtotal: string;
            referral_discount: string;
            total_discount: string;
            discounted_subtotal: string;
            vat: string;
            total: string;
        };
    }> =>
        api.post('/marketing/referrals/apply-to-cart/', { code, cart_id: cartId }),

    /**
     * Preview loyalty points redemption
     * POST /api/v1/marketing/loyalty/preview-redemption/
     * Permission: IsAuthenticated
     */
    previewLoyaltyRedemption: (points: number, cartId: string): Promise<{
        discount_amount: string;
        remaining_balance: number;
        points_to_redeem: number;
        message: string;
    }> =>
        api.post('/marketing/loyalty/preview-redemption/', { points, cart_id: cartId }),

    /**
     * Apply loyalty points to cart
     * POST /api/v1/marketing/loyalty/apply-to-cart/
     * Permission: IsAuthenticated
     */
    applyLoyaltyToCart: (points: number, cartId: string): Promise<{
        success: boolean;
        points_applied: number;
        discount_amount: string;
        remaining_balance: number;
        cart_totals: {
            subtotal: string;
            loyalty_discount: string;
            total_discount: string;
            discounted_subtotal: string;
            vat: string;
            total: string;
        };
    }> =>
        api.post('/marketing/loyalty/apply-to-cart/', { points, cart_id: cartId }),
};

export default marketingApi;
