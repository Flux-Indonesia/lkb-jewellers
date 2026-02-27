'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Info, Leaf } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Ring } from '@/data/engagement-rings'
import { stoneTypes, clarityOptions, caratRanges, colourOptions, recommendedGemstones as staticGemstones } from '@/data/gemstone-options'
import type { RecommendedGemstone } from '@/data/gemstone-options'
import { filterGemstones, formatGemstonePrice, getStoneTypeLabel } from '@/lib/gemstone-utils'
import type { GemstoneFilter } from '@/lib/gemstone-utils'

interface RingConfiguratorProps {
  ring: Ring
  gemstones?: RecommendedGemstone[]
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

export function RingConfigurator({ ring, gemstones }: RingConfiguratorProps) {
  // Your Setting state
  const [sideStones, setSideStones] = useState(ring.sideStonesOptions[0] ?? 'Lab Grown Diamond')
  const [metalType, setMetalType] = useState(ring.metalOptions[0] ?? 'Platinum')
  const [setting, setSetting] = useState(ring.settingOptions[0] ?? 'High Setting')
  const [ringSize, setRingSize] = useState('')

  // Your Gemstone state
  const [gemFilter, setGemFilter] = useState<GemstoneFilter>({})

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
            <Select value={sideStones} onValueChange={setSideStones}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {ring.sideStonesOptions.map(opt => (
                  <SelectItem key={opt} value={opt} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Metal Type"
            tooltip="The precious metal used for your ring. Each metal has unique properties and appearance."
          >
            <Select value={metalType} onValueChange={setMetalType}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {ring.metalOptions.map(opt => (
                  <SelectItem key={opt} value={opt} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Setting"
            tooltip="How high the centre stone sits above the band. High setting maximises light exposure."
          >
            <Select value={setting} onValueChange={setSetting}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {ring.settingOptions.map(opt => (
                  <SelectItem key={opt} value={opt} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Ring Size"
            tooltip="UK ring sizing. Not sure of your size? We offer complimentary resizing."
          >
            <Select value={ringSize} onValueChange={setRingSize}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                {ring.ringSizes.map(size => (
                  <SelectItem key={size} value={size} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            tooltip="Choose between lab grown diamonds, natural diamonds, moissanite, or lab grown sapphires."
          >
            <Select value={gemFilter.stoneType ?? 'all'} onValueChange={v => updateGemFilter('stoneType', v)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue placeholder="All stone types" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">All stone types</SelectItem>
                {stoneTypes.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt.label}
                    {opt.badge && <span className="ml-2 text-emerald-400 text-xs">({opt.badge})</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Clarity"
            tooltip="Diamond clarity refers to the absence of inclusions and blemishes. IF is the highest grade."
          >
            <Select value={gemFilter.clarity ?? 'all'} onValueChange={v => updateGemFilter('clarity', v)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue placeholder="All clarities" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">All clarities</SelectItem>
                {clarityOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Carat"
            tooltip="Carat is the unit of measurement for diamond weight. Larger carats appear bigger."
          >
            <Select value={gemFilter.caratRange ?? 'all'} onValueChange={v => updateGemFilter('caratRange', v)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue placeholder="All carat sizes" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">All carat sizes</SelectItem>
                {caratRanges.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ConfigRow>

          <ConfigRow
            label="Colour"
            tooltip="Diamond colour is graded from D (colourless) to Z (light yellow). D is the most prized."
          >
            <Select value={gemFilter.colour ?? 'all'} onValueChange={v => updateGemFilter('colour', v)}>
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white hover:border-zinc-500 focus:ring-[#D4AF37] focus:ring-1">
                <SelectValue placeholder="All colours" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">All colours</SelectItem>
                {colourOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-zinc-800 focus:bg-zinc-800">
                    {opt.label} — {opt.description.split('—')[0].trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
