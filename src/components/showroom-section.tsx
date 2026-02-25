"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone, ArrowRight } from "lucide-react";

export default function ShowroomSection() {
  const [showroomTab, setShowroomTab] = useState<"london" | "international">("london");

  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-black">
      <div className="mx-auto px-6 max-w-6xl mb-16 md:mb-20">
        <div className="h-px bg-gray-800" />
      </div>
      <div className="mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-8 border border-gray-800 bg-[#050505] relative z-10 mx-auto max-w-6xl">
          {/* Left - Showroom Image */}
          <div className="w-full md:w-1/2 h-[300px] md:h-[500px] relative transition-all duration-700 overflow-hidden group">
            <Image
              src={showroomTab === "london" ? "https://www.lkbjewellers.com/showroomEntry.jpg" : "https://www.lkbjewellers.com/showroomEntry2.jpg"}
              alt={showroomTab === "london" ? "Hatton Garden Showroom" : "International Service"}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            {/* Location Tabs */}
            <div className="absolute bottom-8 left-8 flex gap-3 z-10">
              <button
                onClick={() => setShowroomTab("london")}
                className={`px-6 py-4 text-sm font-bold tracking-widest uppercase transition-all ${
                  showroomTab === "london"
                    ? "bg-white text-black"
                    : "bg-black/60 text-white hover:bg-white/20"
                }`}
              >
                London HQ
              </button>
              <button
                onClick={() => setShowroomTab("international")}
                className={`px-6 py-4 text-sm font-bold tracking-widest uppercase transition-all ${
                  showroomTab === "international"
                    ? "bg-white text-black"
                    : "bg-black/60 text-white hover:bg-white/20"
                }`}
              >
                International
              </button>
            </div>
          </div>

          {/* Right - Info */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <span className="text-white text-xs tracking-[0.3em] uppercase mb-4 block">
              {showroomTab === "london" ? "The Experience" : "Global Service"}
            </span>
            <h2
              className="text-3xl md:text-4xl text-white mb-6 leading-tight font-heading"
            >
              {showroomTab === "london" ? "Visit Our Showroom" : "International Delivery"}
            </h2>
            <div className="w-12 h-0.5 bg-gray-800 mb-8" />
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md text-base">
              {showroomTab === "london"
                ? "Immerse yourself in the world of Local Kettle Brothers. Our Hatton Garden boutique offers a private, exclusive environment to view our exclusive timepieces and discuss bespoke commissions."
                : "We cater to international clients with personalized service. No need to travel to us - once you have decided on your chosen watch, we will have a member of our team personally fly to hand deliver it to you, anywhere in the world."}
            </p>

            {/* Contact Details */}
            <div className="space-y-6 mb-8 w-full max-w-md">
              {showroomTab === "london" ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
                      <MapPin className="text-white" size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Address</h4>
                      <span className="text-gray-400 text-sm font-display">New House, 67-68 Hatton Garden, London, EC1N 8JY</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
                      <Clock className="text-white" size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Opening Hours</h4>
                      <span className="text-gray-400 text-sm font-display">Mon - Sun: By Appointment Only</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
                      <Phone className="text-white" size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Contact</h4>
                      <span className="text-gray-400 text-sm font-display">+44 20 3336 5303</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
                      <svg viewBox="0 0 24 24" width={18} height={18} className="text-white" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">WhatsApp</h4>
                      <a href="https://wa.me/447802323652?text=Hello%2C%20I%27m%20interested%20in%20visiting%20your%20showroom" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm transition-colors font-display">+44 78 0232 3652</a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
                      <MapPin className="text-white" size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Worldwide Delivery</h4>
                      <span className="text-gray-400 text-sm font-display">Hand-delivered to your door, anywhere in the world</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-900 p-2 rounded-full flex-shrink-0">
                      <Phone className="text-white" size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-white text-sm font-bold uppercase tracking-wide font-heading">Contact</h4>
                      <span className="text-gray-400 text-sm font-display">+44 20 3336 5303</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link
              href="https://maps.google.com/?q=New+House+67-68+Hatton+Garden+London+EC1N+8JY"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-8 py-3 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
            >
              GET DIRECTIONS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
