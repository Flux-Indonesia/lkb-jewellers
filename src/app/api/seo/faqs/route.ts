import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function isAuthenticated(request: NextRequest): boolean {
	const cookieHeader = request.headers.get("cookie") || "";
	return cookieHeader.includes("admin_session=authenticated");
}

function createServiceClient() {
	return createSupabaseClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)!
	);
}

export async function GET(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const productId = request.nextUrl.searchParams.get("product_id");
	const productType = request.nextUrl.searchParams.get("product_type") || "product";
	const supabase = createServiceClient();

	let query = supabase
		.from("product_faqs")
		.select("*")
		.order("sort_order", { ascending: true });

	if (productId) {
		query = query.eq("product_id", productId).eq("product_type", productType);
	}

	const { data, error } = await query;
	if (error) return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
	return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { product_id, product_type = "product", question, answer, sort_order = 0 } = body;

	if (!product_id || !question || !answer) {
		return NextResponse.json({ error: "product_id, question, and answer are required" }, { status: 400 });
	}

	const supabase = createServiceClient();
	const { data, error } = await supabase
		.from("product_faqs")
		.insert({ product_id, product_type, question, answer, sort_order })
		.select()
		.single();

	if (error) return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
	return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { id, ...rawData } = body;

	if (!id) {
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	}

	const allowedFields = ["question", "answer", "sort_order", "is_active"];
	const updateData: Record<string, unknown> = {};
	for (const key of allowedFields) {
		if (key in rawData) updateData[key] = rawData[key];
	}
	updateData.updated_at = new Date().toISOString();

	const supabase = createServiceClient();
	const { error } = await supabase
		.from("product_faqs")
		.update(updateData)
		.eq("id", id);

	if (error) return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
	return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = request.nextUrl.searchParams.get("id");
	if (!id) {
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	}

	const supabase = createServiceClient();
	const { error } = await supabase
		.from("product_faqs")
		.delete()
		.eq("id", id);

	if (error) return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
	return NextResponse.json({ success: true });
}
