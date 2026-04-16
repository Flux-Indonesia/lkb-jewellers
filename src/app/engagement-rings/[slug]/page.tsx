import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RingDetailContent } from '@/components/engagement-rings/ring-detail-content'
import ShowroomSection from '@/components/showroom-section'
import { fetchAllRings, fetchAllSlugs, fetchRingBySlug } from '@/lib/supabase-rings'
import { ProductJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/json-ld'
import { Breadcrumb } from '@/components/breadcrumb'
import { createClient } from '@/lib/supabase-server'

export const revalidate = 3600

function pickRandomRings(allRings: Awaited<ReturnType<typeof fetchAllRings>>, currentSlug: string, limit = 4) {
  const pool = allRings.filter((ring) => ring.slug !== currentSlug)
  const shuffled = [...pool]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled.slice(0, limit)
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllSlugs()
    return slugs.map(slug => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('engagement_rings')
    .select('name, title, description, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, canonical_url, noindex, nofollow')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Ring Not Found | LKB Jewellers' }

  const title = data.meta_title || `${data.name} Engagement Ring | LKB Jewellers`
  const description = data.meta_description || data.description || `The ${data.name} — ${data.title}.`
  const ogTitle = data.og_title || title
  const ogDescription = data.og_description || description

  return {
    title: data.meta_title || `${data.name} Engagement Ring`,
    description,
    keywords: data.meta_keywords || undefined,
    robots: {
      index: !data.noindex,
      follow: !data.nofollow,
    },
    alternates: {
      canonical: data.canonical_url || undefined,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
      images: data.og_image ? [{ url: data.og_image, width: 800, height: 800, alt: data.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: data.og_image ? [data.og_image] : [],
    },
  }
}

async function getFaqs(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('product_faqs')
    .select('question, answer')
    .eq('product_id', slug)
    .eq('product_type', 'ring')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data || []
}

export default async function RingDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [ring, allRings, faqs] = await Promise.all([
    fetchRingBySlug(slug),
    fetchAllRings(),
    getFaqs(slug),
  ])

  if (!ring) notFound()

  const recommendedRings = pickRandomRings(allRings, slug, 4)

  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.lkbjewellers.com' },
    { name: 'Engagement Rings', url: 'https://www.lkbjewellers.com/engagement-rings' },
    { name: ring.name, url: `https://www.lkbjewellers.com/engagement-rings/${slug}` },
  ]

  return (
    <>
      <ProductJsonLd
        name={ring.name}
        description={ring.description || `${ring.name} — ${ring.title}`}
        image={ring.thumbnails?.[0] || ring.images?.[0] || ""}
        price={ring.basePrice}
        currency={ring.currency || "USD"}
        availability="InStock"
        url={`https://www.lkbjewellers.com/engagement-rings/${slug}`}
        sku={slug}
        category="Engagement Ring"
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {faqs.length > 0 && <FaqJsonLd items={faqs} />}
      <div className="container mx-auto px-6 pt-28">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Engagement Rings', href: '/engagement-rings' },
          { label: ring.name },
        ]} />
      </div>
      <RingDetailContent ring={ring} recommendedRings={recommendedRings} />
      <ShowroomSection />
    </>
  )
}
