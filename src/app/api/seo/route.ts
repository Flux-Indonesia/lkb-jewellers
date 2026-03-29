import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function isAuthenticated(request: NextRequest): boolean {
	const cookieHeader = request.headers.get("cookie") || "";
	return cookieHeader.includes("admin_session=authenticated");
}

function createServiceClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SECRET_KEY!
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
	try {
		if (!isAuthenticated(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const key = process.env.SUPABASE_SECRET_KEY;

		if (!url || !key) {
			const supabaseEnvKeys = Object.keys(process.env).filter(k => k.includes("SUPABASE") || k.includes("SECRET") || k.includes("SERVICE"));
			return NextResponse.json({
				error: "Missing env vars",
				hasUrl: !!url,
				hasKey: !!key,
				availableKeys: supabaseEnvKeys,
			}, { status: 500 });
		}

		const type = request.nextUrl.searchParams.get("type") || "product";
		const supabase = createSupabaseClient(url, key);

		if (type === "ring") {
			const { data, error } = await supabase
				.from("engagement_rings")
				.select(`id, slug, name, title, meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image, h1_override, noindex, nofollow, is_active`)
				.order("name", { ascending: true });

			if (error) {
				return NextResponse.json({ error: "Ring fetch failed", detail: error.message, code: error.code }, { status: 500 });
			}
			return NextResponse.json({ data });
		}

		const { data, error } = await supabase
			.from("products")
			.select(`id, name, category, brand, image, slug, meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image, h1_override, noindex, nofollow, image_alt_text`)
			.order("name", { ascending: true });

		if (error) {
			return NextResponse.json({ error: "Product fetch failed", detail: error.message, code: error.code }, { status: 500 });
		}
		return NextResponse.json({ data });
	} catch (err) {
		return NextResponse.json({
			error: "Unhandled error",
			message: err instanceof Error ? err.message : String(err),
		}, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
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

	if (error) {
		console.error("[SEO API] Product update error:", error.message);
		return NextResponse.json({ error: "Failed to update product SEO" }, { status: 500 });
	}
	return NextResponse.json({ success: true });
	} catch (err) {
		console.error("[SEO API] PATCH unhandled error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
