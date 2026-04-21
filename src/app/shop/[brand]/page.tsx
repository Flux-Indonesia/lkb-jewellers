import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopContent from "@/components/shop-content";
import ShowroomSection from "@/components/showroom-section";

const KNOWN_BRANDS: Record<string, string> = {
  rolex: "Rolex",
  "audemars-piguet": "Audemars Piguet",
  cartier: "Cartier",
  "patek-philippe": "Patek Philippe",
  "richard-mille": "Richard Mille",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await params;
  const brandName = KNOWN_BRANDS[brand];
  if (!brandName) return { title: "Shop | LKB Jewellers" };

  return {
    title: `${brandName} Watches | LKB Jewellers`,
    description: `Browse our curated collection of ${brandName} luxury watches at LKB Jewellers, Hatton Garden London. Authenticity guaranteed.`,
    alternates: {
      canonical: `https://www.lkbjewellers.com/shop/${brand}`,
    },
  };
}

export default async function BrandShopPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;

  if (!KNOWN_BRANDS[brand]) notFound();

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
        <ShopContent defaultBrand={brand} />
      </Suspense>
      <ShowroomSection />
    </>
  );
}
