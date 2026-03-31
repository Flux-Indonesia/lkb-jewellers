import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

interface CartItemPayload {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

function normalizeItems(items: unknown): CartItemPayload[] | null {
  if (!Array.isArray(items)) return null;

  const normalized = items
    .filter((item): item is CartItemPayload => {
      return (
        !!item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        typeof item.image === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    })
    .map((item) => ({
      id: item.id,
      name: item.name.slice(0, 250),
      price: Math.max(0, item.price),
      image: item.image,
      quantity: Math.min(item.quantity, 99),
    }));

  return normalized;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, name, price, image, quantity")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data || []).map((item) => ({
    id: item.product_id,
    name: item.name,
    price: Number(item.price) || 0,
    image: item.image,
    quantity: item.quantity,
  }));

  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const items = normalizeItems(body.items);

  if (!items) {
    return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  if (items.length > 0) {
    const { error: insertError } = await supabase.from("cart_items").insert(
      items.map((item) => ({
        user_id: user.id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }))
    );

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
