"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function SuccessPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6 flex items-center justify-center">
      <div className="max-w-lg w-full text-center">
        {/* Checkmark */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-[#D4AF37]" />
          </div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-[#D4AF37]/5 animate-ping" />
        </div>

        <h1
          className="text-4xl md:text-5xl text-white mb-4 font-normal font-heading"
        >
          Order Confirmed
        </h1>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been received and is being
          processed with the utmost care.
        </p>

        {/* Order Details */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-8 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <p className="text-white text-sm font-semibold">
                  Order Processing
                </p>
                <p className="text-gray-500 text-xs">
                  Your order is being carefully prepared
                </p>
              </div>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <p className="text-white text-sm font-semibold">
                  Confirmation Email
                </p>
                <p className="text-gray-500 text-xs">
                  A confirmation email has been sent to your inbox
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="h-auto rounded-none bg-white text-black px-8 py-4 font-bold tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95">
            <Link
              href="/shop"
            >
              CONTINUE SHOPPING
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto rounded-none bg-transparent border border-gray-700 text-white px-8 py-4 font-bold tracking-widest text-sm hover:border-white hover:bg-transparent transition-all duration-300 active:scale-95">
            <Link
              href="/"
            >
              BACK TO HOME
            </Link>
          </Button>
        </div>

        {/* Decorative */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
          <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
        </div>
      </div>
    </div>
  );
}
