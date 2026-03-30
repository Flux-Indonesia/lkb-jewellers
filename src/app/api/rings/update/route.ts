import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/admin-auth";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";



function createServiceClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);
}

export async function GET(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const slug = request.nextUrl.searchParams.get("slug")?.trim();
	if (!slug) {
		return NextResponse.json({ error: "slug is required" }, { status: 400 });
	}

	const supabase = createServiceClient();

	const { data: ring, error } = await supabase
		.from("engagement_rings")
		.select("*, engagement_ring_specs(*)")
		.eq("slug", slug)
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ data: ring });
}

export async function PATCH(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { slug, specs, ...ringData } = body;

	if (!slug) {
		return NextResponse.json({ error: "slug is required" }, { status: 400 });
	}

	const supabase = createServiceClient();

	// Update ring main data
	const allowedFields = [
		"name", "title", "description", "base_price_usd", "currency",
		"shape", "setting_style", "band_type", "setting_profile", "is_active",
		"meta_title", "meta_description", "meta_keywords", "canonical_url",
		"og_title", "og_description", "og_image", "h1_override", "noindex", "nofollow",
	];

	const updateData: Record<string, unknown> = {};
	for (const key of allowedFields) {
		if (key in ringData) {
			updateData[key] = ringData[key];
		}
	}

	if (Object.keys(updateData).length > 0) {
		const { error } = await supabase
			.from("engagement_rings")
			.update(updateData)
			.eq("slug", slug);

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
	}

	// Update specs if provided
	if (specs && typeof specs === "object") {
		const { data: ring } = await supabase
			.from("engagement_rings")
			.select("id")
			.eq("slug", slug)
			.single();

		if (ring) {
			const specsData: Record<string, unknown> = { ring_id: ring.id };
			const allowedSpecs = [
				"band_width", "center_stone_size", "estimated_weight",
				"avg_side_stones", "claws_count", "resizable",
			];
			for (const key of allowedSpecs) {
				if (key in specs) {
					specsData[key] = specs[key];
				}
			}

			const { error: specsError } = await supabase
				.from("engagement_ring_specs")
				.upsert(specsData, { onConflict: "ring_id" });

			if (specsError) {
				return NextResponse.json({ error: specsError.message }, { status: 500 });
			}
		}
	}

	return NextResponse.json({ success: true });
}
