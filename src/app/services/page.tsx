"use client";

import Link from "next/link";
import {
  Watch,
  Gem,
  PenTool,
  Banknote,
  Settings,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";


const services = [
  {
    icon: Watch,
    title: "Luxury Watches",
    description:
      "Explore our curated collection of luxury timepieces from the world's most prestigious brands including Rolex, Patek Philippe, Audemars Piguet, and Richard Mille.",
    href: "/shop",
    linkText: "Shop Watches",
  },
  {
    icon: Gem,
    title: "Fine Jewellery",
    description:
      "Discover exceptional diamond rings, necklaces, bracelets, and earrings crafted with the finest gemstones and precious metals.",
    href: "/shop",
    linkText: "Shop Jewellery",
  },
  {
    icon: PenTool,
    title: "Bespoke Design",
    description:
      "Create a one-of-a-kind piece with our bespoke design service. From concept to creation, our master jewellers will bring your vision to life.",
    href: "/bespoke",
    linkText: "Learn More",
  },
  {
    icon: Banknote,
    title: "We Buy",
    description:
      "Sell your pre-owned luxury watches and jewellery for competitive prices. Transparent valuations and immediate payment available.",
    href: "/we-buy",
    linkText: "Get a Valuation",
  },
  {
    icon: Settings,
    title: "Watch Servicing",
    description:
      "Keep your timepieces in perfect condition with our comprehensive servicing, from battery replacements to full movement overhauls.",
    href: "/servicing",
    linkText: "View Services",
  },
  {
    icon: Sparkles,
    title: "Jewellery Care",
    description:
      "Professional cleaning, polishing, and restoration services to keep your precious pieces looking their absolute best.",
    href: "/servicing",
    linkText: "View Services",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <span className="text-white text-xs tracking-[0.5em] uppercase">
              Our Expertise
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </div>
          <h1
            className="text-5xl md:text-7xl text-white mb-6 font-normal font-heading"
          >
            Our Services
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">
            From luxury timepieces to bespoke jewellery, we offer a
            comprehensive range of services tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group block"
            >
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3
                className="text-xl text-white mb-3 font-normal font-heading"
              >
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-4">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                {service.linkText}
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-lg p-12">
            <h2
              className="text-3xl md:text-4xl text-white mb-4 font-normal font-heading"
            >
              Need Something Special?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto font-display">
              Get in touch with our team to discuss your specific requirements.
              We&apos;re here to help.
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
