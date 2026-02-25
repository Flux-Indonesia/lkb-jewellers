"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, CreditCard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/success";
    }, 2000);
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl text-white mb-4 font-normal font-heading"
          >
            Checkout
          </h1>
          <p className="text-gray-400 font-display">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Info */}
              <div>
                <h2
                  className="text-xl text-white mb-6 font-normal flex items-center gap-3 font-heading"
                >
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Address *
                    </label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      City *
                    </label>
                    <Input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Postcode *
                    </label>
                    <Input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2
                  className="text-xl text-white mb-6 font-normal flex items-center gap-3 font-heading"
                >
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                  Payment Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Card Number *
                    </label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      Expiry Date *
                    </label>
                    <Input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                      placeholder="MM/YY"
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">
                      CVC *
                    </label>
                    <Input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleChange}
                      required
                      placeholder="123"
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      style={{ fontSize: "16px" }}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-auto w-full bg-white text-black font-bold tracking-widest py-4 text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <Lock className="w-4 h-4" />
                {loading ? "PROCESSING..." : "PLACE ORDER"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-none p-0 gap-0 sticky top-32">
              <CardHeader className="p-6 pb-0">
                <CardTitle
                  className="text-xl text-white font-normal leading-normal font-heading"
                >
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Your cart items</p>
                      <p className="text-gray-500 text-xs">
                        Items will appear here
                      </p>
                    </div>
                  </div>
                </div>
                <Separator className="bg-gray-800" />
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">£0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Insurance</span>
                    <span className="text-white">Included</span>
                  </div>
                  <Separator className="bg-gray-800" />
                  <div className="pt-3">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span
                        className="text-white text-lg font-normal"
                      >
                        £0.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-gray-500 text-xs">
                  <Lock className="w-3 h-3" />
                  <span>Secure SSL encrypted checkout</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
