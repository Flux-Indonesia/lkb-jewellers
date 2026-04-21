'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { RingListingItem } from '@/lib/supabase-rings'

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
}

export function RingListingCard({ ring, priority = false }: RingListingCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [hoverLoaded, setHoverLoaded] = useState(false)
  const preloadRef = useRef<{ img: HTMLImageElement; timeout: number } | null>(null)
  const searchParams = useSearchParams()

  const thumbnail = ring.thumbnail
  const hoverImage = ring.hoverImage

  const hasHover = Boolean(hoverImage && hoverImage !== thumbnail)

  const ringDetailHref = (() => {
    const params = new URLSearchParams()
    const metal = searchParams.get('metal')
    const settingProfile = searchParams.get('settingProfile')
    const shape = searchParams.get('shape')
    const settingStyle = searchParams.get('settingStyle')
    const bandType = searchParams.get('bandType')
    if (metal) params.set('metal', metal)
    if (settingProfile) params.set('settingProfile', settingProfile)
    if (shape) params.set('shape', shape)
    if (settingStyle) params.set('settingStyle', settingStyle)
    if (bandType) params.set('bandType', bandType)
    const qs = params.toString()
    return `/engagement-rings/${ring.slug}${qs ? `?${qs}` : ''}`
  })()

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
      setHoverLoaded(true)
    }
  }, [hasHover, hoverLoaded, hoverImage])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <Link
      href={ringDetailHref}
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
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/80 text-zinc-500">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="mt-3 text-xs font-medium tracking-wide text-zinc-500">{ring.name}</span>
              <span className="mt-1 text-[10px] text-zinc-600">Image unavailable</span>
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
                onError={() => setImgError(true)}
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
        </div>
      </div>
    </Link>
  )
}
