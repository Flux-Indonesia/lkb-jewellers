import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { sendContactConfirmation, notifyAdminContact } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, interest, message } = body;

    if (!firstName || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contacts").insert([{
      first_name: firstName,
      last_name: lastName || "",
      email: email.trim(),
      phone: phone || "",
      interest: interest || "",
      message: message || "",
      preferred_contact_method: "email",
      status: "new",
    }]);

    if (error) {
      console.error("Contact insert error:", error);
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }

    // Send emails (non-blocking)
    const name = [firstName, lastName].filter(Boolean).join(" ");
    Promise.allSettled([
      sendContactConfirmation(email.trim(), name),
      notifyAdminContact(name, email.trim(), interest || "General", message || ""),
    ]).catch((err) => console.error("Contact email error:", err));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
