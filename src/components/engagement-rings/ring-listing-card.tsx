'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { RingListingItem } from '@/lib/supabase-rings'
import type { MetalValue } from '@/data/ring-filters'
import type { RingColorPreference } from '@/lib/ring-preferences'

const METAL_COLOR_PREFIX: Record<MetalValue, string> = {
  platinum: 'white',
  palladium: 'white',
  yellow_gold: 'yellow',
  rose_gold: 'rose',
  white_gold: 'white',
  '9k_yellow_gold': 'yellow',
  '9k_white_gold': 'white',
  '9k_rose_gold': 'rose',
}

function swapMetalInUrl(url: string, metal: MetalValue): string {
  return url.replace(/(yellow|white|rose)(_\d+\.jpg)/, `${METAL_COLOR_PREFIX[metal]}$2`)
}

const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEB' +
  'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA' +
  '/8QAFAABAAAAAAAAAAAAAAAAAAAACv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVIP/2Q=='

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

interface RingListingCardProps {
  ring: RingListingItem
  priority?: boolean
  selectedMetal?: MetalValue
  dbPreferences?: RingColorPreference | null
}

export function RingListingCard({ ring, priority = false, selectedMetal, dbPreferences = null }: RingListingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [hoverLoaded, setHoverLoaded] = useState(false)
  const [thumbSwapFailed, setThumbSwapFailed] = useState(false)
  const [hoverSwapFailed, setHoverSwapFailed] = useState(false)
  const preloadRef = useRef<{ img: HTMLImageElement; timeout: number } | null>(null)

  // Reset swap failure state ketika metal berubah
  const prevMetalRef = useRef(selectedMetal)
  if (prevMetalRef.current !== selectedMetal) {
    prevMetalRef.current = selectedMetal
    setThumbSwapFailed(false)
    setHoverSwapFailed(false)
    setImgError(false)
    setHoverLoaded(false)
  }

  const thumbnail =
    dbPreferences?.thumbnail_url ??
    (selectedMetal && !thumbSwapFailed
      ? swapMetalInUrl(ring.thumbnail, selectedMetal)
      : ring.thumbnail)
  const hoverImage =
    dbPreferences?.hover_url ??
    (selectedMetal && !hoverSwapFailed
      ? swapMetalInUrl(ring.hoverImage, selectedMetal)
      : ring.hoverImage)

  const hasHover = Boolean(hoverImage && hoverImage !== thumbnail)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (!hasHover || hoverLoaded) return

    const img = new window.Image()
    const timeout = window.setTimeout(() => setHoverLoaded(true), 1200)
    preloadRef.current = { img, timeout }
    img.src = hoverImage
    img.onload = () => { window.clearTimeout(timeout); setHoverLoaded(true) }
    img.onerror = () => {
      window.clearTimeout(timeout)
      if (selectedMetal && !hoverSwapFailed) {
        setHoverSwapFailed(true)
      } else {
        setHoverLoaded(true)
      }
    }
  }, [hasHover, hoverLoaded, hoverImage, selectedMetal, hoverSwapFailed])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <Link
      href={`/engagement-rings/${ring.slug}`}
      className="group block"
      aria-label={`View ${ring.name} engagement ring`}
    >
      <div
        className="relative overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-square overflow-hidden bg-zinc-900">
          {imgError ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" />
                <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
              </svg>
              <span className="mt-2 text-xs text-zinc-700">{ring.name}</span>
            </div>
          ) : (
            <>
              {hasHover && (
                <Image
                  src={hoverImage}
                  alt={`${ring.name} alternate view`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className={`object-cover absolute inset-0 transition-opacity duration-200 ${isHovered && hoverLoaded ? 'opacity-100' : 'opacity-0'}`}
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              )}
              <Image
                src={thumbnail}
                alt={`${ring.name} engagement ring`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                className={`object-cover absolute inset-0 z-10 transition-opacity duration-200 ${isHovered && hoverLoaded && hasHover ? 'opacity-0' : 'opacity-100'}`}
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                onError={() => {
                  if (selectedMetal && !thumbSwapFailed) {
                    setThumbSwapFailed(true)
                  } else {
                    setImgError(true)
                  }
                }}
                priority={priority}
              />
            </>
          )}

          {ring.settingStyle && (
            <div className="absolute bottom-0 left-0 bg-black/60 backdrop-blur-sm px-2 py-1 text-[9px] font-medium tracking-widest uppercase text-gray-300 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
              {ring.settingStyle.replace(/_/g, ' ')}
            </div>
          )}
        </div>

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
