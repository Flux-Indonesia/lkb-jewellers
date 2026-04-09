"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { WORLDWIDE_ALLOWED_COUNTRIES } from "@/lib/shipping";

interface CheckoutQuote {
  subtotal_gbp: number;
  shipping_required: boolean;
  shipping_country_required: boolean;
  shipping_country: string | null;
  delivery_type: "deliver" | "collect";
  shipping: {
    amount_gbp: number;
    label: string;
    uk_gbp: number;
    international_gbp: number;
  } | null;
  total_gbp: number;
}

export default function CheckoutPage() {
  const { items, updateQuantity, removeFromCart, syncPrices } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [shippingCountry, setShippingCountry] = useState("GB");
  const [deliveryType, setDeliveryType] = useState<"deliver" | "collect">("deliver");
  const syncedRef = useRef(false);
  const regionNamesRef = useRef<Intl.DisplayNames | null>(null);

  if (!regionNamesRef.current && typeof Intl !== "undefined" && "DisplayNames" in Intl) {
    regionNamesRef.current = new Intl.DisplayNames(["en"], { type: "region" });
  }

  const countryOptions = WORLDWIDE_ALLOWED_COUNTRIES
    .filter((code) => !["AC", "TA", "ZZ"].includes(code))
    .map((code) => ({
      code,
      label: regionNamesRef.current?.of(code) || code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Sync cart prices with database on mount
  useEffect(() => {
    if (items.length === 0 || syncedRef.current) return;
    syncedRef.current = true;
    syncPrices();
  }, [items, syncPrices]);

  useEffect(() => {
    let cancelled = false;

    async function fetchQuote() {
      if (items.length === 0) {
        setQuote(null);
        return;
      }

      setQuoteLoading(true);

      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            shipping_country: shippingCountry,
            delivery_type: deliveryType,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to calculate checkout total");
        }

        if (!cancelled) {
          setQuote(data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to calculate checkout total";
          setError(msg);
          setQuote(null);
        }
      } finally {
        if (!cancelled) {
          setQuoteLoading(false);
        }
      }
    }

    void fetchQuote();

    return () => {
      cancelled = true;
    };
  }, [items, shippingCountry, deliveryType]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shipping_country: shippingCountry, delivery_type: deliveryType }),
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
                      &pound;{item.price.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                      >
                        <span className="text-sm font-bold leading-none">-</span>
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
                    &pound;{(item.price * item.quantity).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Card className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-none p-0 gap-0 sticky top-32">
                <CardHeader className="p-6 pb-0">
                  <CardTitle className="text-xl text-white font-normal leading-normal font-heading">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-400 uppercase tracking-wider">
                        Fulfilment
                      </label>
                      <Select value={deliveryType} onValueChange={(value: "deliver" | "collect") => setDeliveryType(value)}>
                        <SelectTrigger className="w-full border-gray-800 bg-black text-white">
                          <SelectValue placeholder="Select fulfilment" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-800 bg-black text-white">
                          <SelectItem value="deliver" className="text-white focus:bg-gray-800 focus:text-white">
                            Deliver
                          </SelectItem>
                          <SelectItem value="collect" className="text-white focus:bg-gray-800 focus:text-white">
                            Collect
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                      </span>
                      <span className="text-white">
                        {quote ? (
                          <>&pound;{quote.subtotal_gbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</>
                        ) : quoteLoading ? "Calculating..." : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">
                        {quote?.shipping ? (
                          quote.delivery_type === "collect"
                            ? "Collect"
                            : <>&pound;{quote.shipping.amount_gbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</>
                        ) : quote?.shipping_required ? "Select country" : quoteLoading ? "Calculating..." : "Free"}
                      </span>
                    </div>
                    <Separator className="bg-gray-800" />
                    {quote?.delivery_type === "collect" && (
                      <p className="text-xs text-gray-500">
                        Collection selected. No delivery postage will be added.
                      </p>
                    )}
                    {quote?.shipping_country_required && (
                      <div className="space-y-2">
                        <label className="block text-xs text-gray-400 uppercase tracking-wider">
                          Shipping country
                        </label>
                        <Select value={shippingCountry} onValueChange={setShippingCountry}>
                          <SelectTrigger className="w-full border-gray-800 bg-black text-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="border-gray-800 bg-black text-white">
                            {countryOptions.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                                className="text-white focus:bg-gray-800 focus:text-white"
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500">
                          Hat postage is &pound;{quote?.shipping?.uk_gbp.toLocaleString("en-GB", { minimumFractionDigits: 2 }) ?? "7.00"} for UK or &pound;{quote?.shipping?.international_gbp.toLocaleString("en-GB", { minimumFractionDigits: 2 }) ?? "12.00"} for international addresses.
                        </p>
                      </div>
                    )}
                    <div className="pt-3">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-white text-lg font-normal">
                          {quote ? (
                            <>&pound;{quote.total_gbp.toLocaleString("en-GB", { minimumFractionDigits: 2 })}</>
                          ) : quoteLoading ? (
                            "Calculating..."
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm mt-4">{error}</p>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={loading || quoteLoading || !quote}
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
