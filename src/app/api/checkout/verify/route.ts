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
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        status: session.payment_status,
        customerEmail: session.customer_details?.email || null,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s = session as any;
    const shipping = s.collected_information?.shipping_details || s.shipping_details;

    await fulfillOrder({
      id: session.id,
      payment_intent: session.payment_intent as string,
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
