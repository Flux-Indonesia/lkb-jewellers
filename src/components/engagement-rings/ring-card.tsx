'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Ring } from '@/data/engagement-rings'

interface RingCardProps {
  ring: Ring
  priority?: boolean
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

  const primaryImage = ring.images[0]
  const hoverImage = ring.images[1] ?? ring.images[0]

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
              {/* Primary image */}
              <Image
                src={primaryImage}
                alt={`${ring.name} engagement ring`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                className={`object-cover transition-opacity duration-500 ${
                  isHovered && hoverImage !== primaryImage ? 'opacity-0' : 'opacity-100'
                }`}
                onError={() => setImgError(true)}
                priority={priority}
              />
              {/* Hover image — pre-loaded eagerly to prevent flicker on hover */}
              {hoverImage !== primaryImage && (
                <Image
                  src={hoverImage}
                  alt={`${ring.name} engagement ring alternate view`}
                  fill
                  loading="eager"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className={`object-cover absolute inset-0 transition-opacity duration-500 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={() => {}}
                />
              )}
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
