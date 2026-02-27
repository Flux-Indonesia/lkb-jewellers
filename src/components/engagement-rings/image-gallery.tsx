'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  thumbnails: string[]
  alt: string
}

function ImageFallback({ alt }: { alt: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-600">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
      </svg>
      <span className="mt-3 text-sm text-zinc-700">{alt}</span>
    </div>
  )
}

export function ImageGallery({ images, thumbnails, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mainImgError, setMainImgError] = useState(false)
  const [thumbErrors, setThumbErrors] = useState<Record<number, boolean>>({})

  const displayImages = images.length > 0 ? images : ['']
  const displayThumbs = thumbnails.length > 0 ? thumbnails : images

  function goNext() {
    setActiveIndex(i => (i + 1) % displayImages.length)
    setMainImgError(false)
  }

  function goPrev() {
    setActiveIndex(i => (i - 1 + displayImages.length) % displayImages.length)
    setMainImgError(false)
  }

  function selectImage(index: number) {
    setActiveIndex(index)
    setMainImgError(false)
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 w-full">
      {/* Thumbnail strip — vertical on desktop, horizontal on mobile */}
      <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] pb-2 lg:pb-0 lg:pr-2 scroll-smooth">
        {displayThumbs.map((thumb, i) => (
          <button
            key={i}
            onClick={() => selectImage(i)}
            className={`
              relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden border-2 transition-all duration-200
              ${activeIndex === i
                ? 'border-[#D4AF37]'
                : 'border-zinc-700 hover:border-zinc-500'
              }
            `}
            aria-label={`View image ${i + 1}`}
          >
            {thumbErrors[i] ? (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-700 text-xs">{i + 1}</span>
              </div>
            ) : (
              <Image
                src={thumb}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                onError={() => setThumbErrors(prev => ({ ...prev, [i]: true }))}
              />
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-square lg:aspect-auto lg:min-h-[500px] rounded-lg overflow-hidden bg-zinc-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {mainImgError ? (
              <ImageFallback alt={alt} />
            ) : (
              <Image
                src={displayImages[activeIndex]}
                alt={`${alt} - view ${activeIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                onError={() => setMainImgError(true)}
                priority={activeIndex === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {activeIndex + 1}/{displayImages.length}
          </div>
        )}
      </div>
    </div>
  )
}
