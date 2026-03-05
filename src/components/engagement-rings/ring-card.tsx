'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Ring } from '@/data/engagement-rings'
import ringHoverBoxMap from '@/data/ring-hover-box-map.json'

// Tiny dark blur placeholder — 1x1 pixel zinc-900 (#18181b) sebagai base64 JPEG
const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA' +
  '/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVIP/2Q=='

interface RingCardProps {
  ring: Ring
  priority?: boolean
}

type RingColorKey = 'yellow' | 'white' | 'rose'

type HoverBoxMap = Record<string, Partial<Record<RingColorKey, string>>>

const hoverBoxMap = ringHoverBoxMap as HoverBoxMap

const MANUAL_HOVER_OVERRIDES: Partial<Record<string, Partial<Record<RingColorKey, string>>>> = {
  'ring-allison': {
    yellow:
      'https://ttiwmcrfahbczzehmyds.supabase.co/storage/v1/object/public/engagement-rings/rings/allison/yellow_2.jpg',
    white:
      'https://ttiwmcrfahbczzehmyds.supabase.co/storage/v1/object/public/engagement-rings/rings/allison/white_2.jpg',
    rose: 'https://ttiwmcrfahbczzehmyds.supabase.co/storage/v1/object/public/engagement-rings/rings/allison/rose_2.jpg',
  },
  'ring-alexia': {
    yellow:
      'https://ttiwmcrfahbczzehmyds.supabase.co/storage/v1/object/public/engagement-rings/rings/alexia/yellow_5.jpg',
    white:
      'https://ttiwmcrfahbczzehmyds.supabase.co/storage/v1/object/public/engagement-rings/rings/alexia/white_5.jpg',
    rose: 'https://ttiwmcrfahbczzehmyds.supabase.co/storage/v1/object/public/engagement-rings/rings/alexia/rose_5.jpg',
  },
}

const MANUAL_PRIMARY_NUMBER_OVERRIDES: Partial<Record<string, number>> = {
  'ring-allison': 1,
}

const GLOBAL_FALLBACK_HOVER_IMAGE =
  hoverBoxMap['ring-allison']?.yellow ??
  hoverBoxMap['ring-allison']?.white ??
  hoverBoxMap['ring-allison']?.rose ??
  hoverBoxMap['ring-adina']?.yellow ??
  hoverBoxMap['ring-alexia']?.yellow

