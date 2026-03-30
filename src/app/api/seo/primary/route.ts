import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

function isAuthenticated(request: NextRequest): boolean {
	const cookieHeader = request.headers.get("cookie") || "";
	return cookieHeader.includes("admin_session=authenticated");
}

export async function GET(request: NextRequest) {
	try {
		if (!isAuthenticated(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = createClient();
		const { data, error } = await supabase
			.from("site_settings")
			.select("*")
			.eq("id", "primary_seo")
			.single();

		if (error) {
			return NextResponse.json({ error: "Failed to fetch primary SEO" }, { status: 500 });
		}
		return NextResponse.json({ data });
	} catch (err) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		if (!isAuthenticated(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		const allowedFields = [
			"meta_title", "meta_title_template", "meta_description", "meta_keywords",
			"og_title", "og_description", "og_image",
			"twitter_title", "twitter_description", "twitter_image",
			"canonical_url", "noindex", "nofollow",
		];

		const updateData: Record<string, unknown> = {};
		for (const key of allowedFields) {
			if (key in body) updateData[key] = body[key];
		}
		updateData.updated_at = new Date().toISOString();

		const supabase = createClient();
		const { error } = await supabase
			.from("site_settings")
			.update(updateData)
			.eq("id", "primary_seo");

		if (error) {
			return NextResponse.json({ error: "Failed to update primary SEO" }, { status: 500 });
		}
		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
