import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrder } from "@/lib/orders-service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const eventSession = event.data.object as Stripe.Checkout.Session;
    if (eventSession.payment_status === "paid") {
      try {
        const session = await stripe.checkout.sessions.retrieve(eventSession.id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const s = session as any;
        const collected = s.collected_information || {};
        const shipping = collected.shipping_details || s.shipping_details;
        // customer_details may be on session or in collected_information
        const customer = session.customer_details || eventSession.customer_details;

        await fulfillOrder({
          id: session.id,
          payment_intent: session.payment_intent as string,
          amount_total: session.amount_total,
          currency: session.currency,
          metadata: session.metadata || eventSession.metadata,
          customer_details: customer,
          shipping_details: shipping,
        });
      } catch (err) {
        console.error("Webhook fulfillOrder error:", err instanceof Error ? err.message : err);
        return NextResponse.json({ error: "Fulfillment failed", detail: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
