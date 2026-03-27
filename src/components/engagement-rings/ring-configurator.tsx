'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Info, Leaf } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Ring } from '@/data/engagement-rings'
import { RING_METAL_OPTIONS, RING_SETTING_OPTIONS, RING_SIDE_STONE_OPTIONS, RING_SIZES } from '@/data/engagement-rings'
import { stoneTypes, clarityOptions, caratRanges, colourOptions, recommendedGemstones as staticGemstones } from '@/data/gemstone-options'
import type { RecommendedGemstone } from '@/data/gemstone-options'
import { filterGemstones, formatGemstonePrice, getStoneTypeLabel } from '@/lib/gemstone-utils'
import type { GemstoneFilter } from '@/lib/gemstone-utils'


const CERTIFICATES = ['GIA', 'IGI', 'AGS', 'SDC'] as const

interface RingConfiguratorProps {
  ring: Ring
  gemstones?: RecommendedGemstone[]
  selectedMetal: string
  onMetalChange: (metal: string) => void
}

function LabelWithTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
        {label}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-gray-600 hover:text-gray-400 transition-colors" aria-label={`Info about ${label}`}>
              <Info size={12} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-zinc-900 border-zinc-700 text-white text-xs max-w-48">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function ConfigRow({ label, tooltip, children }: { label: string; tooltip: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4">
        <div className="sm:w-48 flex-shrink-0">
          <LabelWithTooltip label={label} tooltip={tooltip} />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
      <Separator className="bg-zinc-800" />
    </>
  )
}

function PillButton({
  label,
  isSelected,
  onClick,
}: {
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 whitespace-nowrap
        ${isSelected
          ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
          : 'border-zinc-800 text-gray-400 bg-zinc-900 hover:border-zinc-600 hover:text-gray-300'
        }
      `}
    >
      {label}
    </button>
  )
}

function SelectorButton({
  label,
  isSelected,
  onClick,
  className = '',
}: {
  label: string
  isSelected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-2 rounded border text-sm font-medium transition-all duration-150 whitespace-nowrap
        ${isSelected
          ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10'
          : 'border-zinc-700 text-gray-400 bg-zinc-900 hover:border-zinc-500 hover:text-gray-200'
        }
        ${className}
      `}
    >
      {label}
    </button>
  )
}

