import type { MetadataRoute } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createServiceClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.lkbjewellers.com";

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
		{ url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/shop/rolex`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
		{ url: `${baseUrl}/shop/audemars-piguet`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
		{ url: `${baseUrl}/shop/cartier`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
		{ url: `${baseUrl}/shop/patek-philippe`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
		{ url: `${baseUrl}/shop/richard-mille`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
		{ url: `${baseUrl}/watches`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/jewellery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/accessories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/engagement-rings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
		{ url: `${baseUrl}/we-buy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
		{ url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
		{ url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/servicing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/bespoke`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
	];

	let productRoutes: MetadataRoute.Sitemap = [];
	let ringRoutes: MetadataRoute.Sitemap = [];

	try {
		const supabase = createServiceClient();

		const { data: products } = await supabase
			.from("products")
			.select("id, brand, slug, updated_at, noindex")
			.eq("noindex", false);

		if (products) {
			productRoutes = products.map((p) => {
				const brandSlug = p.brand
					? (p.brand as string).toLowerCase().replace(/\s+/g, "-")
					: null;
				const productSlug = p.slug || p.id;
				const url = brandSlug
					? `${baseUrl}/product/${brandSlug}/${productSlug}`
					: `${baseUrl}/product/${productSlug}`;
				return {
					url,
					lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
					changeFrequency: "weekly" as const,
					priority: 0.7,
				};
			});
		}

		const { data: rings } = await supabase
			.from("engagement_rings")
			.select("slug, updated_at, noindex, is_active")
			.eq("is_active", true)
			.eq("noindex", false);

		if (rings) {
			ringRoutes = rings.map((r) => ({
				url: `${baseUrl}/engagement-rings/${r.slug}`,
				lastModified: r.updated_at ? new Date(r.updated_at) : new Date(),
				changeFrequency: "weekly" as const,
				priority: 0.7,
			}));
		}
	} catch {
		// DB unavailable at build — return static routes only
	}

	return [...staticRoutes, ...productRoutes, ...ringRoutes];
}
