import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { RecommendedGemstone } from '@/data/gemstone-options'
import type { Ring, RingSpecs } from '@/data/engagement-rings'
import { createClient } from '@/lib/supabase-server'

type OrderedRow = { _order: number | null }

function sortByOrder<T extends OrderedRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a._order ?? 0) - (b._order ?? 0))
}

/**
 * Convert Supabase storage URL ke Image Transform URL untuk thumbnail.
 * Serve gambar width px, quality 75 — jauh lebih kecil dari full-res.
 * https://supabase.com/docs/guides/storage/serving/image-transformations
 */
function toThumbnailUrl(url: string, width = 640, quality = 75): string {
  if (!url.includes('/storage/v1/object/public/')) return url
  return (
    url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') +
    `?width=${width}&quality=${quality}&resize=contain`
  )
}

function mapToRing(
  row: any,
  images: any[],
  metals: any[],
  settings: any[],
  sideStones: any[],
  sizes: any[],
  specs: any
): Ring {
  const orderedImages = sortByOrder(images)
  const orderedMetals = sortByOrder(metals)
  const orderedSettings = sortByOrder(settings)
  const orderedSideStones = sortByOrder(sideStones)
  const orderedSizes = sortByOrder(sizes)

  const mappedSpecs: RingSpecs = specs
    ? {
        avgSideStones: specs.avg_side_stones ?? undefined,
        bandWidth: specs.band_width ?? undefined,
        centerStoneSize: specs.center_stone_size ?? undefined,
        clawCount: specs.claw_count ?? undefined,
        estimatedWeight: specs.estimated_weight ?? undefined,
        resizing: specs.resizable === true ? 'Complimentary' : undefined,
      }
    : {}

  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    title: row.title,
    description: row.description ?? '',
    basePrice: Number(row.base_price_usd),
    currency: row.currency ?? 'USD',
    images: orderedImages.map(image => image.image_url),
    thumbnails: orderedImages.map(image => image.image_url),
    metalOptions: orderedMetals.map(metal => metal.label),
    settingOptions: orderedSettings.map(setting => setting.label),
    sideStonesOptions: orderedSideStones.map(sideStone => sideStone.label),
    ringSizes: orderedSizes.map(size => size.size),
    specs: mappedSpecs,
    shape: row.shape,
    settingStyle: row.setting_style,
    bandType: row.band_type,
    settingProfile: row.setting_profile,
  }
}

const ringRelations = `
  *,
  engagement_ring_images(*),
  engagement_ring_metal_options(*),
  engagement_ring_setting_options(*),
  engagement_ring_side_stone_options(*),
  engagement_ring_sizes(*),
  engagement_ring_specs!ring_id(*)
`

async function getSupabaseClient() {
  try {
    return await createClient()
  } catch {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )
  }
}

export async function fetchAllRings(): Promise<Ring[]> {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('engagement_rings')
    .select(ringRelations)
    .eq('is_active', true)
    .order('slug')

  if (error || !data) {
    return []
  }

  return data.map(row =>
    mapToRing(
      row,
      row.engagement_ring_images ?? [],
      row.engagement_ring_metal_options ?? [],
      row.engagement_ring_setting_options ?? [],
      row.engagement_ring_side_stone_options ?? [],
      row.engagement_ring_sizes ?? [],
      Array.isArray(row.engagement_ring_specs) ? row.engagement_ring_specs[0] ?? null : row.engagement_ring_specs ?? null
    )
  )
}

export async function fetchRingBySlug(slug: string): Promise<Ring | null> {
  const supabase = await getSupabaseClient()

  const { data, error } = await supabase
    .from('engagement_rings')
    .select(ringRelations)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return mapToRing(
    data,
    data.engagement_ring_images ?? [],
    data.engagement_ring_metal_options ?? [],
    data.engagement_ring_setting_options ?? [],
    data.engagement_ring_side_stone_options ?? [],
    data.engagement_ring_sizes ?? [],
    Array.isArray(data.engagement_ring_specs) ? data.engagement_ring_specs[0] ?? null : data.engagement_ring_specs ?? null
  )
}

export async function fetchAllSlugs(): Promise<string[]> {
  const supabase = await getSupabaseClient()
  const { data } = await supabase
    .from('engagement_rings')
    .select('slug')
    .eq('is_active', true)

  return (data ?? []).map(row => row.slug)
}

export async function fetchGemstones(): Promise<RecommendedGemstone[]> {
  const supabase = await getSupabaseClient()
  const { data } = await supabase
    .from('gemstones')
    .select('*')
    .eq('is_active', true)

  return (data ?? []).map(gemstone => ({
    id: gemstone.id,
    type: gemstone.stone_type,
    carat: gemstone.carat,
    clarity: gemstone.clarity,
    colour: gemstone.colour,
    dimensions: gemstone.dimensions ?? '',
    price: Number(gemstone.price_usd),
    currency: 'USD',
    imageUrl: gemstone.image_url,
  }))
}
