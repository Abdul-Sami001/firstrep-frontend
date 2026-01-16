// hooks/useMarketing.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    marketingApi, 
    RedeemLoyaltyPointsRequest,
    RedeemGiftCardRequest,
    CreateReferralRequest,
    CreateGiftCardRequest,
    ValidatePromotionRequest
} from '@/lib/api/marketing';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { useToast } from '@/hooks/use-toast';

// Performance-optimized query configuration
const QUERY_CONFIG = {
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,          // 10 minutes (React Query v5 uses gcTime)
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
};

// ============================================================================
// Loyalty Account Hooks
// ============================================================================

/**
 * Get current user's loyalty account
 */
export const useLoyaltyAccount = () => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.LOYALTY.ACCOUNT,
        queryFn: marketingApi.getLoyaltyAccount,
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Get loyalty transaction history
 */
export const useLoyaltyTransactions = (params?: { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.LOYALTY.TRANSACTIONS(params),
        queryFn: () => marketingApi.getLoyaltyTransactions(params),
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Redeem loyalty points for discount
 */
export const useRedeemLoyaltyPoints = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: RedeemLoyaltyPointsRequest) => marketingApi.redeemLoyaltyPoints(data),
        onSuccess: (response) => {
            // Invalidate loyalty account to refetch updated balance
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.LOYALTY.ACCOUNT });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.LOYALTY.TRANSACTIONS() });
            
            toast({
                title: "Points redeemed!",
                description: response.message || `You've redeemed ${response.discount_amount} in discount.`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Redemption failed",
                description: error.response?.data?.detail || error.response?.data?.message || "Failed to redeem points",
                variant: "destructive",
            });
        },
    });
};

// ============================================================================
// Referral Hooks
// ============================================================================

/**
 * Get current user's referral code
 */
export const useMyReferralCode = () => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.REFERRALS.MY_CODE,
        queryFn: marketingApi.getMyReferralCode,
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Create a new referral code (if user doesn't have one)
 */
export const useCreateReferral = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data?: CreateReferralRequest) => marketingApi.createReferral(data),
        onSuccess: () => {
            // Invalidate referral code query to refetch
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.REFERRALS.MY_CODE });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.REFERRALS.LIST() });
            
            toast({
                title: "Referral code created!",
                description: "Your referral code has been generated successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Failed to create referral",
                description: error.response?.data?.detail || error.response?.data?.message || "Failed to create referral code",
                variant: "destructive",
            });
        },
    });
};

/**
 * Get user's referrals list
 */
export const useReferrals = (params?: { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.REFERRALS.LIST(params),
        queryFn: () => marketingApi.getReferrals(params),
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

// ============================================================================
// Gift Card Hooks
// ============================================================================

/**
 * Get gift card by ID
 */
export const useGiftCard = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.DETAIL(id),
        queryFn: () => marketingApi.getGiftCard(id),
        enabled: enabled && !!id,
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401 || error?.response?.status === 404) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Get gift card by code (for checking balance)
 */
export const useGiftCardByCode = (code: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.BY_CODE(code),
        queryFn: () => marketingApi.getGiftCardByCode(code),
        enabled: enabled && !!code,
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Get user's gift cards list
 */
export const useGiftCards = (params?: { page?: number; page_size?: number }) => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.LIST(params),
        queryFn: () => marketingApi.getGiftCards(params),
        ...QUERY_CONFIG,
        retry: (failureCount, error: any) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Create/purchase a gift card
 */
export const useCreateGiftCard = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (data: CreateGiftCardRequest) => marketingApi.createGiftCard(data),
        onSuccess: (response) => {
            // Invalidate gift cards list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.LIST() });
            
            // If checkout URL is provided, redirect to payment
            if (response.checkout_url) {
                window.location.href = response.checkout_url;
            } else {
                toast({
                    title: "Gift card created!",
                    description: response.message || "Gift card has been created successfully.",
                });
            }
        },
        onError: (error: any) => {
            toast({
                title: "Failed to create gift card",
                description: error.response?.data?.detail || error.response?.data?.message || "Failed to create gift card",
                variant: "destructive",
            });
        },
    });
};

/**
 * Redeem gift card
 */
export const useRedeemGiftCard = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RedeemGiftCardRequest }) => 
            marketingApi.redeemGiftCard(id, data),
        onSuccess: (response, variables) => {
            // Invalidate gift card queries
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.DETAIL(variables.id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.LIST() });
            if (variables.data.code) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.GIFT_CARDS.BY_CODE(variables.data.code) });
            }
            
            toast({
                title: "Gift card redeemed!",
                description: response.message || `£${response.amount_applied} applied successfully.`,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Redemption failed",
                description: error.response?.data?.detail || error.response?.data?.message || "Failed to redeem gift card",
                variant: "destructive",
            });
        },
    });
};

