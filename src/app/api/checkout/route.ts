import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const ALLOWED_ORIGINS = [
  "https://www.lkbjewellers.com",
  "https://lkbjewellers.com",
  "https://lkb-jewellers.vercel.app",
  "http://localhost:3000",
];

interface CartItem {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  // CSRF: check origin
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { items } = body as { items: CartItem[] };

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
      .select("id, name, price, image, stock")
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

    // Verify all items exist and have valid prices
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const product = productMap.get(item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.id}` },
          { status: 400 }
        );
      }

      const price = Number(product.price);
      if (!price || price <= 0) {
        return NextResponse.json(
          { error: `${product.name} is not available for purchase` },
          { status: 400 }
        );
      }

      // Check stock availability
      if (typeof product.stock === "number" && product.stock < item.quantity) {
        return NextResponse.json(
          { error: product.stock === 0 ? `${product.name} is out of stock` : `Only ${product.stock} of ${product.name} available` },
          { status: 400 }
        );
      }

      // Sanitize product name (max 250 chars for Stripe)
      const name = String(product.name).slice(0, 250);

      // Validate image URL if present
      let images: string[] = [];
      if (product.image && typeof product.image === "string") {
        try {
          const url = new URL(product.image);
          if (url.protocol === "https:") {
            images = [product.image];
          }
        } catch {
          // Skip invalid image URLs
        }
      }

      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: { name, images },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.lkbjewellers.com";

    // Build order items metadata for saving after payment
    const orderItems = items.map((item: CartItem) => {
      const product = productMap.get(item.id);
      return {
        id: item.id,
        name: product?.name || item.id,
        price: Number(product?.price) || 0,
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "AE", "SA", "QA", "KW", "BH", "OM"],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        order_items: JSON.stringify(orderItems),
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
