import type { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "@/components/shop-content";
import ShowroomSection from "@/components/showroom-section";

export const metadata: Metadata = {
  title: "Luxury Watches | Rolex, Patek Philippe, Richard Mille",
  description:
    "Discover our exclusive collection of luxury timepieces. Pre-owned and new Rolex, Patek Philippe, Audemars Piguet, Richard Mille watches at LKB Jewellers, Hatton Garden London.",
};

export default function WatchesPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
            <div className="text-white text-xs tracking-widest uppercase">
              Loading timepieces...
            </div>
          </div>
        }
      >
        <ShopContent defaultCategory="Watches" />
      </Suspense>
      <ShowroomSection />
    </>
  );
}
