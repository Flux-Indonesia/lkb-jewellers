"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquare, Search, Banknote, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSellSubmission } from "@/lib/sell-submissions";


const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Contact Us",
    description:
      "Get in touch with our team via phone, email, or visit our Hatton Garden showroom. Tell us about the piece you'd like to sell.",
  },
  {
    icon: Search,
    number: "02",
    title: "Valuation",
    description:
      "Our expert gemologists and horologists will assess your piece thoroughly, providing a fair and transparent market valuation.",
  },
  {
    icon: Banknote,
    number: "03",
    title: "Payment",
    description:
      "Once you accept our offer, we provide immediate payment via your preferred method. Bank transfer, cheque, or cash available.",
  },
];

export default function WeBuyPage() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", brand: "", model: "", referenceNumber: "",
    yearOfManufacture: "", condition: "Good", hasBox: false, hasPapers: false,
    additionalInfo: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 5 - images.length)) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("https://api.imgbb.com/1/upload?key=21a4ec39ce5dad29e92c47325c7d0d73", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success && data.data?.url) {
          setImages((prev) => [...prev, data.data.url]);
        }
      }
    } catch { /* ignore */ } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSellSubmission({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        brand: formData.brand,
        model: formData.model,
        reference_number: formData.referenceNumber,
        year_of_manufacture: formData.yearOfManufacture,
        condition: formData.condition as "Excellent" | "Good" | "Fair" | "Poor",
        has_box: formData.hasBox,
        has_papers: formData.hasPapers,
        additional_info: formData.additionalInfo,
        images,
        status: "new",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2023/10/WE-BUY-WATCHES-scaled.jpg?fit=1638%2C2048&ssl=1"
          alt="We Buy Luxury Watches"
          fill
          className="object-cover opacity-60"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <span className="text-white text-xs tracking-[0.5em] uppercase">
              Sell Your Pieces
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-normal text-shadow-hero font-heading"
          >
            We Buy
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed text-shadow-hero font-display">
            Competitive valuations for luxury watches, fine jewellery &amp;
            diamonds
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2
              className="text-3xl md:text-4xl text-white mb-6 font-normal font-heading"
            >
              Turn Your Luxury Items Into Cash
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              At LKB Jewellers, we offer competitive prices for pre-owned luxury
              watches, diamond jewellery, and precious metals. With decades of
              expertise and a transparent valuation process, you can trust us to
              give you the best possible price for your valuables.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative bg-gray-900/50 p-8 rounded-lg border border-gray-800 hover:border-[#D4AF37]/30 transition-all duration-500 group text-center"
              >
                <div className="absolute top-4 right-4">
                  <span className="text-[#D4AF37]/30 text-4xl font-bold">
                    {step.number}
                  </span>
                </div>
                <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3
                  className="text-2xl text-white mb-4 font-normal font-heading"
                >
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* What We Buy */}
          <div className="mt-20 text-center">
            <h2
              className="text-3xl md:text-4xl text-white mb-8 font-normal font-heading"
            >
              What We Buy
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Rolex",
                "Patek Philippe",
                "Audemars Piguet",
                "Richard Mille",
                "Diamond Rings",
                "Gold Jewellery",
                "Diamond Necklaces",
                "Precious Stones",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg py-4 px-3 text-gray-300 text-sm hover:border-[#D4AF37]/30 hover:text-white transition-all duration-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Sell Form */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4 font-normal font-heading">
                Submit Your Item
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto font-display">
                Fill in the details below and we&apos;ll get back to you with a valuation within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="max-w-2xl mx-auto bg-gray-900/50 border border-[#D4AF37]/30 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Send className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h3 className="text-2xl text-white mb-2 font-normal font-heading">Submission Received</h3>
                <p className="text-gray-400">Thank you! Our team will review your submission and contact you within 24 hours with a valuation.</p>
                <Button onClick={() => { setSubmitted(false); setImages([]); }} className="h-auto mt-6 text-[#D4AF37] text-sm tracking-widest hover:underline" variant="ghost">
                  SUBMIT ANOTHER ITEM
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Full Name *</label>
                    <Input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Email *</label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Phone</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="+44 XXX XXX XXXX" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Brand *</label>
                    <Input type="text" name="brand" value={formData.brand} onChange={handleChange} required
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g., Rolex, Cartier" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Model</label>
                    <Input type="text" name="model" value={formData.model} onChange={handleChange}
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g., Daytona, Santos" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Reference Number</label>
                    <Input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange}
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g., 126500LN" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Year</label>
                    <Input type="text" name="yearOfManufacture" value={formData.yearOfManufacture} onChange={handleChange}
                      className="h-auto w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors" placeholder="e.g., 2023" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Condition</label>
                    <select name="condition" value={formData.condition} onChange={handleChange}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors">
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasBox" checked={formData.hasBox} onChange={handleChange} className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-gray-300 text-sm">Original Box</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="hasPapers" checked={formData.hasPapers} onChange={handleChange} className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-gray-300 text-sm">Original Papers</span>
                  </label>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Photos (max 5)</label>
                  <label className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:border-[#D4AF37]/50 transition-colors cursor-pointer">
                    <Upload size={18} />
                    {uploading ? "Uploading..." : `Upload Images (${images.length}/5)`}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading || images.length >= 5} className="hidden" />
                  </label>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded overflow-hidden border border-gray-800">
                          <Image src={img} alt={`Upload ${i+1}`} fill className="object-cover" sizes="64px" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Additional Information</label>
                  <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg text-white px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none"
                    placeholder="Any additional details about your item..." />
                </div>
                <Button type="submit" disabled={loading}
                  className="h-auto w-full bg-white text-black font-bold tracking-widest py-4 text-sm hover:bg-gray-200 transition-all duration-300 active:scale-95 disabled:opacity-50">
                  {loading ? "SUBMITTING..." : "GET YOUR VALUATION"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
