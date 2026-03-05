import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

type RingImage = {
  image_url: string | null
  _order: number | null
}

type RingRecord = {
  slug: string
  name: string
  engagement_ring_images: RingImage[] | null
}

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  return cookieHeader.includes('admin_session=authenticated')
}

function extractColorFromImageUrl(url: string): string | null {
  const match = url.match(/\/([a-z]+)_\d+\.jpg(?:\?|$)/i)
  if (!match) return null
  return match[1].toLowerCase()
}

function groupImagesByColor(images: RingImage[]) {
  return images.reduce<Record<string, string[]>>((acc, image) => {
    if (!image.image_url) return acc

    const color = extractColorFromImageUrl(image.image_url)
    if (!color) return acc

    if (!acc[color]) {
      acc[color] = []
    }

    acc[color].push(image.image_url)
    return acc
  }, {})
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('engagement_rings')
    .select('slug,name,engagement_ring_images(image_url,_order)')
    .order('slug', { ascending: true })
    .order('_order', { ascending: true, foreignTable: 'engagement_ring_images' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const mapped = ((data ?? []) as RingRecord[]).map(ring => ({
    slug: ring.slug,
    name: ring.name,
    images: groupImagesByColor(ring.engagement_ring_images ?? []),
  }))

  return NextResponse.json({ data: mapped })
}
