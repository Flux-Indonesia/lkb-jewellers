import type { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "@/components/shop-content";
import ShowroomSection from "@/components/showroom-section";

export const metadata: Metadata = {
  title: "Luxury Jewellery | Diamond Rings, Necklaces & Bracelets",
  description:
    "Explore our stunning collection of luxury jewellery. Handcrafted diamond rings, necklaces, bracelets and earrings at LKB Jewellers, Hatton Garden London.",
};

export default function JewelleryPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
            <div className="text-white text-xs tracking-widest uppercase animate-pulse">
              Loading jewellery...
            </div>
          </div>
        }
      >
        <ShopContent defaultCategory="Jewellery" />
      </Suspense>
      <ShowroomSection />
    </>
  );
}
