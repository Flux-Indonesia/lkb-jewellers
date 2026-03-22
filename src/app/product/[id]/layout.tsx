import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
	const { id } = await params;
	const supabase = await createClient();
	const { data } = await supabase.from("products").select("*").eq("id", id).single();

	if (!data) {
		return { title: "Product Not Found" };
	}

	const title = `${data.name} | LKB Jewellers`;
	const description = data.description
		? String(data.description).slice(0, 160)
		: `Shop ${data.name} at LKB Jewellers, Hatton Garden London. Luxury ${data.category || "jewellery"} with authenticity guarantee.`;

	return {
		title: data.name,
		description,
		openGraph: {
			title,
			description,
			type: "website",
			images: data.image ? [{ url: data.image, width: 800, height: 800, alt: data.name }] : [],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: data.image ? [data.image] : [],
		},
	};
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
	return children;
}
