import { createClient } from "./supabase";

export interface SellSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_international: boolean;
  country: string;
  brand: string;
  model: string;
  reference_number: string;
  year_of_manufacture: string;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  has_box: boolean;
  has_papers: boolean;
  additional_info: string;
  images: string[];
  visited_others: boolean;
  best_offer: string;
  jeweller_name: string;
  offer_amount: number;
  notes: string;
  status:
    | "new"
    | "reviewing"
    | "offer-sent"
    | "accepted"
    | "completed"
    | "declined";
  created_at: string;
  updated_at: string;
}

export async function getSellSubmissions(): Promise<SellSubmission[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sell_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SellSubmission[]) || [];
}

export async function createSellSubmission(
  submission: Partial<SellSubmission>
): Promise<SellSubmission> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sell_submissions")
    .insert([submission])
    .select()
    .single();

  if (error) throw error;
  return data as SellSubmission;
}

export async function updateSellSubmission(
  id: string,
  updates: Partial<SellSubmission>
): Promise<SellSubmission> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sell_submissions")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as SellSubmission;
}

export async function deleteSellSubmission(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("sell_submissions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
