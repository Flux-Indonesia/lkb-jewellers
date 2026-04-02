import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/orders-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["shipping_details"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email || null,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipping = (session as any).shipping_details as { address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } | undefined;

    await fulfillOrder({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      customer_details: session.customer_details,
      shipping_details: shipping,
    });

    return NextResponse.json({
      status: "paid",
      customerEmail: session.customer_details?.email || null,
    });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
