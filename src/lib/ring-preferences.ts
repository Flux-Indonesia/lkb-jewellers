import { createClient } from "@/lib/supabase"

export type RingColorPreference = {
  thumbnail_url: string | null
  hover_url: string | null
}

// Map: { [ring_slug]: { [color]: RingColorPreference } }
export type RingPreferencesMap = Record<string, Record<string, RingColorPreference>>

type PreferenceRow = {
  ring_slug: string
  color: string
  thumbnail_url: string | null
  hover_url: string | null
}

// Get preferences for a single ring slug
// Returns null if no preferences found
export async function getRingPreferences(
  slug: string
): Promise<Record<string, RingColorPreference> | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ring_image_preferences")
    .select("ring_slug,color,thumbnail_url,hover_url")
    .eq("ring_slug", slug)
  if (error) throw error
  if (!data || data.length === 0) return null
  return (data as PreferenceRow[]).reduce<Record<string, RingColorPreference>>((acc, row) => {
    acc[row.color] = { thumbnail_url: row.thumbnail_url, hover_url: row.hover_url }
    return acc
  }, {})
}

// Get all ring preferences as a nested map
export async function getAllRingPreferences(): Promise<RingPreferencesMap> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("ring_image_preferences")
    .select("ring_slug,color,thumbnail_url,hover_url")
    .order("ring_slug", { ascending: true })
    .order("color", { ascending: true })
  if (error) throw error
  return ((data ?? []) as PreferenceRow[]).reduce<RingPreferencesMap>((acc, row) => {
    if (!acc[row.ring_slug]) acc[row.ring_slug] = {}
    acc[row.ring_slug][row.color] = {
      thumbnail_url: row.thumbnail_url,
      hover_url: row.hover_url,
    }
    return acc
  }, {})
}

// Upsert (insert or update) a preference for a ring+color combination
export async function upsertRingPreference(
  slug: string,
  color: string,
  thumbnailUrl: string | null,
  hoverUrl: string | null
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("ring_image_preferences").upsert(
    {
      ring_slug: slug,
      color,
      thumbnail_url: thumbnailUrl,
      hover_url: hoverUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ring_slug,color" }
  )
  if (error) throw error
}

// Delete a preference for a ring+color combination
export async function deleteRingPreference(slug: string, color: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from("ring_image_preferences")
    .delete()
    .eq("ring_slug", slug)
    .eq("color", color)
  if (error) throw error
}
