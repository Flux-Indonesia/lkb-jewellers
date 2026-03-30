import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from "@/lib/admin-auth"
import { createClient } from '@/lib/supabase'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

type PreferenceRow = {
  ring_slug: string
  color: string
  thumbnail_url: string | null
  hover_url: string | null
}



/** Service-role client for write operations (RLS bypass) */
function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function formatPreferences(rows: PreferenceRow[]) {
  return rows.reduce<Record<string, Record<string, { thumbnail_url: string | null; hover_url: string | null }>>>(
    (acc, row) => {
      if (!acc[row.ring_slug]) {
        acc[row.ring_slug] = {}
      }

      acc[row.ring_slug][row.color] = {
        thumbnail_url: row.thumbnail_url,
        hover_url: row.hover_url,
      }

      return acc
    },
    {}
  )
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const slug = request.nextUrl.searchParams.get('slug')

  const query = supabase
    .from('ring_image_preferences')
    .select('ring_slug,color,thumbnail_url,hover_url')
    .order('ring_slug', { ascending: true })
    .order('color', { ascending: true })

  const { data, error } = slug ? await query.eq('ring_slug', slug) : await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const grouped = formatPreferences((data ?? []) as PreferenceRow[])

  if (slug) {
    return NextResponse.json({ data: grouped[slug] ?? {} })
  }

  return NextResponse.json({ data: grouped })
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
  const color = typeof body?.color === 'string' ? body.color.trim() : ''
  const thumbnail_url = typeof body?.thumbnail_url === 'string' ? body.thumbnail_url.trim() : null
  const hover_url = typeof body?.hover_url === 'string' ? body.hover_url.trim() : null

  if (!slug || !color) {
    return NextResponse.json({ error: 'slug and color are required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase.from('ring_image_preferences').upsert(
    {
      ring_slug: slug,
      color,
      thumbnail_url,
      hover_url,
    },
    { onConflict: 'ring_slug,color' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = request.nextUrl.searchParams.get('slug')?.trim() || ''
  const color = request.nextUrl.searchParams.get('color')?.trim() || ''

  if (!slug || !color) {
    return NextResponse.json({ error: 'slug and color are required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('ring_image_preferences')
    .delete()
    .eq('ring_slug', slug)
    .eq('color', color)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
