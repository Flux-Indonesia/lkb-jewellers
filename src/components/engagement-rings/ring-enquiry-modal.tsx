"use client";

import { useState } from "react";
import { X, BadgeCheck, Gem } from "lucide-react";
import { toast } from "sonner";
import type { Ring } from "@/data/engagement-rings";

export interface RingEnquiryDetails {
  selectedMetal: string;
  sideStones: string;
  setting: string;
  ringSize: string;
  shape: string;
  settingStyle: string;
  bandType: string;
  gemstoneFilters: {
    stoneType?: string;
    clarity?: string;
    caratRange?: string;
    colour?: string;
  };
  certificate: string;
}

export function RingEnquiryModal({
  isOpen,
  onClose,
  ring,
  ringDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  ring: Ring;
  ringDetails?: RingEnquiryDetails;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactMethods, setContactMethods] = useState<Array<"call" | "email" | "whatsapp">>(["call"]);
  const [message, setMessage] = useState("");
  const [visitedOthers, setVisitedOthers] = useState(false);
  const [otherDealerName, setOtherDealerName] = useState("");
  const [otherDealerPrice, setOtherDealerPrice] = useState("");
  const [optOutNewsletter, setOptOutNewsletter] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry/ring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          contactMethod: contactMethods,
          message,
          visitedOthers,
          otherDealerName: visitedOthers ? otherDealerName : "",
          otherDealerPrice: visitedOthers ? otherDealerPrice : "",
          optOutNewsletter,
          ringId: ring.id,
          ringName: ring.name,
          ringPrice: ring.basePrice,
          ringImage: ring.thumbnails?.[0] || ring.images?.[0] || "",
          // Ring configuration details
          ringMetal: ringDetails?.selectedMetal || "",
          ringSideStones: ringDetails?.sideStones || "",
          ringSetting: ringDetails?.setting || "",
          ringSize: ringDetails?.ringSize || "",
          ringShape: ringDetails?.shape || "",
          ringSettingStyle: ringDetails?.settingStyle || "",
          ringBandType: ringDetails?.bandType || "",
          ringStoneType: ringDetails?.gemstoneFilters?.stoneType || "",
          ringClarity: ringDetails?.gemstoneFilters?.clarity || "",
          ringCaratRange: ringDetails?.gemstoneFilters?.caratRange || "",
          ringColour: ringDetails?.gemstoneFilters?.colour || "",
          ringCertificate: ringDetails?.certificate || "",
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

  const inputClass =
    "w-full bg-black border border-gray-800 text-white p-3 text-sm focus:border-white outline-none transition-colors placeholder:text-gray-400";

  const detailItems = ringDetails
    ? [
        ringDetails.shape && { label: "Shape", value: ringDetails.shape.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) },
        ringDetails.selectedMetal && { label: "Metal", value: ringDetails.selectedMetal },
        ringDetails.sideStones && { label: "Side & Melee Stones", value: ringDetails.sideStones },
        ringDetails.setting && { label: "Setting", value: ringDetails.setting },
        ringDetails.settingStyle && { label: "Setting Style", value: ringDetails.settingStyle.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) },
        ringDetails.bandType && { label: "Band Type", value: ringDetails.bandType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) },
        ringDetails.ringSize && { label: "Ring Size", value: ringDetails.ringSize },
        ringDetails.gemstoneFilters?.stoneType && { label: "Stone Type", value: ringDetails.gemstoneFilters.stoneType },
        ringDetails.gemstoneFilters?.clarity && { label: "Clarity", value: ringDetails.gemstoneFilters.clarity },
        ringDetails.gemstoneFilters?.caratRange && { label: "Carat", value: ringDetails.gemstoneFilters.caratRange },
        ringDetails.gemstoneFilters?.colour && { label: "Colour", value: ringDetails.gemstoneFilters.colour },
        ringDetails.certificate && { label: "Certificate", value: ringDetails.certificate },
      ].filter(Boolean)
    : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] border border-gray-800 rounded-none max-w-3xl w-full my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-800 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl text-white mb-2 font-serif">Engagement Ring Enquiry</h2>
            <p className="text-sm text-gray-400">
              Enquiring about: <span className="text-white">{ring.name}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Starting from £{ring.basePrice.toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-16 px-8">
            <BadgeCheck className="mx-auto mb-4 text-white" size={48} />
            <h3 className="text-2xl text-white mb-3 font-serif">Enquiry Sent!</h3>
            <p className="text-gray-400 text-sm mb-6">
              We&apos;ll get back to you shortly via your preferred contact methods.
            </p>
            <button
              onClick={onClose}
              className="bg-white text-black px-8 py-3 font-bold tracking-widest text-sm hover:bg-gray-200 transition-colors"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

            {/* Ring Configuration Summary */}
            {detailItems.length > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Gem size={14} className="text-[#D4AF37]" />
                  <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">Your Configuration</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {detailItems.map((item) =>
                    item ? (
                      <div key={item.label} className="bg-black/40 border border-zinc-800 rounded px-3 py-2">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">{item.label}</p>
                        <p className="text-sm text-white">{item.value}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-xl text-white mb-4 flex items-center gap-2 font-serif">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+44 7700 900000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">Preferred Contact Methods *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["call", "email", "whatsapp"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() =>
                        setContactMethods((current) =>
                          current.includes(method)
                            ? current.filter((m) => m !== method)
                            : [...current, method]
                        )
                      }
                      aria-pressed={contactMethods.includes(method)}
                      className={`py-3 px-4 border text-sm font-medium transition-all ${
                        contactMethods.includes(method)
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
                </svg>
                Message
              </h3>
              <textarea
                placeholder="Tell us any additional details you'd like us to know..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Visited Other Dealers */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={visitedOthers}
                  onChange={(e) => setVisitedOthers(e.target.checked)}
                  className="w-5 h-5 accent-white cursor-pointer"
                />
                <span className="text-white text-sm group-hover:text-gray-300 transition-colors">
                  I have visited other dealers
                </span>
              </label>
              {visitedOthers && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">What dealer did you visit?</label>
                    <input
                      type="text"
                      placeholder="e.g. Tiffany & Co"
                      value={otherDealerName}
                      onChange={(e) => setOtherDealerName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">What did they quote you?</label>
                    <input
                      type="text"
                      placeholder="e.g. £8,500"
                      value={otherDealerPrice}
                      onChange={(e) => setOtherDealerPrice(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Newsletter */}
            <div className="border-t border-gray-800 pt-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={optOutNewsletter}
                  onChange={(e) => setOptOutNewsletter(e.target.checked)}
                  className="w-5 h-5 accent-white cursor-pointer"
                />
                <span className="text-white text-sm group-hover:text-gray-300 transition-colors">
                  Opt out of newsletter (we&apos;ll keep you updated on exclusive offers by default)
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-800 pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-white text-black font-bold py-4 px-8 hover:bg-gray-200 transition-colors tracking-widest text-sm disabled:opacity-50"
              >
                {loading ? "SUBMITTING..." : "SUBMIT ENQUIRY"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 border border-gray-800 text-white hover:border-white transition-colors text-sm tracking-widest"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
