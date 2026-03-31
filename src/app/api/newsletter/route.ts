import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendNewsletterWelcome } from "@/lib/email";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const trimmed = email.trim().toLowerCase();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
			return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
		}

		const supabase = await createClient();
		const { data, error } = await supabase
			.from("newsletter")
			.upsert([{ email: trimmed, name: "" }], { onConflict: "email" })
			.select()
			.single();

		if (error) {
			console.error("Supabase newsletter upsert error:", error);
			return NextResponse.json({ error: error.message || "Failed to subscribe" }, { status: 500 });
		}

		// Send welcome email (non-blocking)
		sendNewsletterWelcome(trimmed).catch((err) => console.error("Newsletter email error:", err));

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
