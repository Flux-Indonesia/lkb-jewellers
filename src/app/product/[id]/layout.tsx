import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const supabase = await createClient();
	const { data } = await supabase.from("products").select("*").eq("id", id).single();

	if (!data) {
		return { title: "Product Not Found" };
	}

	const title = data.meta_title || `${data.name} | LKB Jewellers`;
	const description = data.meta_description
		|| (data.description ? String(data.description).slice(0, 160) : `Shop ${data.name} at LKB Jewellers, Hatton Garden London. Luxury ${data.category || "jewellery"} with authenticity guarantee.`);
	const ogTitle = data.og_title || title;
	const ogDescription = data.og_description || description;
	const ogImage = data.og_image || data.image;
	const altText = data.image_alt_text || data.name;
	const canonical = data.canonical_url || `https://www.lkbjewellers.com/product/${id}`;

	return {
		title,
		description,
		keywords: data.meta_keywords || undefined,
		robots: {
			index: !data.noindex,
			follow: !data.nofollow,
		},
		alternates: {
			canonical,
		},
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

export default function ProductLayout({ children }: { children: React.ReactNode }) {
	return children;
}
