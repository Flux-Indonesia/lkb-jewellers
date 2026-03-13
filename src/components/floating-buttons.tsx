"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronRight, ChevronLeft, ChevronUp, MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Script from "next/script";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": {
        "agent-id": string;
        "dynamic-variables"?: string;
        "avatar-orb-color-1"?: string;
        "avatar-orb-color-2"?: string;
        "override-first-message"?: string;
        "markdown-link-allowed-hosts"?: string;
      };
    }
  }
}

interface VisitorData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export default function FloatingButtons() {
  const [expanded, setExpanded] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [formData, setFormData] = useState<VisitorData>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitorData(formData);
  };

  return (
    <>
      {/* ElevenLabs widget script */}
      <Script
        src="https://elevenlabs.io/convai-widget/index.js"
        strategy="lazyOnload"
      />

      {/* Right side - Phone + WhatsApp + Uncle G */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        {/* Toggle button */}
        <Button
          onClick={() => setExpanded(!expanded)}
          className="bg-white text-black p-3 rounded-full shadow-2xl hover:bg-gray-100 hover:scale-110 active:scale-95 h-auto w-auto transition-all duration-300"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>

        {/* Expandable buttons */}
        <div
          className={`flex flex-col gap-3 transition-all duration-500 ease-in-out ${
            expanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-20 pointer-events-none"
          }`}
        >
          {/* Uncle G Chat */}
          <div className="relative group">
            <button
              onClick={() => setChatOpen(true)}
              className="bg-black text-white border-2 border-[#D4AF37] p-3 rounded-full shadow-2xl hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-float"
              aria-label="Chat with Uncle G"
              style={{ animationDelay: "0.6s" }}
            >
              <MessageCircle className="w-5 h-5 text-[#D4AF37] group-hover:text-black transition-colors duration-300" />
            </button>
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black border border-[#D4AF37]/40 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Chat with Uncle G
            </span>
          </div>

          <a
            href="tel:+442033365303"
            className="bg-black text-white border-2 border-gray-700 p-3 rounded-full shadow-2xl hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-float"
            aria-label="Call Us"
            style={{ animationDelay: "0.2s" }}
          >
            <Phone className="w-5 h-5 text-white group-hover:text-black" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/447802323652"
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110 flex items-center justify-center group animate-bounce-slow relative"
            aria-label="Chat on WhatsApp"
            style={{ animationDelay: "0.4s" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
          </a>
        </div>
      </div>

      {/* Uncle G Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 md:p-8 pointer-events-none">
          <div
            className="pointer-events-auto w-full max-w-sm bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow:
                "0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.06)",
              maxHeight: "min(600px, 85vh)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, #0a0a0a 0%, #130e00 100%)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 flex items-center justify-center">
                  <span className="text-[#D4AF37] text-sm">✦</span>
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-tight">
                    Uncle G
                  </p>
                  <p
                    className="text-[#D4AF37] text-xs"
                    style={{
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    Your Jewellery Expert
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-500 hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body — pre-chat form or ElevenLabs widget */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {!visitorData ? (
                <form
                  onSubmit={handleFormSubmit}
                  className="p-5 flex flex-col gap-4"
                >
                  <p
                    className="text-gray-300 text-sm leading-relaxed"
                    style={{
                      fontFamily:
                        '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
                    }}
                  >
                    Welcome to LKB Jewellers. Before we begin, may I take a few
                    details so our team can assist you personally?
                  </p>

                  <div className="flex flex-col gap-1">
                    <label className="text-[#D4AF37] text-xs font-medium tracking-wide uppercase">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your full name"
                      className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[#D4AF37] text-xs font-medium tracking-wide uppercase">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="your@email.com"
                      className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[#D4AF37] text-xs font-medium tracking-wide uppercase">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Your address"
                      className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[#D4AF37] text-xs font-medium tracking-wide uppercase">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+44 7000 000000"
                      className="bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-1 bg-[#D4AF37] text-black font-semibold py-2.5 rounded-lg hover:bg-[#c4a030] transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Start Chat with Uncle G
                  </button>
                </form>
              ) : (
                <div className="h-[450px] w-full">
                  <elevenlabs-convai
                    agent-id="agent_7601kkk0btpde10tf5y7szdyhr93"
                    dynamic-variables={JSON.stringify({
                      customer_name: visitorData.name,
                      customer_email: visitorData.email,
                      customer_address: visitorData.address,
                      customer_phone: visitorData.phone,
                    })}
                    avatar-orb-color-1="#D4AF37"
                    avatar-orb-color-2="#8B7420"
                    override-first-message={`Welcome to LKB Jewellers, ${visitorData.name}. I'm Uncle G — how can I help you today?`}
                    markdown-link-allowed-hosts="lkb-jewellers.vercel.app,www.lkbjewellers.com"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Left side - Back to Top */}
      <div
        className={`fixed bottom-8 left-8 z-40 transition-all duration-500 transform ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0"
        }`}
      >
        <button
          onClick={scrollToTop}
          className="bg-black border border-white/70 text-white hover:bg-white hover:text-black px-4 py-3 rounded-[18px] shadow-2xl transition-all duration-300 group focus:outline-none"
          aria-label="Back to Top"
        >
          <ChevronUp
            size={22}
            className="group-hover:-translate-y-1 transition-transform duration-300"
          />
        </button>
      </div>
    </>
  );
}
