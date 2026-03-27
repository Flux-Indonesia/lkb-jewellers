"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Truck, Shield, BadgeCheck } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { getProductById } from "@/lib/products";
import type { Product } from "@/data/products";
import ShowroomSection from "@/components/showroom-section";
import { EnquiryModal } from "@/components/enquiry-modal";
import { ProductJsonLd } from "@/components/json-ld";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();
  const id = (params?.id ?? "") as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [cartConfirm, setCartConfirm] = useState(false);

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  const images = product?.images && product.images.length > 0 ? product.images : product?.image ? [product.image] : [];

  const goNext = useCallback(() => {
    setActiveImage((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent" />
          <p className="text-gray-400 mt-4 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-black mb-6 font-heading">Product not found</h1>
          <Link
            href="/shop"
            className="text-sm tracking-widest uppercase text-gray-500 hover:text-black transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const isWatchStrap = product.tags?.toLowerCase().includes("watch strap") || product.tags?.toLowerCase().includes("accessories > watch strap");
  const isEnquiryOnly = (product.category === "watch" || product.category === "luxury-jewellery") && !isWatchStrap;
  const isOutOfStock = (product.stock || 0) === 0;
  const hasSpecs = product.category === "watch" && (product.model || product.caseSize || product.caseMaterial || product.dialColor || product.yearOfProduction);

  const formatCategory = (cat: string) => cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handleBuyNow = () => {
    if (product && !isEnquiryOnly) {
      addToCart(product);
      router.push("/checkout");
    } else if (isEnquiryOnly) {
      setEnquiryOpen(true);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    setCartConfirm(true);
  };

  return (
    <div className="bg-white text-gray-900 pt-32 pb-24 min-h-screen">
      <ProductJsonLd
        name={product.name}
        description={product.description || `${product.name} available at LKB Jewellers, Hatton Garden London.`}
        image={product.image || ""}
        price={product.price}
        availability={isOutOfStock ? "OutOfStock" : "InStock"}
        url={`https://www.lkbjewellers.com/product/${product.id}`}
        brand={product.brand}
      />
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="inline-flex items-center text-gray-600 hover:text-black mb-8 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Collection
        </button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="aspect-square bg-gray-50 border-2 border-gray-200 relative overflow-hidden group cursor-pointer w-full max-w-2xl mx-auto hover:border-[#D4AF37] transition-all duration-300"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={images[activeImage] || PLACEHOLDER_IMG}
                alt={`${product.name} - Image ${activeImage + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={(e) => { (e.target as HTMLImageElement).srcset = ""; (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
              />

              {/* Click to Enlarge overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold shadow-xl">Click to Enlarge</span>
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#D4AF37] text-black p-3 rounded-full transition-all z-20 shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-[#D4AF37] text-black p-3 rounded-full transition-all z-20 shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Image counter */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm z-20 text-white font-semibold">
                    {activeImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div
                className={`grid gap-3 w-full justify-center ${
                  images.length === 2 ? "grid-cols-2 max-w-[140px]" :
                  images.length === 3 ? "grid-cols-3 max-w-[210px]" :
                  "grid-cols-4 max-w-[280px]"
                } mx-auto`}
              >
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`aspect-square bg-gray-50 cursor-pointer border-2 transition-all overflow-hidden w-16 h-16 hover:scale-105 ${
                      activeImage === i ? "border-[#D4AF37] shadow-lg" : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => setActiveImage(i)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      width={64}
                      height={64}
                      className={`w-full h-full object-cover transition-opacity ${activeImage === i ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                      onError={(e) => { (e.target as HTMLImageElement).srcset = ""; (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col h-full">
            {/* Category */}
            <span
              className="text-[#D4AF37] tracking-widest text-xs uppercase mb-3 font-bold"
              style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            >
              {formatCategory(product.category)}
            </span>

            {/* Name */}
            <h1
              className="text-4xl md:text-5xl mb-6 text-black font-bold leading-tight font-heading"
            >
              {product.name}
            </h1>

            {/* Price */}
            {product.price > 0 ? (
              <p
                className="text-3xl font-bold mb-8 text-black"
                style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}
              >
                £{product.price.toLocaleString()}
              </p>
            ) : (
              <p
                className="text-3xl font-bold mb-8 text-[#D4AF37]"
                style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}
              >
                Price on Request
              </p>
            )}

            {/* Out of Stock Badge */}
            {isOutOfStock && (
              <div className="mb-6">
                <span className="inline-block px-6 py-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border-2 border-red-200">
                  OUT OF STOCK
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-8">
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-4 font-bold tracking-widest cursor-not-allowed rounded-lg border-2 border-gray-400"
                >
                  OUT OF STOCK
                </button>
              ) : isEnquiryOnly ? (
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black py-4 font-bold tracking-widest hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-lg border-2 border-gold"
                >
                  ENQUIRE NOW
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white py-4 font-bold tracking-widest hover:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-lg border-2 border-black hover:border-gray-800"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black py-4 font-bold tracking-widest hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-center flex items-center justify-center rounded-lg border-2 border-[#D4AF37]"
                  >
                    BUY NOW
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <p
              className="text-gray-700 leading-relaxed mb-8 pb-8 text-base bg-gray-50 p-6 rounded-xl border border-gray-200"
              style={{ fontFamily: '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif' }}
            >
              {product.description?.replace(/\\n/g, "\n").trim()}
            </p>

            {/* Watch Specs */}
            {hasSpecs && (
              <div className="mb-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-2xl text-black mb-8 font-bold font-heading">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-6">
                  {product.model && (
                    <div className="col-span-2 pb-4 border-b border-gray-200">
                      <span className="text-gray-600 text-xs uppercase tracking-wider block mb-2 font-bold">Model Reference</span>
                      <span className="text-black font-bold text-xl">{product.model}</span>
                    </div>
                  )}
                  {product.caseSize && product.caseSize.trim() !== "" && (
                    <div className="pb-4 border-b border-gray-200">
                      <span className="text-gray-600 text-xs uppercase tracking-wider block mb-2 font-bold">Case Size</span>
                      <span className="text-black font-bold text-lg">{product.caseSize}</span>
                    </div>
                  )}
                  {product.caseMaterial && product.caseMaterial.trim() !== "" && (
                    <div className="pb-4 border-b border-gray-200">
                      <span className="text-gray-600 text-xs uppercase tracking-wider block mb-2 font-bold">Case Material</span>
                      <span className="text-black font-bold text-lg capitalize">{product.caseMaterial}</span>
                    </div>
                  )}
                  {product.dialColor && product.dialColor.trim() !== "" && (
                    <div className="pb-4 border-b border-gray-200">
                      <span className="text-gray-600 text-xs uppercase tracking-wider block mb-2 font-bold">Dial Colour</span>
                      <span className="text-black font-bold text-lg capitalize">
                        {product.dialColor.charAt(0).toUpperCase() + product.dialColor.slice(1)}
                      </span>
                    </div>
                  )}
                  {product.yearOfProduction && product.yearOfProduction > 0 && (
                    <div className="pb-4 border-b border-gray-200">
                      <span className="text-gray-600 text-xs uppercase tracking-wider block mb-2 font-bold">Year of Production</span>
                      <span className="text-black font-bold text-lg">{product.yearOfProduction}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="space-y-4 mb-10 bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start gap-4 text-sm text-black">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Truck size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold mb-1">Free Insured Worldwide Shipping</p>
                  <p className="text-gray-600 text-xs">Delivered safely to your doorstep</p>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-start gap-4 text-sm text-black">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold mb-1">12 Month Comprehensive Warranty</p>
                  <p className="text-gray-600 text-xs">Complete peace of mind</p>
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-start gap-4 text-sm text-black">
                <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <BadgeCheck size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold mb-1">Authenticity Guaranteed</p>
                  <p className="text-gray-600 text-xs">Verified by an expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Confirmation Modal */}
      {cartConfirm && product && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setCartConfirm(false)}>
          <div
            className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#D4AF37] rounded-lg max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setCartConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4AF37]/20 rounded-full mb-6 animate-bounce">
                <BadgeCheck className="text-[#D4AF37]" size={40} />
              </div>
              <h3 className="text-3xl text-white mb-3 font-heading">Added to Cart!</h3>
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                  <Image src={product.image || PLACEHOLDER_IMG} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 text-left">
                    <p className="text-gray-900 font-medium text-sm">{product.name}</p>
                    <p className="text-[#D4AF37] text-sm mt-1">£{product.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => { setCartConfirm(false); setIsCartOpen(true); }}
                  className="w-full bg-[#D4AF37] text-black py-4 font-bold tracking-widest hover:bg-[#D4AF37]/90 transition-colors rounded"
                >
                  VIEW CART & CHECKOUT
                </button>
                <button
                  onClick={() => setCartConfirm(false)}
                  className="w-full border-2 border-gray-700 text-white py-4 font-bold tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors rounded"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={enquiryOpen} onClose={() => setEnquiryOpen(false)} product={product} />

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-50">
            <X size={24} />
          </button>
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeImage] || PLACEHOLDER_IMG}
              alt={`${product.name} - Image ${activeImage + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).srcset = ""; (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-black p-4 rounded-full transition-all"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-black p-4 rounded-full transition-all"
                >
                  <ChevronRight size={32} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white text-lg">
                  {activeImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <ShowroomSection />
    </div>
  );
}
