import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

type RingRow = {
  id: string
}

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  return cookieHeader.includes('admin_session=authenticated')
}

function extractImageNumber(imageUrl: string, color: string): number {
  const escapedColor = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`${escapedColor}_(\\d+)\\.jpg`, 'i')
  const match = imageUrl.match(pattern)
  if (!match) return 0

  return Number(match[1]) || 0
}

function createStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured')
  }

  if (!serviceRoleKey && !anonKey) {
    throw new Error('SUPABASE keys are not configured')
  }

  if (!serviceRoleKey && anonKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing, using anon key fallback for rings image route')
  }

  return createSupabaseClient(url, serviceRoleKey ?? anonKey!)
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const slug = String(formData.get('slug') ?? '').trim()
    const color = String(formData.get('color') ?? '').trim().toLowerCase()

    if (!(file instanceof File) || !slug || !color) {
      return NextResponse.json({ error: 'file, slug, and color are required' }, { status: 400 })
    }

    const supabase = createStorageClient()

    const { data: ring, error: ringError } = await supabase
      .from('engagement_rings')
      .select('id')
      .eq('slug', slug)
      .single<RingRow>()

    if (ringError || !ring) {
      return NextResponse.json({ error: ringError?.message ?? 'Ring not found' }, { status: 404 })
    }

    const { data: existingImages, error: existingImagesError } = await supabase
      .from('engagement_ring_images')
      .select('image_url')
      .eq('_parent_id', ring.id)
      .ilike('image_url', `%/${color}_%`)

    if (existingImagesError) {
      return NextResponse.json({ error: existingImagesError.message }, { status: 500 })
    }

    const maxNumber = (existingImages ?? []).reduce((currentMax, row) => {
      const imageUrl = row.image_url ?? ''
      const number = extractImageNumber(imageUrl, color)
      return Math.max(currentMax, number)
    }, 0)

    const nextNumber = maxNumber + 1
    const slugWithoutPrefix = slug.replace(/^ring-/, '')
    const path = `rings/${slugWithoutPrefix}/${color}_${nextNumber}.jpg`

    const fileBuffer = new Uint8Array(await file.arrayBuffer())
    const contentType = file.type || 'image/jpeg'

    const { error: uploadError } = await supabase.storage
      .from('engagement-rings')
      .upload(path, fileBuffer, { contentType, upsert: false })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('engagement-rings').getPublicUrl(path)

    const { error: insertError } = await supabase.from('engagement_ring_images').insert({
      _parent_id: ring.id,
      image_url: publicUrl,
      _order: nextNumber,
    })

    if (insertError) {
      await supabase.storage.from('engagement-rings').remove([path])
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ url: publicUrl, path })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const path = request.nextUrl.searchParams.get('path')?.trim() || ''

    if (!path) {
      return NextResponse.json({ error: 'path is required' }, { status: 400 })
    }

    if (!path.startsWith('rings/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const supabase = createStorageClient()

    const { error: removeError } = await supabase.storage.from('engagement-rings').remove([path])
    if (removeError) {
      return NextResponse.json({ error: removeError.message }, { status: 500 })
    }

    const { error: deleteError } = await supabase
      .from('engagement_ring_images')
      .delete()
      .ilike('image_url', `%${path}%`)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete image' },
      { status: 500 }
    )
  }
}
