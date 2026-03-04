import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RingDetailContent } from '@/components/engagement-rings/ring-detail-content'
import ShowroomSection from '@/components/showroom-section'
import { fetchAllSlugs, fetchGemstones, fetchRingBySlug } from '@/lib/supabase-rings'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const ring = await fetchRingBySlug(slug)
  if (!ring) return { title: 'Ring Not Found | LKB Jewellers' }

  return {
    title: `${ring.name} Engagement Ring | LKB Jewellers`,
    description: ring.description || `The ${ring.name} — ${ring.title}.`,
  }
}

export default async function RingDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [ring, gemstones] = await Promise.all([
    fetchRingBySlug(slug),
    fetchGemstones(),
  ])

  if (!ring) notFound()

  return (
    <>
      <RingDetailContent ring={ring} gemstones={gemstones} />
      <ShowroomSection />
    </>
  )
}
