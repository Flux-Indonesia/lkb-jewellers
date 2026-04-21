import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

function getLastSegment(segments: string[]): string {
  return segments[segments.length - 1];
}

async function findProduct(segment: string) {
  const supabase = await createClient();
  // Try slug first, fallback to id
  const { data: bySlug } = await supabase.from("products").select("*").eq("slug", segment).single();
  if (bySlug) return bySlug;
  const { data: byId } = await supabase.from("products").select("*").eq("id", segment).single();
  return byId ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segments: string[] }>;
}): Promise<Metadata> {
  const { segments } = await params;
  const data = await findProduct(getLastSegment(segments));

  if (!data) return { title: "Product Not Found" };

  const title = data.meta_title || `${data.name} | LKB Jewellers`;
  const description =
    data.meta_description ||
    (data.description
      ? String(data.description).slice(0, 160)
      : `Shop ${data.name} at LKB Jewellers, Hatton Garden London. Luxury ${data.category || "jewellery"} with authenticity guarantee.`);
  const ogTitle = data.og_title || title;
  const ogDescription = data.og_description || description;
  const ogImage = data.og_image || data.image;
  const altText = data.image_alt_text || data.name;

  const bSlug = data.brand ? (data.brand as string).toLowerCase().replace(/\s+/g, "-") : null;
  const productSlug = data.slug || data.id;
  const canonical =
    data.canonical_url ||
    (bSlug
      ? `https://www.lkbjewellers.com/product/${bSlug}/${productSlug}`
      : `https://www.lkbjewellers.com/product/${productSlug}`);

  return {
    title,
    description,
    keywords: data.meta_keywords || undefined,
    robots: { index: !data.noindex, follow: !data.nofollow },
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 800, height: 800, alt: altText }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ segments: string[] }>;
}) {
  const { segments } = await params;
  const data = await findProduct(getLastSegment(segments));

  if (!data) notFound();

  return children;
}
