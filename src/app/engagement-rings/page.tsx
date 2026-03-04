import { Suspense } from 'react'
import type { Metadata } from 'next'
import { EngagementRingsContent } from '@/components/engagement-rings/engagement-rings-content'
import ShowroomSection from '@/components/showroom-section'
import { fetchAllRings } from '@/lib/supabase-rings'

export const metadata: Metadata = {
  title: 'Engagement Rings | LKB Jewellers',
  description: 'Browse our collection of 225 engagement ring settings. Filter by shape, metal type, setting style, band type, and setting profile to find your perfect ring.',
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      {/* Filter bar skeleton */}
      <div className="w-full bg-zinc-950 border-b border-zinc-800 h-32 animate-pulse" />
      {/* Grid skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-zinc-900 animate-pulse">
              <div className="aspect-square bg-zinc-800 rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-full" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function EngagementRingsPage() {
  const rings = await fetchAllRings()

  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        <EngagementRingsContent rings={rings} />
      </Suspense>
      <ShowroomSection />
    </>
  )
}
