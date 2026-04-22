import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendEnquiryConfirmation, notifyAdminEnquiry } from "@/lib/email";

const GHL_RING_WEBHOOK_URL = process.env.GHL_RING_WEBHOOK_URL || "https://services.leadconnectorhq.com/hooks/uQOTLWm2nM7tGBm8XYTA/webhook-trigger/6101b4b6-7a2a-4df0-9017-fe96456456d2";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const {
			fullName, email, phone, contactMethod, message,
			visitedOthers, otherDealerName, otherDealerPrice, optOutNewsletter,
			ringId, ringName, ringPrice, ringImage,
			ringMetal, ringSideStones, ringSetting, ringSize,
			ringShape, ringSettingStyle, ringBandType,
			ringStoneType, ringClarity, ringCaratRange, ringColour, ringCertificate,
		} = body;

		const preferredContactMethods = Array.isArray(contactMethod)
			? contactMethod.filter(Boolean).join(", ")
			: typeof contactMethod === "string" ? contactMethod.trim() : "call";

		if (!fullName || !email || !phone) {
			return NextResponse.json({ error: "Full name, email, and phone are required" }, { status: 400 });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from("contacts")
			.insert([{
				first_name: fullName,
				last_name: "",
				email: email.trim(),
				phone: phone.trim(),
				interest: "Engagement Ring Enquiry",
				message: message || "",
				preferred_contact_method: preferredContactMethods || "call",
				notes: "",
				product_id: ringId || "",
				product_name: ringName || "",
				product_price: ringPrice || 0,
				product_category: "engagement-rings",
				product_image: ringImage || "",
				product_brand: "LKB Jewellers",
				visited_other_dealers: Boolean(visitedOthers),
				other_dealer_name: visitedOthers ? (otherDealerName || "") : "",
				other_dealer_price: visitedOthers ? (otherDealerPrice || "") : "",
				opted_out_newsletter: Boolean(optOutNewsletter),
				// Ring-specific columns
				ring_metal: ringMetal || "",
				ring_side_stones: ringSideStones || "",
				ring_setting: ringSetting || "",
				ring_size: ringSize || "",
				ring_shape: ringShape || "",
				ring_setting_style: ringSettingStyle || "",
				ring_band_type: ringBandType || "",
				ring_stone_type: ringStoneType || "",
				ring_clarity: ringClarity || "",
				ring_carat_range: ringCaratRange || "",
				ring_colour: ringColour || "",
				ring_certificate: ringCertificate || "",
				status: "new",
			}])
			.select()
			.single();

		if (error) {
			console.error("Supabase ring enquiry insert error:", error);
			return NextResponse.json({ error: error.message || "Failed to submit enquiry" }, { status: 500 });
		}

		if (!optOutNewsletter && email) {
			await supabase
				.from("newsletter")
				.upsert([{ email: email.trim().toLowerCase(), name: fullName }], { onConflict: "email" })
				.select();
		}

		const nameParts = (fullName as string).trim().split(" ");
		const firstName = nameParts[0] ?? fullName;
		const lastName = nameParts.slice(1).join(" ") || "";

		const ghlPayload = {
			firstName,
			lastName,
			email: email.trim(),
			phone: phone.trim(),
			message: message || "",
			source: "LKB Website Ring Enquiry",
			ring_name: ringName || "",
			ring_price: ringPrice || 0,
			ring_metal: ringMetal || "",
			ring_side_stones: ringSideStones || "",
			ring_setting: ringSetting || "",
			ring_size: ringSize || "",
			ring_shape: ringShape || "",
			ring_setting_style: ringSettingStyle || "",
			ring_band_type: ringBandType || "",
			ring_stone_type: ringStoneType || "",
			ring_clarity: ringClarity || "",
			ring_carat_range: ringCaratRange || "",
			ring_colour: ringColour || "",
			ring_certificate: ringCertificate || "",
			preferred_contact_method: preferredContactMethods || "",
			visited_other_dealers: Boolean(visitedOthers),
			other_dealer_name: visitedOthers ? (otherDealerName || "") : "",
			other_dealer_price: visitedOthers ? (otherDealerPrice || "") : "",
			opted_out_newsletter: Boolean(optOutNewsletter),
		};

		console.log("[GHL Ring] Sending webhook payload:", JSON.stringify(ghlPayload));

		Promise.allSettled([
			sendEnquiryConfirmation(email.trim(), fullName, ringName || "an engagement ring", ringPrice || 0),
			notifyAdminEnquiry(fullName, email.trim(), ringName || "Unknown", ringPrice || 0),
			...(GHL_RING_WEBHOOK_URL
				? [fetch(GHL_RING_WEBHOOK_URL, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(ghlPayload),
				})
					.then(async (res) => {
						const text = await res.text();
						console.log(`[GHL Ring] Response ${res.status}:`, text);
					})
					.catch((err) => console.error("[GHL Ring] Fetch error:", err))]
				: []),
		]).catch((err) => console.error("Ring enquiry post-submit error:", err));

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
