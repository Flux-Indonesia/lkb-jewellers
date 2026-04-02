"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

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
  syncPrices: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CART_KEY = "lkb-cart";

function loadLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function mergeCartItems(primary: CartItem[], secondary: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of [...primary, ...secondary]) {
    const existing = merged.get(item.id);

    if (existing) {
      merged.set(item.id, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
      continue;
    }

    merged.set(item.id, { ...item });
  }

  return Array.from(merged.values());
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, userLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const skipNextSyncRef = useRef(false);

  useEffect(() => {
    if (userLoading) return;

    let cancelled = false;

    async function hydrateCart() {
      if (!user) {
        skipNextSyncRef.current = true;
        setItems(loadLocalCart());
        setReady(true);
        return;
      }

      try {
        const guestItems = loadLocalCart();
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load cart");
        }

        const serverItems = Array.isArray(data.items) ? data.items : [];
        const mergedItems = mergeCartItems(serverItems, guestItems);

        if (!cancelled) {
          skipNextSyncRef.current = true;
          setItems(mergedItems);
          setReady(true);
        }

        if (guestItems.length > 0 || mergedItems.length !== serverItems.length) {
          await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: mergedItems }),
          });
        }

        if (typeof window !== "undefined") {
          localStorage.removeItem(CART_KEY);
        }
      } catch {
        if (!cancelled) {
          skipNextSyncRef.current = true;
          setItems([]);
          setReady(true);
        }
      }
    }

    void hydrateCart();

    return () => {
      cancelled = true;
    };
  }, [user, userLoading]);

  useEffect(() => {
    if (!ready || userLoading) return;

    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }

    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }
      return;
    }

    void fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
  }, [items, ready, user, userLoading]);

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
      toast.success(`${product.name} added to cart`);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (item) toast.success(`${item.name} removed from cart`);
      return prev.filter((i) => i.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => {
        const item = prev.find((i) => i.id === productId);
        if (item) toast.success(`${item.name} removed from cart`);
        return prev.filter((i) => i.id !== productId);
      });
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
    toast.success("Cart cleared");

    if (typeof window !== "undefined" && !user) {
      localStorage.removeItem(CART_KEY);
    }
  }, [user]);

  const syncPrices = useCallback(() => {
    if (items.length === 0) return;
    const supabase = createClient();
    const ids = items.map((i) => i.id);
    supabase.from("products").select("id, price").in("id", ids).then(({ data }) => {
      if (!data) return;
      const priceMap = new Map(data.map((p: { id: string; price: number }) => [p.id, Number(p.price)]));
      setItems((prev) => {
        let changed = false;
        const updated = prev.map((item) => {
          const dbPrice = priceMap.get(item.id);
          if (dbPrice !== undefined && dbPrice !== item.price) {
            changed = true;
            return { ...item, price: dbPrice };
          }
          return item;
        });
        return changed ? updated : prev;
      });
    });
  }, [items]);

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
        syncPrices,
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
