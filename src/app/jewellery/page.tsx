"use client";

import { Suspense } from "react";
import ShopContent from "@/components/shop-content";
import ShowroomSection from "@/components/showroom-section";

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
