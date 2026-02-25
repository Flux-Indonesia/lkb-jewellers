import { createClient } from "./supabase";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "paid"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  delivery_type: string;
  delivery_notes: string;
  items: OrderItem[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Order[]) || [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Order;
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw error;
}
