"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useCart as useCartQuery, useAddToCart, useRemoveFromCart, useCheckout, useUpdateCartItem } from '@/hooks/useCart';
import { Cart as ApiCart, CartItem as ApiCartItem } from '@/lib/api/cart';
import { toast } from "@/hooks/use-toast";

// Frontend Cart Item (for backward compatibility)
export interface CartItem {
  id: string;
  productId?: string;          // ADD
  variantId?: string | null;// Product ID (frontend or backend)
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, opts?: { variantId?: string; quantity?: number }) => void;
  updateQuantity: (id: string, newQuantity: number, size?: string, color?: string) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
  error: Error | null;
  checkoutSuccess: boolean;
  lastOrderId: string | null;
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
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // API hooks
  const { data: apiCart, isLoading, error } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem(); 
  const removeFromCartMutation = useRemoveFromCart();
  const checkoutMutation = useCheckout();

  // Convert API cart items to frontend format
  const cartItems: CartItem[] = apiCart?.items?.map((item: ApiCartItem) => ({
    id: item.id,
    productId: item.product,                // ADD
    variantId: (item as any)?.variant ?? null,
    name: item.product_name,
    price: Number(item.price_at_time),
    quantity: item.quantity,
    size: item.variant_name?.split(' - ')[0] || 'M',
    color: item.variant_name?.split(' - ')[1] || 'Default',
    image: '',
    category: 'general',
  })) || [];

  // Utility: UUID detector for backend products
  const isUuid = (val: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

  // Add to cart: single source of truth for API calls
  const addToCart = async (product: Omit<CartItem, 'quantity'>, opts?: { variantId?: string; quantity?: number }) => {
    try {
      if (isUuid(product.id)) {
        // Backend product: send required payload (product + variant + quantity)
        await addToCartMutation.mutateAsync({
          product: product.id,
          variant: opts?.variantId,
          quantity: opts?.quantity ?? 1,
        });
        toast({ title: "Added to cart", description: product.name });
      } else {
        // Static product: skip API (placeholder)
        console.warn('Skipping API addToCart for static product:', product.id);
        toast({ title: "Sample product", description: "This item is static and not persisted yet." });
      }

      setIsCartOpen(true);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      toast({ variant: "destructive", title: "Add to cart failed", description: "Please try again." });
    }
  };

  // UPDATED: Use PATCH endpoint (absolute quantity)
  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      await updateCartItemMutation.mutateAsync({ id: cartItemId, quantity: newQuantity });
    } catch (err) {
      console.error('Failed to update quantity:', err);
      toast({ variant: "destructive", title: "Update failed", description: "Please try again." });
    }
  };

  const removeItem = async (id: string, size?: string, color?: string) => {
    try {
      await removeFromCartMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  const clearCart = () => {
    cartItems.forEach(item => {
      removeFromCartMutation.mutate(item.id);
    });
  };

  const checkout = async () => {
    try {
      const response = await checkoutMutation.mutateAsync();
      if (response?.order_id) {
        setLastOrderId(response.order_id);
      }
      setCheckoutSuccess(true);
      setIsCartOpen(false);
      toast({ title: "Order placed successfully!", description: "Thank you for your purchase." });
    } catch (err) {
      console.error('Failed to checkout:', err);
      setCheckoutSuccess(false);
      setLastOrderId(null);
      toast({ variant: "destructive", title: "Checkout failed", description: "Please try again." });
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => {
    setIsCartOpen(false);
    setCheckoutSuccess(false);
    setLastOrderId(null);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const apiSubtotalRaw = apiCart?.total;
  const subtotal = apiSubtotalRaw != null
    ? Number(apiSubtotalRaw)
    : cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 4.99;
  const total = subtotal + shipping;

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    checkout,
    totalItems,
    subtotal,
    shipping,
    total,
    isCartOpen,
    openCart,
    closeCart,
    isLoading: isLoading || addToCartMutation.isPending || removeFromCartMutation.isPending || checkoutMutation.isPending,
    error: error || addToCartMutation.error || removeFromCartMutation.error || checkoutMutation.error,
    checkoutSuccess,
    lastOrderId,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};