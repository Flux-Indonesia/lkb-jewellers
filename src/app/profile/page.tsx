"use client";

import Link from "next/link";
import { User, Package, Heart, LogOut, Mail, Phone } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function ProfilePage() {
  const { user, userSignOut } = useAuth();

  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Guest";
  const email = user?.email || "";
  const phone = user?.user_metadata?.phone || user?.phone || "";

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header with Details */}
        <div className="mb-10">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl text-white mb-2 font-heading">{fullName}</h1>
              <div className="flex flex-col gap-1.5 text-gray-400 text-sm">
                {email && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail size={14} className="text-gray-500" />
                    <span>{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Phone size={14} className="text-gray-500" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/orders"
            className="bg-gray-900/50 p-6 md:p-8 border border-gray-800 hover:border-white/30 transition-all duration-300 group flex items-center gap-5"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-heading text-lg mb-0.5">Order History</h3>
              <p className="text-gray-500 text-sm">View past orders & track deliveries</p>
            </div>
          </Link>

          <Link
            href="/profile"
            className="bg-gray-900/50 p-6 md:p-8 border border-gray-800 hover:border-white/30 transition-all duration-300 group flex items-center gap-5"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-heading text-lg mb-0.5">Wishlist</h3>
              <p className="text-gray-500 text-sm">Your saved favourite pieces</p>
            </div>
          </Link>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => userSignOut()}
          className="w-full bg-gray-900/50 p-6 border border-gray-800 hover:border-red-500/30 transition-all duration-300 group flex items-center gap-5"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="text-left">
            <h3 className="text-white font-heading text-lg mb-0.5 group-hover:text-red-400 transition-colors">Sign Out</h3>
            <p className="text-gray-500 text-sm">Log out of your account</p>
          </div>
        </button>

        {/* Notice */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">
            Need help?{" "}
            <Link href="/contact" className="text-white hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
