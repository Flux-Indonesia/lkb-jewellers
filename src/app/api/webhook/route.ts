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
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shipping = (session as any).shipping_details as { address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } | undefined;

      try {
        await fulfillOrder({
          id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          metadata: session.metadata,
          customer_details: session.customer_details,
          shipping_details: shipping,
        });
      } catch (err) {
        console.error("Webhook fulfillOrder error:", err);
        return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
