"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  customer_email: string;
  items: OrderItem[];
  created_at: string;
  address_line1: string;
  city: string;
  postal_code: string;
  country: string;
}

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400 border-green-500/30",
  shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  refunded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function OrdersPage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      router.push("/login?redirect=/orders");
      return;
    }

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, userLoading, router]);

  if (userLoading || loading) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="text-gray-400 text-xs tracking-widest uppercase">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-white mb-4 font-normal font-heading">
            My Orders
          </h1>
          <p className="text-gray-400 font-display">
            Track and manage your purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <p className="text-gray-400 text-lg mb-2">No orders yet</p>
            <p className="text-gray-600 text-sm mb-8">
              Your order history will appear here after your first purchase.
            </p>
            <Button asChild className="bg-white text-black hover:bg-gray-200 tracking-widest text-sm px-8 py-3 h-auto">
              <Link href="/shop">START SHOPPING</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-white text-sm font-medium">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border uppercase tracking-wider ${
                        STATUS_COLORS[order.status] || STATUS_COLORS.pending
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-white font-medium">
                      £{order.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2">
                  {(order.items || []).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Link href={`/product/${item.id}`} className="flex items-center gap-3 flex-1 hover:text-[#D4AF37] transition-colors">
                        <span className="text-gray-400">{item.quantity}x</span>
                        <span className="text-gray-300">{item.name}</span>
                        <ChevronRight className="w-3 h-3 text-gray-600 ml-auto" />
                      </Link>
                      <span className="text-gray-500">
                        £{(item.price * item.quantity).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping */}
                {order.address_line1 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-gray-500 text-xs">
                      Shipped to: {order.address_line1}, {order.city} {order.postal_code}, {order.country}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
