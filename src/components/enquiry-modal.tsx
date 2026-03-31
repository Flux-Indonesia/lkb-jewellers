"use client";

import { useState } from "react";
import { X, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";

export function EnquiryModal({ isOpen, onClose, product }: { isOpen: boolean; onClose: () => void; product: Product }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethod, setContactMethod] = useState<"call" | "email" | "whatsapp">("call");
  const [message, setMessage] = useState("");
  const [visitedOthers, setVisitedOthers] = useState(false);
  const [optOutNewsletter, setOptOutNewsletter] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          contactMethod,
          message,
          visitedOthers,
          optOutNewsletter,
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productCategory: product.category,
          productImage: product.images?.[0] || "",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast.success("Enquiry submitted successfully!");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-black border border-gray-800 text-white p-3 text-sm focus:border-white outline-none transition-colors placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#0a0a0a] border border-gray-800 rounded-none max-w-3xl w-full my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl text-white mb-2 font-serif">Exclusive Item Enquiry</h2>
            <p className="text-sm text-gray-400">
              Enquiring about: <span className="text-white">{product.name}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Price: £{product.price.toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-16 px-8">
            <BadgeCheck className="mx-auto mb-4 text-white" size={48} />
            <h3 className="text-2xl text-white mb-3 font-serif">Enquiry Sent!</h3>
            <p className="text-gray-400 text-sm mb-6">We&apos;ll get back to you shortly via your preferred contact method.</p>
            <button onClick={onClose} className="bg-white text-black px-8 py-3 font-bold tracking-widest text-sm hover:bg-gray-200 transition-colors">
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl text-white mb-4 flex items-center gap-2 font-serif">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                  <input type="text" placeholder="John Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                  <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                  <input type="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} required />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">Preferred Contact Method *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["call", "email", "whatsapp"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setContactMethod(method)}
                      className={`py-3 px-4 border text-sm font-medium transition-all ${
                        contactMethod === method
                          ? "bg-white text-black border-white"
                          : "bg-black text-white border-gray-800 hover:border-white"
                      }`}
                    >
                      {method === "whatsapp" ? "WhatsApp" : method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-xl text-white mb-4 flex items-center gap-2 font-serif">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>
                Message
              </h3>
              <textarea placeholder="Tell us any details you'd like us to know..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={`${inputClass} resize-none`} />
            </div>

            <div className="border-t border-gray-800 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={visitedOthers} onChange={(e) => setVisitedOthers(e.target.checked)} className="w-5 h-5 accent-white cursor-pointer" />
                <span className="text-white text-sm group-hover:text-gray-300 transition-colors">I have visited other dealers</span>
              </label>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={optOutNewsletter} onChange={(e) => setOptOutNewsletter(e.target.checked)} className="w-5 h-5 accent-white cursor-pointer" />
                <span className="text-white text-sm group-hover:text-gray-300 transition-colors">Opt out of newsletter (we&apos;ll keep you updated on exclusive offers by default)</span>
              </label>
            </div>

            <div className="border-t border-gray-800 pt-6 flex gap-4">
              <button type="submit" disabled={loading} className="flex-1 bg-white text-black font-bold py-4 px-8 hover:bg-gray-200 transition-colors tracking-widest text-sm disabled:opacity-50">
                {loading ? "SUBMITTING..." : "SUBMIT ENQUIRY"}
              </button>
              <button type="button" onClick={onClose} className="px-8 py-4 border border-gray-800 text-white hover:border-white transition-colors text-sm tracking-widest">
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
