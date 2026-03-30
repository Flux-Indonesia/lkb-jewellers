"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; image: string }, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CART_KEY = "lkb-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addToCart = useCallback(
    (product: { id: string; name: string; price: number; image: string }, qty: number = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: qty,
          },
        ];
      });
      setIsCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_KEY);
    }
  }, []);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
