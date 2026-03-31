import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isAuthenticated } from "@/lib/admin-auth";

function createServiceClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);
}

const SEO_FIELDS = [
	"meta_title", "meta_description", "meta_keywords", "slug",
	"canonical_url", "og_title", "og_description", "og_image",
	"h1_override", "noindex", "nofollow", "image_alt_text",
];

const RING_SEO_FIELDS = [
	"meta_title", "meta_description", "meta_keywords",
	"canonical_url", "og_title", "og_description", "og_image",
	"h1_override", "noindex", "nofollow",
];

export async function GET(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const type = request.nextUrl.searchParams.get("type") || "product";
	const supabase = createServiceClient();

	if (type === "ring") {
		const { data, error } = await supabase
			.from("engagement_rings")
			.select(`id, slug, name, title, meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image, h1_override, noindex, nofollow, is_active`)
			.order("name", { ascending: true });

		if (error) return NextResponse.json({ error: "Failed to fetch ring SEO data" }, { status: 500 });
		return NextResponse.json({ data });
	}

	const { data, error } = await supabase
		.from("products")
		.select(`id, name, category, brand, image, slug, meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image, h1_override, noindex, nofollow, image_alt_text`)
		.order("name", { ascending: true });

	if (error) return NextResponse.json({ error: "Failed to fetch product SEO data" }, { status: 500 });
	return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { type, identifier, ...seoData } = body;

	if (!identifier) {
		return NextResponse.json({ error: "identifier is required" }, { status: 400 });
	}

	const supabase = createServiceClient();

	if (type === "ring") {
		const updateData: Record<string, unknown> = {};
		for (const key of RING_SEO_FIELDS) {
			if (key in seoData) updateData[key] = seoData[key];
		}
		updateData.updated_at = new Date().toISOString();

		const { error } = await supabase
			.from("engagement_rings")
			.update(updateData)
			.eq("slug", identifier);

		if (error) return NextResponse.json({ error: "Failed to update ring SEO" }, { status: 500 });
		return NextResponse.json({ success: true });
	}

	const updateData: Record<string, unknown> = {};
	for (const key of SEO_FIELDS) {
		if (key in seoData) updateData[key] = seoData[key];
	}
	updateData.updated_at = new Date().toISOString();

	const { error } = await supabase
		.from("products")
		.update(updateData)
		.eq("id", identifier);

	if (error) return NextResponse.json({ error: "Failed to update product SEO" }, { status: 500 });
	return NextResponse.json({ success: true });
}
