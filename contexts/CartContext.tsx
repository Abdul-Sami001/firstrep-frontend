"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useCart as useCartQuery, useAddToCart, useRemoveFromCart, useCheckout } from '@/hooks/useCart';
import { Cart as ApiCart, CartItem as ApiCartItem } from '@/lib/api/cart';
import { toast } from "@/hooks/use-toast";

// Frontend Cart Item (for backward compatibility)
export interface CartItem {
  id: string;
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
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, newQuantity: number, size?: string, color?: string) => void;
  removeItem: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  // ✅ Add cart visibility state
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // ✅ API state
  isLoading: boolean;
  error: Error | null;
  // ✅ Add checkout state
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

  // ✅ API hooks
  const { data: apiCart, isLoading, error } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const checkoutMutation = useCheckout();

  // ✅ Convert API cart items to frontend format
  const cartItems: CartItem[] = apiCart?.items?.map((item: ApiCartItem) => ({
    id: item.id,
    name: item.product_name,
    price: item.price_at_time,
    quantity: item.quantity,
    size: item.variant_name?.split(' - ')[0] || 'M', // Extract size from variant name
    color: item.variant_name?.split(' - ')[1] || 'Default', // Extract color from variant name
    image: '', // Will be populated from product data
    category: 'general', // Will be populated from product data
  })) || [];

  const addToCart = async (product: Omit<CartItem, 'quantity'>) => {
    try {
      await addToCartMutation.mutateAsync({
        product: product.id,
        quantity: 1,
        // Note: variant will be determined by backend based on size/color
      });

      // ✅ Auto-open cart when item is added
      setIsCartOpen(true);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity <= 0) {
      await removeItem(id, size, color);
    } else {
      // For now, we'll remove and re-add with new quantity
      // In a more sophisticated implementation, you'd have an update endpoint
      try {
        await removeFromCartMutation.mutateAsync(id);
        // Re-add with new quantity
        await addToCartMutation.mutateAsync({
          product: id,
          quantity: newQuantity,
        });
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const removeItem = async (id: string, size?: string, color?: string) => {
    try {
      await removeFromCartMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const clearCart = () => {
    // Clear all items by removing them one by one
    cartItems.forEach(item => {
      removeFromCartMutation.mutate(item.id);
    });
  };

  // ✅ Enhanced checkout function with order creation response handling
  const checkout = async () => {
    try {
      const response = await checkoutMutation.mutateAsync();
      console.log('Order created successfully:', response);

      // ✅ Store order ID for potential redirect
      if (response?.order_id) {
        setLastOrderId(response.order_id);
        console.log('Order ID:', response.order_id);
      }

      // ✅ Set success state
      setCheckoutSuccess(true);

      // ✅ Close cart after successful checkout
      setIsCartOpen(false);

      // ✅ Optional: Auto-redirect to order details after a delay
      // setTimeout(() => {
      //   if (response?.order_id) {
      //     router.push(`/orders/${response.order_id}`);
      //   }
      // }, 2000);
      // ✅ Success Toast
      toast({
        title: "Order placed successfully!",
        description: "Your order has been created successfully.",
      })
    } catch (error) {
      console.error('Failed to checkout:', error);
      setCheckoutSuccess(false);
      setLastOrderId(null);
      // ❌ Error Toast
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "Something went wrong while placing your order. Please try again.",
      })
    }
  };

  // ✅ Add cart visibility functions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => {
    setIsCartOpen(false);
    // ✅ Reset success state when closing cart
    setCheckoutSuccess(false);
    setLastOrderId(null);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = apiCart?.total || cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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
    isCartOpen, // ✅ Include cart visibility
    openCart,
    closeCart,
    isLoading: isLoading || addToCartMutation.isPending || removeFromCartMutation.isPending || checkoutMutation.isPending,
    error: error || addToCartMutation.error || removeFromCartMutation.error || checkoutMutation.error,
    checkoutSuccess, // ✅ Include checkout success state
    lastOrderId, // ✅ Include last order ID
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};