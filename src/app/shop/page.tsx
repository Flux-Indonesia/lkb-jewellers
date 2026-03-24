import type { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "@/components/shop-content";
import ShowroomSection from "@/components/showroom-section";

export const metadata: Metadata = {
  title: "Shop All | Luxury Watches, Jewellery & Accessories",
  description:
    "Browse our curated collection of luxury watches, bespoke jewellery, and premium accessories. Rolex, Patek Philippe, Richard Mille and more at LKB Jewellers, Hatton Garden London.",
};

export default function ShopPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
            <div className="text-white text-xs tracking-widest uppercase">
              Loading collection...
            </div>
          </div>
        }
      >
        <ShopContent />
      </Suspense>
      <ShowroomSection />
    </>
  );
}
