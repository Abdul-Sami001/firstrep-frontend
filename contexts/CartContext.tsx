"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  // ✅ Add cart visibility state
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // ✅ Add cart visibility state

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    console.log('CartContext: addToCart called with product:', product);
    setCartItems(items => {
      console.log('CartContext: Current cart items before adding:', items);
      const existingItem = items.find(item =>
        item.id === product.id &&
        item.size === product.size &&
        item.color === product.color
      );

      if (existingItem) {
        console.log('CartContext: Found existing item, updating quantity');
        const updatedItems = items.map(item =>
          item.id === existingItem.id &&
            item.size === existingItem.size &&
            item.color === existingItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        console.log('CartContext: Updated cart items:', updatedItems);
        return updatedItems;
      }

      const newItems = [...items, { ...product, quantity: 1 }];
      console.log('CartContext: New cart items after adding:', newItems);
      return newItems;
    });

    // ✅ Auto-open cart when item is added
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, newQuantity: number, size?: string, color?: string) => {
    if (newQuantity <= 0) {
      setCartItems(items => items.filter(item =>
        item.id !== id || (size && item.size !== size) || (color && item.color !== color)
      ));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id && (!size || item.size === size) && (!color || item.color === color)
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeItem = (id: string, size?: string, color?: string) => {
    setCartItems(items => items.filter(item =>
      !(item.id === id &&
        (!size || item.size === size) &&
        (!color || item.color === color))
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ✅ Add cart visibility functions
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 75 ? 0 : 4.99;
  const total = subtotal + shipping;

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
    shipping,
    total,
    isCartOpen, // ✅ Include cart visibility
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};