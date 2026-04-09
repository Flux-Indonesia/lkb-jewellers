import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { buildCheckoutPricing, type CheckoutItemInput, type CheckoutProductRecord } from "@/lib/checkout-pricing";
import {
  HAT_INTERNATIONAL_POSTAGE_FEE_GBP,
  HAT_UK_POSTAGE_FEE_GBP,
  isAllowedShippingCountry,
} from "@/lib/shipping";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping_country } = body as {
      items: CheckoutItemInput[];
      shipping_country?: string;
    };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (items.length > 50) {
      return NextResponse.json({ error: "Too many items" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.id || typeof item.id !== "string") {
        return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }
    }

    const supabase = createClient();
    const productIds = items.map((i) => i.id);
    const { data: products, error } = await supabase
      .from("products")
      .select("id, name, price, image, stock, category, tags")
      .in("id", productIds);

    if (error) {
      return NextResponse.json({ error: "Failed to verify products" }, { status: 500 });
    }

    const productMap = new Map(
      ((products || []) as CheckoutProductRecord[]).map((product) => [product.id, product])
    );

    const normalizedShippingCountry = shipping_country?.trim().toUpperCase() || null;

    if (normalizedShippingCountry && !isAllowedShippingCountry(normalizedShippingCountry)) {
      return NextResponse.json({ error: "Invalid shipping country" }, { status: 400 });
    }

    const pricing = buildCheckoutPricing(items, productMap, normalizedShippingCountry);

    return NextResponse.json({
      subtotal_gbp: pricing.subtotalGbp,
      shipping_required: pricing.hatShippingRequired,
      shipping_country_required: pricing.shippingCountryRequired,
      shipping_country: pricing.selectedShippingCountry,
      shipping: pricing.hatShippingRequired && pricing.selectedShippingCountry
        ? {
          amount_gbp: pricing.postageGbp,
          label: pricing.selectedShippingCountry === "GB" ? "UK hat postage" : "International hat postage",
          uk_gbp: HAT_UK_POSTAGE_FEE_GBP,
          international_gbp: HAT_INTERNATIONAL_POSTAGE_FEE_GBP,
        }
        : null,
      total_gbp: pricing.subtotalGbp + pricing.postageGbp,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to calculate quote";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
