import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendEnquiryConfirmation, notifyAdminEnquiry } from "@/lib/email";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { fullName, email, phone, contactMethod, message, visitedOthers, otherDealerName, otherDealerPrice, optOutNewsletter, ringDetails, productId, productName, productPrice, productCategory, productImage, productBrand } = body;
		const preferredContactMethods = Array.isArray(contactMethod) ? contactMethod.filter(Boolean).join(", ") : typeof contactMethod === "string" ? contactMethod.trim() : "call";
		const notes = JSON.stringify({
				ringDetails: ringDetails ?? null,
				visitedOthers: Boolean(visitedOthers),
				otherDealerName: otherDealerName || "",
				otherDealerPrice: otherDealerPrice || "",
			});

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
			.insert([
				{
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
					product_brand: productBrand || "",
					visited_other_dealers: Boolean(visitedOthers),
					other_dealer_name: visitedOthers ? (otherDealerName || "") : "",
					other_dealer_price: visitedOthers ? (otherDealerPrice || "") : "",
					opted_out_newsletter: Boolean(optOutNewsletter),
					status: "new",
				},
			])
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

		// Send emails + CRM webhook (non-blocking)
		const nameParts = (fullName as string).trim().split(" ");
		const firstName = nameParts[0] ?? fullName;
		const lastName = nameParts.slice(1).join(" ") || "";

		const ghlPayload = {
			firstName,
			lastName,
			email: email.trim(),
			phone: phone.trim(),
			message: message || "",
			source: "LKB Website Enquiry",
			product_name: productName || "",
			product_category: productCategory || "",
			product_brand: productBrand || "",
			product_price: productPrice || 0,
			preferred_contact_method: preferredContactMethods || "",
			visited_other_dealers: Boolean(visitedOthers),
			other_dealer_name: otherDealerName || "",
			other_dealer_price: otherDealerPrice || "",
			opted_out_newsletter: Boolean(optOutNewsletter),
		};
		console.log("[GHL] Sending webhook payload:", JSON.stringify(ghlPayload));

		Promise.allSettled([
			sendEnquiryConfirmation(email.trim(), fullName, productName || "a product", productPrice || 0),
			notifyAdminEnquiry(fullName, email.trim(), productName || "Unknown", productPrice || 0),
			fetch("https://services.leadconnectorhq.com/hooks/uQOTLWm2nM7tGBm8XYTA/webhook-trigger/b9a14ac2-3915-4230-9d03-67c22f0d97b5", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(ghlPayload),
			})
				.then(async (res) => {
					const text = await res.text();
					console.log(`[GHL] Response ${res.status}:`, text);
				})
				.catch((err) => console.error("[GHL] Fetch error:", err)),
		]).catch((err) => console.error("Enquiry post-submit error:", err));

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
