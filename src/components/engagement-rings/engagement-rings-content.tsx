'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'
import { FilterBar } from '@/components/engagement-rings/filter-bar'
import { RingListingCard } from '@/components/engagement-rings/ring-listing-card'
import type { PaginatedRings, RingListingItem } from '@/lib/supabase-rings'
import { parseFiltersFromURL, filtersToURL, hasActiveFilters } from '@/lib/ring-filters'
import type { ActiveFilters } from '@/lib/ring-filters'

const PAGE_SIZE = 24

interface EngagementRingsContentProps {
  initialData: PaginatedRings
}

export function EngagementRingsContent({ initialData }: EngagementRingsContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialFilters = useMemo(() => parseFiltersFromURL(searchParams), [])

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters)
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc'>('recommended')
  const [rings, setRings] = useState<RingListingItem[]>(initialData.rings)
  const [total, setTotal] = useState(initialData.total)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialData.hasMore)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const filterVersion = useRef(0)

  const buildQuery = useCallback((filters: ActiveFilters, p: number) => {
    const params = new URLSearchParams()
    params.set('page', String(p))
    params.set('limit', String(PAGE_SIZE))
    if (filters.shape) params.set('shape', filters.shape)
    if (filters.settingStyle) params.set('settingStyle', filters.settingStyle)
    if (filters.bandType) params.set('bandType', filters.bandType)
    if (filters.settingProfile) params.set('settingProfile', filters.settingProfile)
    return `/api/rings/listing?${params.toString()}`
  }, [])

  const handleFilterChange = useCallback((filters: ActiveFilters) => {
    setActiveFilters(filters)
    setPage(1)
    setFiltering(true)
    filterVersion.current += 1
    const version = filterVersion.current

    const url = `/engagement-rings${filtersToURL(filters)}`
    router.push(url, { scroll: false })

    fetch(buildQuery(filters, 1))
      .then(r => r.json())
      .then((data: PaginatedRings) => {
        if (filterVersion.current !== version) return
        setRings(data.rings)
        setTotal(data.total)
        setHasMore(data.hasMore)
        setFiltering(false)
      })
      .catch(() => setFiltering(false))
  }, [router, buildQuery])

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    const nextPage = page + 1
    setLoadingMore(true)

    fetch(buildQuery(activeFilters, nextPage))
      .then(r => r.json())
      .then((data: PaginatedRings) => {
        setRings(prev => {
          const existingSlugs = new Set(prev.map(r => r.slug))
          const fresh = data.rings.filter(r => !existingSlugs.has(r.slug))
          return [...prev, ...fresh]
        })
        setPage(nextPage)
        setHasMore(data.hasMore)
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }, [loadingMore, hasMore, page, activeFilters, buildQuery])

  const sortedRings = useMemo(() => {
    const sorted = [...rings]
    if (sortBy === 'price_asc') sorted.sort((a, b) => a.basePrice - b.basePrice)
    if (sortBy === 'price_desc') sorted.sort((a, b) => b.basePrice - a.basePrice)
    return sorted
  }, [rings, sortBy])

  return (
    <div className="min-h-screen bg-black">
      <div className="relative w-full bg-zinc-950 border-b border-zinc-800 overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <p className="text-gray-500 text-xs font-medium tracking-widest uppercase mb-3">
            Engagement Rings
          </p>
          <h1 className="font-heading text-white text-3xl md:text-4xl font-light tracking-wide mb-3">
            {activeFilters.shape
              ? `${activeFilters.shape.charAt(0).toUpperCase() + activeFilters.shape.slice(1)} Cut Engagement Rings`
              : 'Engagement Rings'}
          </h1>
          <p className="text-gray-500 text-sm max-w-xl">
            Crafted by our jewellers with care and precision.
          </p>
        </div>
      </div>

      <FilterBar activeFilters={activeFilters} onFilterChange={handleFilterChange} />

      {hasActiveFilters(activeFilters) && (
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-500 text-xs">Active filters:</span>
            {Object.entries(activeFilters).map(([key, value]) =>
              value ? (
                <button
                  key={key}
                  onClick={() => {
                    const next = { ...activeFilters }
                    delete next[key as keyof ActiveFilters]
                    handleFilterChange(next)
                  }}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-gray-300 text-xs px-3 py-1.5 rounded-full transition-colors duration-200"
                >
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: {value}</span>
                  <X size={10} />
                </button>
              ) : null
            )}
            <button
              onClick={() => handleFilterChange({})}
              className="text-[#D4AF37] text-xs hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {filtering ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 size={32} className="animate-spin text-[#D4AF37]" />
          </div>
        ) : sortedRings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-600">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <h2 className="font-heading text-white text-xl mb-2">No rings match your filters</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Try adjusting or clearing your filters to see more results.
            </p>
            <button
              onClick={() => handleFilterChange({})}
              className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-sm font-medium tracking-wide hover:bg-[#D4AF37] hover:text-black transition-all duration-200 rounded"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-xs">
                {rings.length} of {total} settings
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-1.5 rounded appearance-none cursor-pointer hover:border-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {sortedRings.map((ring, index) => (
                <RingListingCard key={ring.slug} ring={ring} priority={index < 8} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 border border-zinc-700 hover:border-[#D4AF37] text-gray-300 hover:text-[#D4AF37] text-sm font-medium tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${total - rings.length} remaining)`
                  )}
                </button>
              </div>
            )}

            <div className="mt-16 pt-12 border-t border-zinc-800">
              <h3 className="font-heading text-white text-xl font-light tracking-wide mb-4">
                Engagement Rings — Timeless, Forever.
              </h3>
              <div className="max-w-3xl space-y-4 text-gray-500 text-sm leading-relaxed">
                <p>
                  Timeless, brilliant and universally adored — an engagement ring is a style icon perfect for those who treasure elegant, enduring beauty. Each ring is handcrafted using premium materials and lab grown gemstones.
                </p>
                <p>
                  At LKB Jewellers, every ring is handcrafted using premium materials and ethically sourced gemstones. Explore the collection online or begin your journey in one of our showrooms.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
