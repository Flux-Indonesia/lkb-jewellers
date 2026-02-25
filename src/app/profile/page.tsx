"use client";

import Link from "next/link";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h1
            className="text-4xl md:text-5xl text-white mb-4 font-normal font-heading"
          >
            My Account
          </h1>
          <p className="text-gray-400">
            Manage your profile, orders, and preferences
          </p>
        </div>

        {/* Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link
            href="/profile"
            className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group block"
          >
            <User className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
            <h3
              className="text-lg text-white mb-2 font-normal font-heading"
            >
              Personal Details
            </h3>
            <p className="text-gray-500 text-sm">
              Update your name, email, and contact information
            </p>
          </Link>

          <Link
            href="/profile"
            className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group block"
          >
            <Package className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
            <h3
              className="text-lg text-white mb-2 font-normal font-heading"
            >
              Order History
            </h3>
            <p className="text-gray-500 text-sm">
              View your past orders and track current deliveries
            </p>
          </Link>

          <Link
            href="/profile"
            className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group block"
          >
            <Heart className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
            <h3
              className="text-lg text-white mb-2 font-normal font-heading"
            >
              Wishlist
            </h3>
            <p className="text-gray-500 text-sm">
              Browse and manage your saved favourite pieces
            </p>
          </Link>

          <Link
            href="/profile"
            className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group block"
          >
            <Settings className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" />
            <h3
              className="text-lg text-white mb-2 font-normal font-heading"
            >
              Account Settings
            </h3>
            <p className="text-gray-500 text-sm">
              Manage your password and notification preferences
            </p>
          </Link>

          <button className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-red-500/30 transition-all duration-500 group text-left">
            <LogOut className="w-8 h-8 text-gray-500 mb-4 group-hover:text-red-400 group-hover:scale-110 transition-all" />
            <h3
              className="text-lg text-white mb-2 font-normal group-hover:text-red-400 transition-colors font-heading"
            >
              Sign Out
            </h3>
            <p className="text-gray-500 text-sm">
              Log out of your LKB Jewellers account
            </p>
          </button>
        </div>

        {/* Placeholder Notice */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Account features are coming soon. Please{" "}
            <Link href="/contact" className="text-[#D4AF37] hover:underline">
              contact us
            </Link>{" "}
            for any account-related enquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
