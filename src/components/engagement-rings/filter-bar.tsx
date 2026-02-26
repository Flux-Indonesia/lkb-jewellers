'use client'

import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ActiveFilters } from '@/lib/ring-filters'
import {
  shapeOptions,
  metalOptions,
  settingStyleOptions,
  bandTypeOptions,
  settingProfileOptions,
} from '@/data/ring-filters'

interface FilterBarProps {
  activeFilters: ActiveFilters
  onFilterChange: (filters: ActiveFilters) => void
}

interface FilterSectionProps {
  label: string
  tooltip: string
  children: React.ReactNode
}

function FilterSection({ label, tooltip, children }: FilterSectionProps) {
  return (
    <div className="flex flex-col gap-3">
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
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  )
}

interface FilterButtonProps {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}

function FilterButton({ isActive, onClick, children, title }: FilterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer
        ${isActive
          ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
          : 'border-zinc-700 text-gray-400 hover:border-zinc-500 hover:text-gray-200'
        }
      `}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="filter-indicator"
          className="absolute inset-0 rounded-lg border border-[#D4AF37]"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

// SVG shape icons
function ShapeIcon({ svgPath, label }: { svgPath: string; label: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
    >
      <path d={svgPath} />
    </svg>
  )
}

export function FilterBar({ activeFilters, onFilterChange }: FilterBarProps) {
  function toggleFilter(key: keyof ActiveFilters, value: string) {
    const current = activeFilters[key]
    if (current === value) {
      // Deselect
      const next = { ...activeFilters }
      delete next[key]
      onFilterChange(next)
    } else {
      onFilterChange({ ...activeFilters, [key]: value })
    }
  }

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start overflow-x-auto">

          {/* Shape */}
          <FilterSection
            label="Shape"
            tooltip="The shape of the centre stone. Each shape has a unique character and brilliance."
          >
            {shapeOptions.map(opt => (
              <FilterButton
                key={opt.value}
                isActive={activeFilters.shape === opt.value}
                onClick={() => toggleFilter('shape', opt.value)}
                title={opt.label}
              >
                <ShapeIcon svgPath={opt.svgPath} label={opt.label} />
                <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">
                  {opt.label}
                </span>
              </FilterButton>
            ))}
          </FilterSection>

          {/* Metal Type */}
          <FilterSection
            label="Metal Type"
            tooltip="The precious metal used for the band and setting. Each metal has unique properties and appearance."
          >
            {metalOptions.map(opt => (
              <FilterButton
                key={opt.value}
                isActive={activeFilters.metal === opt.value}
                onClick={() => toggleFilter('metal', opt.value)}
                title={opt.label}
              >
                <div className="relative w-7 h-7 rounded-full border border-zinc-600 overflow-hidden flex-shrink-0">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: opt.color }}
                  />
                  {opt.secondaryColor && (
                    <div
                      className="absolute inset-0 left-1/2"
                      style={{ backgroundColor: opt.secondaryColor }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">
                  {opt.label}
                </span>
              </FilterButton>
            ))}
          </FilterSection>

          {/* Setting Style */}
          <FilterSection
            label="Setting Style"
            tooltip="The overall design style of the ring setting. From classic solitaires to romantic trilogy designs."
          >
            {settingStyleOptions.map(opt => (
              <FilterButton
                key={opt.value}
                isActive={activeFilters.settingStyle === opt.value}
                onClick={() => toggleFilter('settingStyle', opt.value)}
                title={opt.description}
              >
                <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                  {opt.label}
                </span>
              </FilterButton>
            ))}
          </FilterSection>

          {/* Band Type */}
          <FilterSection
            label="Band Type"
            tooltip="The style of the ring band. Plain bands are classic, pavé bands add sparkle, accented bands add detail."
          >
            {bandTypeOptions.map(opt => (
              <FilterButton
                key={opt.value}
                isActive={activeFilters.bandType === opt.value}
                onClick={() => toggleFilter('bandType', opt.value)}
                title={opt.description}
              >
                <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                  {opt.label}
                </span>
              </FilterButton>
            ))}
          </FilterSection>

          {/* Setting Profile */}
          <FilterSection
            label="Setting Profile"
            tooltip="How high the centre stone sits above the band. High set maximises light, low set is more practical."
          >
            {settingProfileOptions.map(opt => (
              <FilterButton
                key={opt.value}
                isActive={activeFilters.settingProfile === opt.value}
                onClick={() => toggleFilter('settingProfile', opt.value)}
                title={opt.description}
              >
                <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                  {opt.label}
                </span>
              </FilterButton>
            ))}
          </FilterSection>

        </div>
      </div>
    </div>
  )
}
