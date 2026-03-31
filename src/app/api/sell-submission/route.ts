import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendSellSubmissionConfirmation, notifyAdminSellSubmission } from "@/lib/email";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { fullName, email, phone, brand, model, referenceNumber, yearOfManufacture, condition, hasBox, hasPapers, additionalInfo, images, isInternational, visitedOthers } = body;

		if (!fullName || !email || !phone || !brand || !model) {
			return NextResponse.json({ error: "Full name, email, phone, brand, and model are required" }, { status: 400 });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
		}

		const supabase = await createClient();

		const { data, error } = await supabase
			.from("sell_submissions")
			.insert([{
				full_name: fullName,
				email: email.trim(),
				phone: phone.trim(),
				brand,
				model,
				reference_number: referenceNumber || "",
				year_of_manufacture: yearOfManufacture || "",
				condition: condition || "Good",
				has_box: hasBox ?? false,
				has_papers: hasPapers ?? false,
				additional_info: additionalInfo || "",
				images: images || [],
				is_international: isInternational ?? false,
				visited_others: visitedOthers ?? false,
				status: "new",
			}])
			.select()
			.single();

		if (error) {
			console.error("Supabase sell_submissions insert error:", error);
			return NextResponse.json({ error: error.message || "Failed to submit" }, { status: 500 });
		}

		// Send emails (non-blocking)
		Promise.allSettled([
			sendSellSubmissionConfirmation(email.trim(), fullName, brand, model),
			notifyAdminSellSubmission(fullName, email.trim(), brand, model),
		]).catch((err) => console.error("Sell submission email error:", err));

		return NextResponse.json({ success: true, data });
	} catch {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
