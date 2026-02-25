"use client";

import Link from "next/link";
import { Battery, Settings, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


const services = [
  {
    icon: Battery,
    title: "Battery Replacement",
    description:
      "Quick and professional battery replacement for all quartz watches. We use only high-quality batteries and ensure your watch is resealed to maintain its water resistance rating.",
    price: "From £25",
  },
  {
    icon: Settings,
    title: "Full Service",
    description:
      "Complete movement overhaul including disassembly, cleaning, lubrication, calibration, and reassembly. We service all major brands including Rolex, Omega, Cartier, and more.",
    price: "From £195",
  },
  {
    icon: RotateCcw,
    title: "Restoration",
    description:
      "Expert restoration of vintage and antique timepieces and jewellery. Our master craftsmen can bring your treasured pieces back to their original glory while preserving their character.",
    price: "Quote on request",
  },
  {
    icon: Sparkles,
    title: "Polishing",
    description:
      "Professional polishing and refinishing services to remove scratches and restore the original lustre of your watches and jewellery. Available for gold, platinum, and stainless steel.",
    price: "From £50",
  },
];

export default function ServicingPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <span className="text-white text-xs tracking-[0.5em] uppercase">
              Expert Care
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </div>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl text-white mb-6 font-normal font-heading"
          >
            Watch &amp; Jewellery Servicing
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">
            Trust your precious timepieces and jewellery to our team of
            certified watchmakers and master craftsmen.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-xl text-white font-normal font-heading"
                    >
                      {service.title}
                    </h3>
                    <span className="text-[#D4AF37] text-sm font-semibold tracking-wider">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl text-white mb-8 font-normal font-heading"
          >
            Why Choose LKB Servicing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: "Certified Experts",
                desc: "Factory-trained watchmakers with decades of experience",
              },
              {
                title: "Genuine Parts",
                desc: "We use only authentic manufacturer parts and components",
              },
              {
                title: "Full Warranty",
                desc: "All services come with a comprehensive warranty period",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3
                  className="text-lg text-white mb-2 font-normal font-heading"
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-lg p-12">
            <h2
              className="text-3xl md:text-4xl text-white mb-4 font-normal font-heading"
            >
              Book Your Service
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto font-display">
              Contact us to discuss your servicing needs. We offer free
              estimates and collection services for high-value pieces.
            </p>
            <Button asChild className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 h-auto rounded-none font-bold tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95">
              <Link href="/contact">
                CONTACT US
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
