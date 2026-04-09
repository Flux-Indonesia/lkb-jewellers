import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase";
import { buildCheckoutPricing, type CheckoutProductRecord } from "@/lib/checkout-pricing";
import {
  WORLDWIDE_ALLOWED_COUNTRIES,
  isAllowedShippingCountry,
} from "@/lib/shipping";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const ALLOWED_ORIGINS = [
  "https://www.lkbjewellers.com",
  "https://lkbjewellers.com",
  "https://lkb-jewellers.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

interface CartItem {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  // CSRF: check origin
  const origin = req.headers.get("origin");
  const isAllowed = !origin ||
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".vercel.app");
  if (!isAllowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { items, shipping_country } = body as {
      items: CartItem[];
      shipping_country?: string;
    };

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (items.length > 50) {
      return NextResponse.json({ error: "Too many items" }, { status: 400 });
    }

    // Validate each item has id and valid quantity
    for (const item of items) {
      if (!item.id || typeof item.id !== "string") {
        return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
      }
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 }
        );
      }
    }

    // Server-side price lookup from database
    const supabase = createClient();
    const productIds = items.map((i) => i.id);
    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, name, price, image, stock, category, tags")
      .in("id", productIds);

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    // Build a lookup map
    const productMap = new Map(
      (products || []).map((p) => [p.id, p])
    );

    const host = req.headers.get("host") || "www.lkbjewellers.com";
    const proto = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${proto}://${host}`;
    const normalizedShippingCountry = shipping_country?.trim().toUpperCase() || null;

    if (normalizedShippingCountry && !isAllowedShippingCountry(normalizedShippingCountry)) {
      return NextResponse.json({ error: "Invalid shipping country" }, { status: 400 });
    }

    const pricing = buildCheckoutPricing(
      items,
      productMap as Map<string, CheckoutProductRecord>,
      normalizedShippingCountry
    );

    if (pricing.shippingCountryRequired && !pricing.selectedShippingCountry) {
      return NextResponse.json(
        { error: "Shipping country is required for hat orders" },
        { status: 400 }
      );
    }

    const lineItems = [...pricing.lineItems];
    if (pricing.postageGbp > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: pricing.selectedShippingCountry === "GB" ? "UK hat postage" : "International hat postage",
          },
          unit_amount: Math.round(pricing.postageGbp * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: pricing.selectedShippingCountry
          ? [pricing.selectedShippingCountry] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
          : [...WORLDWIDE_ALLOWED_COUNTRIES] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        order_items: JSON.stringify(pricing.orderItems),
        hat_shipping_required: String(pricing.hatShippingRequired),
        subtotal_gbp: String(pricing.subtotalGbp),
        shipping_country: pricing.selectedShippingCountry || "",
        postage_gbp: String(pricing.postageGbp),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
