import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation, notifyAdminOrder } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
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

    // Save order to Supabase (idempotent via upsert on payment_intent_id)
    const supabase = createServiceClient();

    let items: { id: string; name: string; price: number; quantity: number }[] = [];
    try {
      items = JSON.parse(session.metadata?.order_items || "[]");
    } catch {
      items = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipping = (session as any).shipping_details as { address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } | undefined;
    const customer = session.customer_details;

    const amount = (session.amount_total || 0) / 100;
    const currency = session.currency || "gbp";
    const customerName = customer?.name || "";
    const customerEmail = customer?.email || "";

    // Upsert prevents race condition — duplicate insert becomes a no-op
    const { data: order } = await supabase.from("orders").upsert({
      payment_intent_id: sessionId,
      amount,
      currency,
      status: "paid",
      customer_email: customerEmail,
      customer_first_name: customerName.split(" ")[0] || "",
      customer_last_name: customerName.split(" ").slice(1).join(" ") || "",
      customer_phone: customer?.phone || "",
      address_line1: shipping?.address?.line1 || "",
      address_line2: shipping?.address?.line2 || "",
      city: shipping?.address?.city || "",
      state: shipping?.address?.state || "",
      postal_code: shipping?.address?.postal_code || "",
      country: shipping?.address?.country || "",
      items,
    }, { onConflict: "payment_intent_id", ignoreDuplicates: true }).select("id, created_at").single();

    // Only send emails for newly created orders (created within last 30 seconds)
    const isNewOrder = order && (Date.now() - new Date(order.created_at).getTime()) < 30_000;
    if (isNewOrder && customerEmail) {
      Promise.allSettled([
        sendOrderConfirmation(customerEmail, customerName, sessionId, amount, currency, items),
        notifyAdminOrder(customerName, customerEmail, amount, currency),
      ]).catch((err) => console.error("Order email error:", err));
    }

    // Decrement stock for each purchased item
    if (isNewOrder) {
      for (const item of items) {
        const { data: prod } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();
        if (prod && typeof prod.stock === "number") {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, prod.stock - item.quantity) })
            .eq("id", item.id);
        }
      }
    }

    return NextResponse.json({
      status: "paid",
      customerEmail: session.customer_details?.email || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
