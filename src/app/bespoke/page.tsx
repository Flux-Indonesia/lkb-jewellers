"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil, PenTool, Hammer, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";


const processSteps = [
  {
    icon: Pencil,
    number: "01",
    title: "Design Consultation",
    description:
      "Meet with our designers to discuss your vision, preferences, and budget. We'll explore ideas and create a concept that reflects your unique style.",
  },
  {
    icon: PenTool,
    number: "02",
    title: "Sketching",
    description:
      "Our artists translate your ideas into detailed sketches and 3D renderings. Review and refine the design until it's exactly what you envisioned.",
  },
  {
    icon: Hammer,
    number: "03",
    title: "Crafting",
    description:
      "Our master jewellers bring the design to life using traditional techniques and the finest materials. Every detail is meticulously handcrafted.",
  },
  {
    icon: Package,
    number: "04",
    title: "Delivery",
    description:
      "Your finished piece undergoes final quality inspection before being presented to you in our signature LKB packaging. A moment to treasure forever.",
  },
];

export default function BespokePage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Hero with Video */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
          preload="metadata"
          playsInline
          autoPlay
          muted
          loop
          style={{ willChange: "transform" }}
        >
          <source src="/jewlerryGlorify1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase">
              Made For You
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-normal text-shadow-hero font-heading"
          >
            Bespoke Designs
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed text-shadow-hero font-display">
            Create something truly unique. Our master craftsmen will bring your
            vision to life.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-4 mb-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase">
                  Your Vision
                </span>
              </div>
              <h2
                className="text-4xl md:text-5xl text-white font-normal font-heading"
              >
                One of a Kind
              </h2>
              <p className="text-gray-400 leading-relaxed">
                At LKB Jewellers, we specialise in creating bespoke jewellery
                that tells your unique story. From engagement rings to statement
                pendants, every piece is designed and handcrafted exclusively for
                you.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Our bespoke service begins with a personal consultation where we
                learn about your style, preferences, and the story behind the
                piece. Whether you come with a clear design or just an idea,
                our team will guide you through every step of the journey.
              </p>
              <Button asChild className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 h-auto rounded-none font-bold tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95">
                <Link href="/contact">
                  START YOUR JOURNEY
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4AF37]/20 via-transparent to-[#D4AF37]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2023/10/DAVIDO-42-scaled.jpg?resize=1229%2C1536&ssl=1"
                  alt="Bespoke jewellery creation"
                  width={1229}
                  height={1536}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/30" />
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28 px-4 md:px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
              <span className="text-white text-xs tracking-[0.5em] uppercase">
                How It Works
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
            </div>
            <h2
              className="text-4xl md:text-5xl text-white font-normal font-heading"
            >
              Our Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="relative bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group text-center"
              >
                <span
                  className="absolute top-4 right-4 text-[#D4AF37]/20 text-3xl font-bold"
                >
                  {step.number}
                </span>
                <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3
                  className="text-xl text-white mb-3 font-normal font-heading"
                >
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <Button asChild className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 h-auto rounded-none font-bold tracking-widest text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95">
              <Link href="/contact">
                BOOK A CONSULTATION
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
