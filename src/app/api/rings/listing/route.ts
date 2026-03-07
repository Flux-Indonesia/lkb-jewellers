import { NextRequest, NextResponse } from 'next/server'
import { fetchRingsPaginated } from '@/lib/supabase-rings'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(48, Math.max(1, parseInt(searchParams.get('limit') ?? '24', 10)))

  const filters = {
    shape: searchParams.get('shape') ?? undefined,
    settingStyle: searchParams.get('settingStyle') ?? undefined,
    bandType: searchParams.get('bandType') ?? undefined,
    settingProfile: searchParams.get('settingProfile') ?? undefined,
    metalOption: searchParams.get('metalOption') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }

  try {
    const result = await fetchRingsPaginated(page, pageSize, filters)
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch rings' }, { status: 500 })
  }
}
