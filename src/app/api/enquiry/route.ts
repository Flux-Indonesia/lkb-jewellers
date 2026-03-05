import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { fullName, email, phone, contactMethod, message, visitedOthers, optOutNewsletter, productId, productName, productPrice, productCategory, productImage } = body;

		if (!fullName || !email || !phone) {
			return NextResponse.json({ error: "Full name, email, and phone are required" }, { status: 400 });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
		}

		const supabase = await createClient();

		// Save enquiry to contacts table
		const { data, error } = await supabase
			.from("contacts")
			.insert([{
				first_name: fullName,
				last_name: "",
				email: email.trim(),
				phone: phone.trim(),
				interest: "Product Enquiry",
				message: message || "",
				preferred_contact_method: contactMethod || "call",
				product_id: productId || "",
				product_name: productName || "",
				product_price: productPrice || 0,
				product_category: productCategory || "",
				product_image: productImage || "",
				status: "new",
			}])
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
		}

		// If user didn't opt out, subscribe to newsletter
		if (!optOutNewsletter && email) {
			await supabase
				.from("newsletter")
				.upsert([{ email: email.trim().toLowerCase(), name: fullName }], { onConflict: "email" })
				.select();
		}

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
