import { createClient } from "@supabase/supabase-js";
import { sendOrderConfirmation, notifyAdminOrder, sendGuestAccountCreated } from "@/lib/email";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface OrderItems {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Create order from a paid Stripe session. Idempotent — safe to call multiple times.
 * Returns true if a new order was created, false if it already existed.
 */
export async function fulfillOrder(session: {
  id: string;
  payment_intent?: string | null;
  amount_total: number | null;
  currency: string | null;
  metadata: Record<string, string> | null;
  customer_details: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null } | null;
  } | null;
  shipping_details?: { name?: string | null; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } | null;
}): Promise<boolean> {
  const supabase = createServiceClient();

  let items: OrderItems[] = [];
  try {
    items = JSON.parse(session.metadata?.order_items || "[]");
  } catch {
    items = [];
  }

  const shipping = session.shipping_details;
  const customer = session.customer_details;
  const billing = customer?.address;

  const amount = (session.amount_total || 0) / 100;
  const currency = session.currency || "gbp";
  const billingName = customer?.name || "";
  const customerEmail = customer?.email || "";
  const shippingName = shipping?.name || billingName;

  // Upsert prevents race condition — duplicate insert becomes a no-op
  const { data: order } = await supabase.from("orders").upsert({
    payment_intent_id: (session.payment_intent as string) || session.id,
    amount,
    currency,
    status: "paid",
    customer_email: customerEmail,
    // Billing name (card holder)
    customer_first_name: billingName.split(" ")[0] || "",
    customer_last_name: billingName.split(" ").slice(1).join(" ") || "",
    customer_phone: customer?.phone || "",
    // Shipping address
    address_line1: shipping?.address?.line1 || "",
    address_line2: shipping?.address?.line2 || "",
    city: shipping?.address?.city || "",
    state: shipping?.address?.state || "",
    postal_code: shipping?.address?.postal_code || "",
    country: shipping?.address?.country || "",
    // Extra details: shipping name, billing address
    notes: JSON.stringify({
      shipping_name: shippingName,
      billing_name: billingName,
      billing_address: billing
        ? [billing.line1, billing.line2, billing.city, billing.state, billing.postal_code, billing.country].filter(Boolean).join(", ")
        : "",
    }),
    items,
  }, { onConflict: "payment_intent_id", ignoreDuplicates: true }).select("id, created_at").maybeSingle();

  // Check if this is a newly created order (created within last 60 seconds)
  const isNewOrder = order && (Date.now() - new Date(order.created_at).getTime()) < 60_000;

  if (isNewOrder) {
    // Auto-create guest account if email not already registered
    if (customerEmail) {
      try {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const alreadyExists = existingUsers?.users?.some((u) => u.email === customerEmail);
        if (!alreadyExists) {
          const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
          const { error: createErr } = await supabase.auth.admin.createUser({
            email: customerEmail,
            password: tempPassword,
            email_confirm: true,
            user_metadata: { full_name: billingName },
          });
          if (!createErr) {
            await sendGuestAccountCreated(customerEmail, billingName, tempPassword);
          }
        }
      } catch (err) {
        console.error("Guest account creation error:", err);
      }
    }

    // Send emails
    if (customerEmail) {
      await Promise.allSettled([
        sendOrderConfirmation(customerEmail, billingName, session.id, amount, currency, items),
        notifyAdminOrder(billingName, customerEmail, amount, currency),
      ]);
    }

    // Decrement stock
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

  return !!isNewOrder;
}