export function RingConfigurator({ ring, gemstones, selectedMetal, onMetalChange }: RingConfiguratorProps) {
  // Your Setting state
  const [sideStones, setSideStones] = useState<string>(RING_SIDE_STONE_OPTIONS[0])
  const metalType = selectedMetal
  const [setting, setSetting] = useState<string>(RING_SETTING_OPTIONS[0])
  const [ringSize, setRingSize] = useState('')

  // Your Gemstone state
  const [gemFilter, setGemFilter] = useState<GemstoneFilter>({})
  const [certificate, setCertificate] = useState('')

  const allGemstones = gemstones ?? staticGemstones
  const filteredGemstones = filterGemstones(allGemstones, gemFilter)

  function updateGemFilter(key: keyof GemstoneFilter, value: string) {
    setGemFilter(prev => ({ ...prev, [key]: (value === 'all' || value === '') ? undefined : value }))
  }

  return (
    <div className="flex flex-col gap-8">

      {/* ── YOUR SETTING ── */}
      <section>
        <h2 className="font-heading text-white text-2xl font-medium tracking-wide mb-1">
          Your Setting
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Start by selecting your stone, metal and ring size.
        </p>

        <div className="flex flex-col">
          <Separator className="bg-zinc-800" />

          <ConfigRow
            label="Side & Melee Stones"
            tooltip="The smaller accent stones that complement your centre stone."
          >
            <div className="flex flex-wrap gap-2">
              {RING_SIDE_STONE_OPTIONS.map(opt => (
                <PillButton
                  key={opt}
                  label={opt}
                  isSelected={sideStones === opt}
                  onClick={() => setSideStones(opt)}
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Metal Type"
            tooltip="The precious metal used for your ring. Each metal has unique properties and appearance."
          >
            <div className="flex flex-wrap gap-2">
              {RING_METAL_OPTIONS.map(opt => (
                <PillButton
                  key={opt}
                  label={opt}
                  isSelected={metalType === opt}
                  onClick={() => onMetalChange(opt)}
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Setting"
            tooltip="How high the centre stone sits above the band. High setting maximises light exposure."
          >
            <div className="flex flex-wrap gap-2">
              {RING_SETTING_OPTIONS.map(opt => (
                <PillButton
                  key={opt}
                  label={opt}
                  isSelected={setting === opt}
                  onClick={() => setSetting(opt)}
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Ring Size"
            tooltip="UK ring sizing. Not sure of your size? We offer complimentary resizing."
          >
            <div className="flex flex-wrap gap-2">
              {RING_SIZES.map(size => (
                <PillButton
                  key={size}
                  label={size}
                  isSelected={ringSize === size}
                  onClick={() => setRingSize(size)}
                />
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-2">
              Not sure of your size?{' '}
              <span className="text-[#D4AF37] cursor-pointer hover:underline">We offer complimentary resizing.</span>
            </p>
          </ConfigRow>
        </div>
      </section>

      {/* ── YOUR GEMSTONE ── */}
      <section>
        <h2 className="font-heading text-white text-2xl font-medium tracking-wide mb-1">
          Your Gemstone
        </h2>

        {/* Carbon neutral badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-800/50 rounded-full px-3 py-1">
            <Leaf size={12} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium tracking-wide">
              Carbon Neutral Gemstones
            </span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Select your stone preferences to see recommended options.
        </p>

        <div className="flex flex-col">
          <Separator className="bg-zinc-800" />

          <ConfigRow
            label="Stone Type"
            tooltip="Choose between lab grown diamonds, natural diamonds, or lab grown sapphires."
          >
            <div className="grid grid-cols-2 gap-2">
              {stoneTypes.map(opt => (
                <SelectorButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={(gemFilter.stoneType ?? '') === opt.value}
                  onClick={() => updateGemFilter('stoneType', gemFilter.stoneType === opt.value ? '' : opt.value)}
                  className="text-xs"
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Clarity"
            tooltip="Diamond clarity refers to the absence of inclusions and blemishes. IF is the highest grade."
          >
            <div className="flex flex-wrap gap-2">
              {clarityOptions.map(opt => (
                <SelectorButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={gemFilter.clarity === opt.value}
                  onClick={() => updateGemFilter('clarity', gemFilter.clarity === opt.value ? '' : opt.value)}
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Carat"
            tooltip="Carat is the unit of measurement for diamond weight. Larger carats appear bigger."
          >
            <div className="flex flex-wrap gap-2">
              {caratRanges.map(opt => (
                <SelectorButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={gemFilter.caratRange === opt.value}
                  onClick={() => updateGemFilter('caratRange', gemFilter.caratRange === opt.value ? '' : opt.value)}
                  className="text-xs"
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Colour"
            tooltip="Diamond colour is graded from D (colourless) to Z (light yellow). D is the most prized."
          >
            <div className="flex flex-wrap gap-2">
              {colourOptions.map(opt => (
                <SelectorButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={gemFilter.colour === opt.value}
                  onClick={() => updateGemFilter('colour', gemFilter.colour === opt.value ? '' : opt.value)}
                />
              ))}
            </div>
          </ConfigRow>

          <ConfigRow
            label="Certificate"
            tooltip="Independent certification verifying your diamond's quality and authenticity."
          >
            <div className="flex flex-wrap gap-2">
              {CERTIFICATES.map(cert => (
                <SelectorButton
                  key={cert}
                  label={cert}
                  isSelected={certificate === cert}
                  onClick={() => setCertificate(certificate === cert ? '' : cert)}
                />
              ))}
            </div>
          </ConfigRow>
        </div>

        {/* Recommended Options */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
            Recommended Options
          </h3>

          {filteredGemstones.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p className="text-sm">No gemstones match your selection.</p>
              <button
                onClick={() => setGemFilter({})}
                className="mt-2 text-[#D4AF37] text-xs hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredGemstones.map(gem => (
                <div
                  key={gem.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 transition-colors duration-200"
                >
                  {/* Gemstone image */}
                  <div className="relative aspect-square bg-zinc-950">
                    <Image
                      src={gem.imageUrl}
                      alt={`${getStoneTypeLabel(gem.type)} ${gem.carat}ct`}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover"
                      onError={() => {}}
                     
                    />
                    {gem.badge && (
                      <div className="absolute top-2 left-2 bg-emerald-950/80 border border-emerald-800/50 rounded-full px-2 py-0.5">
                        <span className="text-emerald-400 text-[10px] font-medium">{gem.badge}</span>
                      </div>
                    )}
                  </div>

                  {/* Gemstone info */}
                  <div className="p-3">
                    <p className="text-white text-xs font-medium mb-1">
                      {getStoneTypeLabel(gem.type)}
                    </p>
                    <p className="text-gray-500 text-[11px] mb-1">
                      {gem.carat}ct · {gem.colour} · {gem.clarity}
                    </p>
                    <p className="text-gray-600 text-[11px] mb-2">
                      {gem.dimensions}
                    </p>
                    <p className="text-[#D4AF37] text-sm font-medium">
                      {formatGemstonePrice(gem.price, gem.currency)} {gem.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
