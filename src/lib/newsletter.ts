import { createClient } from "./supabase";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  subscribed: boolean;
  created_at: string;
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("newsletter")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as NewsletterSubscriber[]) || [];
}

export async function addSubscriber(
  email: string,
  name?: string
): Promise<NewsletterSubscriber> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("newsletter")
    .upsert([{ email, name: name || "" }], { onConflict: "email" })
    .select()
    .single();

  if (error) throw error;
  return data as NewsletterSubscriber;
}

export async function removeSubscriber(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("newsletter").delete().eq("id", id);

  if (error) throw error;
}

export async function unsubscribe(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("newsletter")
    .update({ subscribed: false })
    .eq("id", id);

  if (error) throw error;
}
