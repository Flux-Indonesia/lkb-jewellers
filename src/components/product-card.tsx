"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { EnquiryModal } from "@/components/enquiry-modal";
import { productUrl } from "@/lib/product-url";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image || ""];
  const hasMultipleImages = images.length > 1;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImage((i) => (i + 1) % images.length);
  };

  const handleEnquire = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEnquiryOpen(true);
  };

  const handleCardClick = () => {
    router.push(productUrl(product));
  };

  const formatCategory = (cat: string) => {
    if (cat === "luxury-jewellery") return "Luxury Jewellery";
    if (cat === "watch") return "Watch";
    return cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <div className="group block cursor-pointer" onClick={handleCardClick}>
        <div className="relative overflow-hidden bg-white aspect-square mb-4">
          {/* Image wrapper — scales on hover */}
          <div className="relative w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700">
            <Image
              src={images[activeImage] || PLACEHOLDER_IMG}
              alt={product.name}
              fill
              className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 opacity-100 transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              onError={(e) => { (e.target as HTMLImageElement).srcset = ""; (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
             
            />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors duration-500" />

          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-auto"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    activeImage === i ? "bg-gold" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Enquire Now — slides up from bottom on hover */}
          <button
            onClick={handleEnquire}
            className={`absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 text-center text-xs tracking-widest uppercase font-bold z-10 ${
              product.stock === 0
                ? "bg-red-900 text-white cursor-not-allowed"
                : "bg-gold text-black hover:bg-gold/90"
            }`}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Enquire Now"}
          </button>
        </div>

        {/* Product info */}
        <div className="text-center">
          {product.brand && (
            <p className="text-gold text-xs uppercase tracking-widest mb-1 font-semibold">
              {product.brand}
            </p>
          )}
          <h3 className="text-lg mb-1 text-gray-800 group-hover:text-black transition-colors font-heading">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-display">
            {formatCategory(product.category)}
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-black font-semibold text-base font-display">
              {product.price > 0
                ? `£${product.price.toLocaleString("en-GB")}`
                : "Price on request"}
            </p>
            {product.stock === 0 && (
              <span className="text-xs bg-red-900/30 text-red-500 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} product={product} />
    </>
  );
}
