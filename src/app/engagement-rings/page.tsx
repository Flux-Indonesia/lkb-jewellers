import { Suspense } from 'react'
import type { Metadata } from 'next'
import { EngagementRingsContent } from '@/components/engagement-rings/engagement-rings-content'
import ShowroomSection from '@/components/showroom-section'

export const metadata: Metadata = {
  title: 'Engagement Rings | LKB Jewellers',
  description: 'Browse our collection of 225 engagement ring settings. Filter by shape, metal type, setting style, band type, and setting profile to find your perfect ring.',
}

export default function EngagementRingsPage() {
  return (
    <>
      <Suspense>
        <EngagementRingsContent />
      </Suspense>
      <ShowroomSection />
    </>
  )
}
