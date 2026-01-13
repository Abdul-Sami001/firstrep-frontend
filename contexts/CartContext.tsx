// contexts/CartContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, CartItem } from '@/lib/api/cart';
import { QUERY_KEYS } from '@/lib/utils/constants';
import { logError } from '@/lib/utils/errors';

interface CartContextType {
  cartItems: CartItem[];
  cartId: string | null;
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number, size?: string, color?: string) => void;
  removeItem: (itemId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  // Discount fields
  appliedGiftCardCode?: string | null;
  appliedGiftCardAmount?: number;
  appliedReferralCode?: string | null;
  appliedReferralDiscount?: number;
  appliedLoyaltyPoints?: number;
  appliedLoyaltyDiscount?: number;
  totalDiscount?: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
  error: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get cart data - Cart is public (session-based for guests)
  const { data: apiCart, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.CART.ALL,
    queryFn: async () => {
      try {
        return await cartApi.getCart();
      } catch (err) {
        // Cart is public - 401 here is a real error, log it
        logError(err, 'CartContext');
        // Return empty cart structure to prevent UI crashes
        return { id: '', items: [], total: 0, user: null, session_key: null };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Cart is public - retry on network errors, not on 4xx
      if (error && typeof error === 'object' && 'response' in error) {
        const status = (error as any).response?.status;
        if (status >= 400 && status < 500 && ![408, 429].includes(status)) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
    },
    onError: (error) => {
      logError(error, 'AddToCart');
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
    },
    onError: (error) => {
      logError(error, 'RemoveFromCart');
    },
  });

  // ✅ OPTIMISTIC UPDATE: Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { quantity: number } }) =>
      cartApi.updateCartItem(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CART.ALL });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(QUERY_KEYS.CART.ALL);

      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.CART.ALL, (old: any) => {
        if (!old) return old;

        const updatedItems = old.items.map((item: any) => {
          if (item.id === id) {
            const newSubtotal = Number(item.price_at_time) * data.quantity;
            return {
              ...item,
              quantity: data.quantity,
              subtotal: newSubtotal
            };
          }
          return item;
        });

        // Recalculate cart total
        const newCartTotal = updatedItems.reduce((total: number, item: any) => total + Number(item.subtotal), 0);

        return {
          ...old,
          items: updatedItems,
          total: newCartTotal
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(QUERY_KEYS.CART.ALL, context.previousCart);
      }
    },
    onSettled: () => {
      // ✅ Don't invalidate queries - optimistic updates handle it
    },
  });

  const addToCart = (productId: string, variantId?: string, quantity: number = 1) => {
    addToCartMutation.mutate({
      product: productId,
      variant: variantId,
      quantity,
    });
  };

  // ✅ OPTIMISTIC UPDATE: Direct quantity update
  const updateQuantity = (itemId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeItem(itemId, size, color);
      return;
    }
    updateCartItemMutation.mutate({ id: itemId, data: { quantity } });
  };

  const removeItem = (itemId: string, size?: string, color?: string) => {
    removeFromCartMutation.mutate(itemId);
  };

  const clearCart = () => {
    apiCart?.items.forEach(item => {
      removeFromCartMutation.mutate(item.id);
    });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Transform API data to match cart component expectations
  // Now using new API fields: product_image, size, color directly from backend
  const cartItems = (apiCart?.items || []).map(item => ({
    ...item,
    name: item.product_name,
    price: item.price_at_time,
    // Use new API fields if available, fallback to old logic for backward compatibility
    image: item.product_image || undefined, // Map product_image to image for Cart component
    size: item.size || item.variant_name || undefined,
    color: item.color || undefined,
  }));

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const apiSubtotalRaw = apiCart?.total;
  const subtotal = apiSubtotalRaw != null
    ? Number(apiSubtotalRaw)
    : cartItems.reduce((total, item) => total + (Number(item.price_at_time) * item.quantity), 0);
  
  // Get discount amounts from cart (backend calculates these)
  const totalDiscount = apiCart?.total_discount ? Number(apiCart.total_discount) : 0;
  const appliedGiftCardAmount = apiCart?.applied_gift_card_amount ? Number(apiCart.applied_gift_card_amount) : 0;
  const appliedReferralDiscount = apiCart?.applied_referral_discount ? Number(apiCart.applied_referral_discount) : 0;
  const appliedLoyaltyDiscount = apiCart?.applied_loyalty_discount ? Number(apiCart.applied_loyalty_discount) : 0;
  
  // Calculate discounted subtotal (backend should provide this, but calculate as fallback)
  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
  // Free shipping threshold is based on original subtotal, not discounted (per business rules)
  const shipping = subtotal > 75 ? 0 : 4.99;
  // VAT is calculated on discounted subtotal (20% UK rate)
  const vat = discountedSubtotal * 0.20;
  const total = discountedSubtotal + vat + shipping;

  const value: CartContextType = {
    cartItems,
    cartId: apiCart?.id || null,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    total,
    appliedGiftCardCode: apiCart?.applied_gift_card_code || null,
    appliedGiftCardAmount,
    appliedReferralCode: apiCart?.applied_referral_code || null,
    appliedReferralDiscount,
    appliedLoyaltyPoints: apiCart?.applied_loyalty_points || undefined,
    appliedLoyaltyDiscount,
    totalDiscount,
    isCartOpen,
    openCart,
    closeCart,
    isLoading: isLoading || addToCartMutation.isPending || removeFromCartMutation.isPending, // ✅ Removed updateCartItemMutation.isPending
    error: error || addToCartMutation.error || removeFromCartMutation.error || updateCartItemMutation.error,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};