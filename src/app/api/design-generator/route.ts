import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, phone, prompt } = body;

		if (!name || !email || !phone) {
			return NextResponse.json(
				{ error: "Name, email, and phone are required" },
				{ status: 400 }
			);
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 }
			);
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from("design_generator_leads")
			.insert([{
				name: name.trim(),
				email: email.trim().toLowerCase(),
				phone: phone.trim(),
				prompt: prompt?.trim() || null,
				status: "new",
			}])
			.select()
			.single();

		if (error) {
			console.error("Design generator lead insert error:", error);
			return NextResponse.json(
				{ error: error.message || "Failed to save your details" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true, id: data.id });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
