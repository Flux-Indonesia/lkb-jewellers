"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/data/products";
import { BLUR_DATA_URL } from '@/lib/utils'

export default function Footer() {
  const [logoVisible, setLogoVisible] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const year = new Date().getFullYear();

  useEffect(() => {
    const timer = setTimeout(() => setLogoVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterStatus("idle"), 4000);
    } catch {
      setNewsletterStatus("error");
      setTimeout(() => setNewsletterStatus("idle"), 4000);
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10 md:pb-10 border-t border-gray-900">
      <div className="container mx-auto px-6 pb-32 md:pb-0">
        {/* Main columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">

          {/* Column 1 - Logo */}
          <div className="lg:w-1/6 flex flex-col items-center lg:items-center">
            <Link href="/" className="group flex flex-col items-center">
              <Image
                src="/white-logo.png"
                alt={siteConfig.businessName}
                width={64}
                height={64}
                className={`h-16 w-auto mb-3 transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] cursor-pointer ${logoVisible ? "opacity-100" : "opacity-0"}`} placeholder="blur" blurDataURL={BLUR_DATA_URL}
              />
              <p className="text-white tracking-[0.15em] text-xs whitespace-nowrap mb-1 text-center font-heading">
                LOCAL KETTLE BROTHERS UK
              </p>
              <p className="text-white tracking-[0.3em] text-[8px] whitespace-nowrap text-center font-heading">
                JEWELLERS
              </p>
            </Link>
          </div>

          {/* Column 2 - Customer Service */}
          <div className="lg:w-1/5 text-center lg:text-left">
            <h3 className="text-lg mb-6 text-white font-heading">
              Customer Service
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/delivery-policy" className="hover:text-white transition-colors">
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-white transition-colors">
                  Returns Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Explore */}
          <div className="lg:w-1/5 text-center lg:text-left">
            <h3 className="text-lg mb-6 text-white font-heading">
              Explore
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/bespoke" className="hover:text-white transition-colors">
                  Bespoke Designs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Address */}
          <div className="lg:w-1/4 text-center lg:text-left">
            <h3 className="text-lg mb-6 text-white font-heading">
              Address
            </h3>
            <div
              className="text-sm text-gray-400 space-y-4 font-display"
            >
              <p className="flex items-start gap-3 justify-center lg:justify-start">
                <MapPin size={18} className="mt-0 shrink-0 text-white" />
                <span>New House, 67-68 Hatton Garden, London, EC1N 8JY</span>
              </p>
              <div className="mt-4">
                <h3
                  className="text-white text-lg mb-2 font-heading"
                >
                  Working Hours
                </h3>
                <p>Monday - Friday: 24hrs</p>
                <p>Saturday: 24hrs</p>
                <p>Sunday: 24hrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-12 text-center">
          <h3 className="text-lg text-white mb-3 font-heading">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for exclusive drops and offers.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <button
              type="submit"
              disabled={newsletterStatus === "loading"}
              className="bg-white text-black px-6 py-3 text-sm font-bold tracking-widest hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {newsletterStatus === "loading" ? "..." : newsletterStatus === "success" ? "SUBSCRIBED!" : "JOIN"}
            </button>
          </form>
          {newsletterStatus === "error" && (
            <p className="text-red-400 text-xs mt-2">Failed to subscribe. Please try again.</p>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-900 pt-8 space-y-4">
          {/* Row 1 - Copyright | Developed by | Policy links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {year} Local Kettle Brothers UK. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Developed by{" "}
              <a
                href="https://fluxconsultancy.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                www.fluxconsultancy.co.uk
              </a>
            </p>
            <div className="flex items-center gap-6">
              <Link href="/returns-policy" className="text-xs font-semibold text-gray-500 hover:text-white transition-colors">
                RETURNS
              </Link>
              <Link href="/privacy-policy" className="text-xs font-semibold text-gray-500 hover:text-white transition-colors">
                PRIVACY
              </Link>
              <Link href="/delivery-policy" className="text-xs font-semibold text-gray-500 hover:text-white transition-colors">
                DELIVERY
              </Link>
            </div>
          </div>

          {/* Row 2 - Payment Badges centered */}
          <div className="flex justify-center gap-5 items-center pt-2">
            {/* VISA */}
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded">
              <span className="text-blue-600 font-bold text-sm italic tracking-tight">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded">
              <div className="flex">
                <div className="w-5 h-5 bg-red-500 rounded-full" />
                <div className="w-5 h-5 bg-yellow-400 rounded-full -ml-2.5" />
              </div>
              <span className="text-gray-800 font-bold text-xs">Mastercard</span>
            </div>
            {/* PayPal */}
            <div className="flex items-center gap-1.5 bg-blue-600 px-4 py-2 rounded">
              <span className="text-white font-bold text-sm">PayPal</span>
            </div>
            {/* Crypto */}
            <div className="flex items-center gap-1.5 bg-orange-500 px-4 py-2 rounded">
              <svg viewBox="0 0 24 24" width={16} height={16} fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.088 14.19l-2.948-.924c-.64-.203-.654-.64.136-.948l11.547-4.453c.533-.194 1.001.131.739.383z" />
              </svg>
              <span className="text-white font-medium text-xs">Crypto</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