function getColorFromUrl(url: string): RingColorKey | null {
  const filename = (url.split('/').pop() ?? '').toLowerCase()
  if (filename.startsWith('yellow_')) return 'yellow'
  if (filename.startsWith('white_')) return 'white'
  if (filename.startsWith('rose_')) return 'rose'
  return null
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function RingImageFallback({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
      </svg>
      <span className="mt-2 text-xs text-zinc-700">{name}</span>
    </div>
  )
}

export function RingCard({ ring, priority = false }: RingCardProps) {
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isHoverImageLoaded, setIsHoverImageLoaded] = useState(false)
  const [dbPrefs, setDbPrefs] = useState<{ thumbnail_url: string | null; hover_url: string | null } | null>(null)

  const orderedImages = useMemo(() => {
    const seen = new Set<string>()
    const merged = [...ring.thumbnails, ...ring.images]
    const result: string[] = []

    for (const url of merged) {
      const key = url.trim().toLowerCase().split('?')[0]
      if (seen.has(key)) continue
      seen.add(key)
      result.push(url)
    }

    return result
  }, [ring.thumbnails, ring.images])

  const getImageNumber = (url: string): number | null => {
    const filename = url.split('/').pop() ?? ''
    const match = filename.match(/_(\d+)\.[a-zA-Z0-9]+$/)
    if (!match) return null
    const parsed = Number(match[1])
    return Number.isFinite(parsed) ? parsed : null
  }

  const defaultColor = getColorFromUrl(orderedImages[0] ?? '')

  // Fetch DB preferences (fail-open: fallback to existing logic on error)
  useEffect(() => {
    fetch(`/api/rings/preferences?slug=${encodeURIComponent(ring.slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (!json?.data || !defaultColor) return
        const colorPref = json.data[defaultColor]
        if (colorPref?.thumbnail_url || colorPref?.hover_url) {
          setDbPrefs(colorPref)
        }
      })
      .catch(() => {}) // fail-open
  }, [ring.slug, defaultColor])
  const manualMappedBySlug = MANUAL_HOVER_OVERRIDES[ring.slug]
  const mappedBySlug = hoverBoxMap[ring.slug]
  const manualMappedHoverImage =
    defaultColor && manualMappedBySlug?.[defaultColor]
      ? manualMappedBySlug[defaultColor]
      : undefined
  const mappedHoverImage =
    manualMappedHoverImage ??
    (defaultColor && mappedBySlug?.[defaultColor] ? mappedBySlug[defaultColor] : undefined)
  const fallbackMappedHoverImage =
    mappedHoverImage ??
    manualMappedBySlug?.yellow ??
    manualMappedBySlug?.white ??
    manualMappedBySlug?.rose ??
    mappedBySlug?.yellow ??
    mappedBySlug?.white ??
    mappedBySlug?.rose ??
    GLOBAL_FALLBACK_HOVER_IMAGE

  const manualPrimaryNumber = MANUAL_PRIMARY_NUMBER_OVERRIDES[ring.slug]
  const manualPrimaryImage =
    manualPrimaryNumber !== undefined
      ? orderedImages.find(url => {
          if (mappedHoverImage && url === mappedHoverImage) return false
          return getImageNumber(url) === manualPrimaryNumber
        })
      : undefined

  const primaryImage =
    dbPrefs?.thumbnail_url ??
    manualPrimaryImage ??
    orderedImages.find(url => {
      if (mappedHoverImage && url === mappedHoverImage) return false
      const n = getImageNumber(url)
      return n !== 2 && n !== 5
    }) ??
    orderedImages.find(url => url !== mappedHoverImage) ??
    orderedImages[0]

  const hoverImage =
    (dbPrefs?.hover_url && dbPrefs.hover_url !== primaryImage ? dbPrefs.hover_url : undefined) ??
    (fallbackMappedHoverImage && fallbackMappedHoverImage !== primaryImage
      ? fallbackMappedHoverImage
      : undefined) ??
    primaryImage

  useEffect(() => {
    setIsHoverImageLoaded(false)

    if (!hoverImage || hoverImage === primaryImage) {
      setIsHoverImageLoaded(true)
      return
    }

    const preload = new window.Image()
    const forceLoadedAfterTimeout = window.setTimeout(() => {
      setIsHoverImageLoaded(true)
    }, 1200)

    preload.src = hoverImage
    preload.onload = () => {
      window.clearTimeout(forceLoadedAfterTimeout)
      setIsHoverImageLoaded(true)
    }
    preload.onerror = () => {
      window.clearTimeout(forceLoadedAfterTimeout)
      setIsHoverImageLoaded(true)
    }

    return () => {
      window.clearTimeout(forceLoadedAfterTimeout)
      preload.onload = null
      preload.onerror = null
    }
  }, [hoverImage, primaryImage])

  return (
    <Link
      href={`/engagement-rings/${ring.slug}`}
      className="group block"
      aria-label={`View ${ring.name} engagement ring`}
    >
      <div
        className="relative overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-zinc-900">
          {imgError ? (
            <RingImageFallback name={ring.name} />
          ) : (
            <>
              {/* Hover image — sits behind primary, always rendered & loaded */}
              {hoverImage !== primaryImage && (
                <Image
                  src={hoverImage}
                  alt={`${ring.name} engagement ring alternate view`}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className={`object-cover absolute inset-0 ${isHoverImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                  onLoad={() => setIsHoverImageLoaded(true)}
                  onError={() => setIsHoverImageLoaded(true)}
                />
              )}
              {/* Primary image — fades out on hover, revealing hover image beneath */}
              <Image
                src={primaryImage}
                alt={`${ring.name} engagement ring`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                className={`object-cover absolute inset-0 z-10 transition-opacity duration-200 ${
                  isHovered && isHoverImageLoaded && hoverImage !== primaryImage ? 'opacity-0' : 'opacity-100'
                }`}
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onError={() => setImgError(true)}
                priority={priority}
              />
            </>
          )}

          {/* Loading skeleton overlay */}
          <div className="absolute inset-0 bg-zinc-800 animate-pulse opacity-0 group-data-[loading]:opacity-100" />

          {/* Setting style overlay */}
          {ring.settingStyle && (
            <div className="absolute bottom-0 left-0 bg-black/60 backdrop-blur-sm px-2 py-1 text-[9px] font-medium tracking-widest uppercase text-gray-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {ring.settingStyle.replace(/_/g, ' ')}
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="p-3">
          <h3 className="font-heading text-white text-base font-medium tracking-wide uppercase mb-1 group-hover:text-[#D4AF37] transition-colors duration-200">
            {ring.name}
          </h3>
          <p className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest">
            Starting {formatPrice(ring.basePrice, ring.currency)} {ring.currency}
          </p>
        </div>
      </div>
    </Link>
  )
}
