import type { Metadata } from "next";
import { Suspense } from "react";
import ShopContent from "@/components/shop-content";
import ShowroomSection from "@/components/showroom-section";

export const metadata: Metadata = {
  title: "Luxury Accessories | Premium Merchandise & Gifts",
  description:
    "Shop premium accessories and luxury merchandise at LKB Jewellers. Exclusive gifts, leather goods and more from Hatton Garden London.",
};

export default function AccessoriesPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
            <div className="text-white text-xs tracking-widest uppercase">
              Loading accessories...
            </div>
          </div>
        }
      >
        <ShopContent defaultCategory="Merchandise" />
      </Suspense>
      <ShowroomSection />
    </>
  );
}