// ============================================================================
// Checkout Integration Hooks
// ============================================================================

/**
 * Validate gift card code for checkout
 */
export const useValidateGiftCard = () => {
    return useMutation({
        mutationFn: (code: string) => marketingApi.validateGiftCard(code),
    });
};

/**
 * Apply gift card to cart
 */
export const useApplyGiftCardToCart = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ code, cartId }: { code: string; cartId: string }) => 
            marketingApi.applyGiftCardToCart(code, cartId),
        onSuccess: () => {
            // Invalidate cart to refetch with updated discounts
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            toast({
                title: "Gift card applied!",
                description: "Gift card has been applied to your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Failed to apply gift card",
                description: error.response?.data?.error || error.response?.data?.message || "Invalid gift card code",
                variant: "destructive",
            });
        },
    });
};

/**
 * Validate referral code for checkout
 */
export const useValidateReferralCode = () => {
    return useMutation({
        mutationFn: (code: string) => marketingApi.validateReferralCode(code),
    });
};

/**
 * Apply referral code to cart
 */
export const useApplyReferralToCart = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ code, cartId }: { code: string; cartId: string }) => 
            marketingApi.applyReferralToCart(code, cartId),
        onSuccess: () => {
            // Invalidate cart to refetch with updated discounts
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            toast({
                title: "Referral code applied!",
                description: "Referral discount has been applied to your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Failed to apply referral code",
                description: error.response?.data?.message || "Invalid or expired referral code",
                variant: "destructive",
            });
        },
    });
};

/**
 * Preview loyalty points redemption
 */
export const usePreviewLoyaltyRedemption = () => {
    return useMutation({
        mutationFn: ({ points, cartId }: { points: number; cartId: string }) => 
            marketingApi.previewLoyaltyRedemption(points, cartId),
    });
};

/**
 * Apply loyalty points to cart
 */
export const useApplyLoyaltyToCart = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ points, cartId }: { points: number; cartId: string }) => 
            marketingApi.applyLoyaltyToCart(points, cartId),
        onSuccess: () => {
            // Invalidate cart and loyalty account
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MARKETING.LOYALTY.ACCOUNT });
            toast({
                title: "Points applied!",
                description: "Loyalty points have been applied to your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Failed to apply points",
                description: error.response?.data?.error || "Failed to apply loyalty points",
                variant: "destructive",
            });
        },
    });
};

// ============================================================================
// Promotion Hooks
// ============================================================================

/**
 * Validate promotion code for checkout
 */
export const useValidatePromotion = () => {
    return useMutation({
        mutationFn: (data: ValidatePromotionRequest) => marketingApi.validatePromotion(data),
    });
};

/**
 * Apply promotion code to cart
 */
export const useApplyPromotionToCart = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ code, cartId }: { code: string; cartId: string }) => 
            marketingApi.applyPromotionToCart({ code, cart_id: cartId }),
        onSuccess: (response) => {
            // Invalidate cart to refetch with updated discounts
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            toast({
                title: "Promotion applied!",
                description: response.message || "Promotion code has been applied to your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Failed to apply promotion",
                description: error.response?.data?.error || error.response?.data?.message || "Invalid or expired promotion code",
                variant: "destructive",
            });
        },
    });
};

/**
 * Get active promotions (public)
 */
export const useActivePromotions = () => {
    return useQuery({
        queryKey: QUERY_KEYS.MARKETING.PROMOTIONS.ACTIVE,
        queryFn: marketingApi.getActivePromotions,
        ...QUERY_CONFIG,
        staleTime: 2 * 60 * 1000, // 2 minutes - promotions change frequently
        retry: (failureCount, error: any) => {
            // Don't retry on 404 (no promotions available)
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Remove promotion from cart
 */
export const useRemovePromotionFromCart = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: (cartId: string) => 
            marketingApi.removePromotionFromCart({ cart_id: cartId }),
        onSuccess: (response) => {
            // Invalidate cart to refetch with updated discounts
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
            toast({
                title: "Promotion removed",
                description: response.message || "Promotion has been removed from your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Failed to remove promotion",
                description: error.response?.data?.error || error.response?.data?.message || "Failed to remove promotion",
                variant: "destructive",
            });
        },
    });
};
