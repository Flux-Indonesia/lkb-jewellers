import { createClient } from "./supabase";

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  preferred_contact_method: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_category: string;
  product_image: string;
  status: "new" | "read" | "contacted" | "closed";
  notes: string;
  created_at: string;
  updated_at: string;
}

export async function getContacts(): Promise<Contact[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Contact[]) || [];
}

export async function createContact(
  contact: Partial<Contact>
): Promise<Contact> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .insert([contact])
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function updateContact(
  id: string,
  updates: Partial<Contact>
): Promise<Contact> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function deleteContact(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);

  if (error) throw error;
}
