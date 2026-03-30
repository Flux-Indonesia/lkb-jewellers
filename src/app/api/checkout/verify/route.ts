import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email || null,
      });
    }

    // Save order to Supabase (idempotent — skip if already exists)
    const supabase = createServiceClient();
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_intent_id", sessionId)
      .single();

    if (!existing) {
      let items: { id: string; name: string; price: number; quantity: number }[] = [];
      try {
        items = JSON.parse(session.metadata?.order_items || "[]");
      } catch {
        items = [];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shipping = (session as any).shipping_details as { address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } | undefined;
      const customer = session.customer_details;

      await supabase.from("orders").insert({
        payment_intent_id: sessionId,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || "gbp",
        status: "paid",
        customer_email: customer?.email || "",
        customer_first_name: customer?.name?.split(" ")[0] || "",
        customer_last_name: customer?.name?.split(" ").slice(1).join(" ") || "",
        customer_phone: customer?.phone || "",
        address_line1: shipping?.address?.line1 || "",
        address_line2: shipping?.address?.line2 || "",
        city: shipping?.address?.city || "",
        state: shipping?.address?.state || "",
        postal_code: shipping?.address?.postal_code || "",
        country: shipping?.address?.country || "",
        items,
      });
    }

    return NextResponse.json({
      status: "paid",
      customerEmail: session.customer_details?.email || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
