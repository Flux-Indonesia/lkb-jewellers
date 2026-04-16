import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendEnquiryConfirmation, notifyAdminEnquiry } from "@/lib/email";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { fullName, email, phone, contactMethod, message, visitedOthers, optOutNewsletter, ringDetails, productId, productName, productPrice, productCategory, productImage } = body;
		const preferredContactMethods = Array.isArray(contactMethod)
			? contactMethod.filter(Boolean).join(", ")
			: typeof contactMethod === "string"
				? contactMethod.trim()
				: "call";
		const notes = ringDetails || visitedOthers !== undefined
			? JSON.stringify({
				ringDetails: ringDetails ?? null,
				visitedOthers: Boolean(visitedOthers),
			})
			: "";

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
				preferred_contact_method: preferredContactMethods || "call",
				notes,
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
			console.error("Supabase contacts insert error:", error);
			return NextResponse.json({ error: error.message || "Failed to submit enquiry" }, { status: 500 });
		}

		// If user didn't opt out, subscribe to newsletter
		if (!optOutNewsletter && email) {
			await supabase
				.from("newsletter")
				.upsert([{ email: email.trim().toLowerCase(), name: fullName }], { onConflict: "email" })
				.select();
		}

		// Send emails (non-blocking)
		Promise.allSettled([
			sendEnquiryConfirmation(email.trim(), fullName, productName || "a product", productPrice || 0),
			notifyAdminEnquiry(fullName, email.trim(), productName || "Unknown", productPrice || 0),
		]).catch((err) => console.error("Enquiry email error:", err));

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
