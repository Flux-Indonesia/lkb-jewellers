"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
  const { items, cartTotal, updateQuantity, removeFromCart, syncPrices } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const syncedRef = useRef(false);

  // Sync cart prices with database on mount
  useEffect(() => {
    if (items.length === 0 || syncedRef.current) return;
    syncedRef.current = true;
    syncPrices();
  }, [items, syncPrices]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-white mb-4 font-normal font-heading">
            Checkout
          </h1>
          <p className="text-gray-400 font-display">Review your order</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
            <Button asChild className="bg-white text-black hover:bg-gray-200 tracking-widest text-sm px-8 py-3 h-auto">
              <Link href="/shop">BROWSE COLLECTION</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-gray-800 rounded-lg"
                >
                  <div className="relative w-24 h-24 bg-gray-900 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-medium truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#D4AF37] text-sm mt-1">
                      £{item.price.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                      >
                        <span className="text-sm font-bold leading-none">−</span>
                      </button>
                      <span className="text-white text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                      >
                        <span className="text-sm font-bold leading-none">+</span>
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium whitespace-nowrap">
                    £{(item.price * item.quantity).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-none p-0 gap-0 sticky top-32">
                <CardHeader className="p-6 pb-0">
                  <CardTitle className="text-xl text-white font-normal leading-normal font-heading">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                      </span>
                      <span className="text-white">
                        £{cartTotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">Free</span>
                    </div>
                    <Separator className="bg-gray-800" />
                    <div className="pt-3">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-white text-lg font-normal">
                          £{cartTotal.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mt-4">{error}</p>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="h-auto w-full bg-white text-black font-bold tracking-widest py-4 text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-6"
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? "REDIRECTING..." : "PAY WITH STRIPE"}
                  </Button>

                  <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
                    <Lock className="w-3 h-3" />
                    <span>Secure SSL encrypted checkout via Stripe</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
