'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Info, ChevronRight } from 'lucide-react'
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

// ─── SVG Icon Components ──────────────────────────────────────────────────────

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

function FilterIcon({ svgPath, label }: { svgPath: string; label: string }) {
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

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  label: string
  selectedLabel?: string
  tooltip: string
  rightContent?: React.ReactNode
}

function SectionHeader({ label, selectedLabel, tooltip, rightContent }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-3">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">
          {label}
          {selectedLabel && (
            <span className="text-[#D4AF37]">
              {' '}({selectedLabel.toUpperCase()} SELECTED)
            </span>
          )}
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0"
                aria-label={`Info about ${label}`}
              >
                <Info size={11} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-zinc-900 border-zinc-700 text-white text-xs max-w-48"
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {rightContent && (
        <div className="flex-shrink-0">{rightContent}</div>
      )}
    </div>
  )
}

// ─── Show All Button ──────────────────────────────────────────────────────────

function ShowAllButton({ showAll, onToggle }: { showAll: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-0.5 text-[10px] font-semibold tracking-widest uppercase text-gray-500 hover:text-[#D4AF37] transition-colors"
    >
      {showAll ? 'SHOW LESS' : 'SHOW ALL'}
      <ChevronRight
        size={11}
        className={`transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`}
      />
    </button>
  )
}

// ─── Filter Button ────────────────────────────────────────────────────────────

interface FilterButtonProps {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
  filterKey: string
}

function FilterButton({ isActive, onClick, children, title, filterKey }: FilterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg border
        transition-all duration-200 cursor-pointer min-w-[56px]
        ${isActive
          ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5'
          : 'border-zinc-800 text-gray-500 hover:border-zinc-600 hover:text-gray-300'
        }
      `}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId={`filter-indicator-${filterKey}`}
          className="absolute inset-0 rounded-lg border border-[#D4AF37]"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

// ─── Main FilterBar Component ─────────────────────────────────────────────────

const SHAPE_DEFAULT_COUNT = 7
const SETTING_STYLE_DEFAULT_COUNT = 4

export function FilterBar({ activeFilters, onFilterChange }: FilterBarProps) {
  const [showAllShapes, setShowAllShapes] = useState(false)
  const [showAllSettingStyles, setShowAllSettingStyles] = useState(false)

  function toggleFilter(key: keyof ActiveFilters, value: string) {
    const current = activeFilters[key]
    if (current === value) {
      const next = { ...activeFilters }
      delete next[key]
      onFilterChange(next)
    } else {
      onFilterChange({ ...activeFilters, [key]: value })
    }
  }

  // Visible shape options based on show all state
  const visibleShapes = showAllShapes
    ? shapeOptions
    : shapeOptions.slice(0, SHAPE_DEFAULT_COUNT)
  const hasMoreShapes = shapeOptions.length > SHAPE_DEFAULT_COUNT

  // Visible setting style options
  const visibleSettingStyles = showAllSettingStyles
    ? settingStyleOptions
    : settingStyleOptions.slice(0, SETTING_STYLE_DEFAULT_COUNT)
  const hasMoreSettingStyles = settingStyleOptions.length > SETTING_STYLE_DEFAULT_COUNT

  // Active labels for header display
  const activeShape = shapeOptions.find(o => o.value === activeFilters.shape)


  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 md:py-5">

        {/* ── Row 1: Shape | Metal ── */}
        <div className="flex flex-row gap-8 md:gap-12 overflow-x-auto pb-4
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Shape Section */}
          <div className="flex flex-col flex-shrink-0">
            <SectionHeader
              label="Shape"
              selectedLabel={activeShape?.label}
              tooltip="The shape of the centre stone. Each shape has a unique character and brilliance."
              rightContent={
                hasMoreShapes ? (
                  <ShowAllButton
                    showAll={showAllShapes}
                    onToggle={() => setShowAllShapes(prev => !prev)}
                  />
                ) : undefined
              }
            />
            <div className="flex flex-wrap gap-2">
              {visibleShapes.map(opt => (
                <FilterButton
                  key={opt.value}
                  isActive={activeFilters.shape === opt.value}
                  onClick={() => toggleFilter('shape', opt.value)}
                  title={opt.description}
                  filterKey="shape"
                >
                  <ShapeIcon svgPath={opt.svgPath} label={opt.label} />
                  <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">
                    {opt.label}
                  </span>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Metal Type Section */}
          <div className="flex flex-col flex-shrink-0">
            <SectionHeader
              label="Metal Type"
              tooltip="The precious metal used for the band and setting. Each metal has unique properties and appearance."
            />
            <div className="flex flex-wrap gap-2">
              {metalOptions.map(opt => (
                <FilterButton
                  key={opt.value}
                  isActive={activeFilters.metal === opt.value}
                  onClick={() => toggleFilter('metal', opt.value)}
                  title={opt.description}
                  filterKey="metal"
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
                  <span className="text-[10px] font-medium tracking-wide whitespace-nowrap text-center leading-tight max-w-[72px]"
                    style={{ wordBreak: 'keep-all' }}
                  >
                    {opt.label}
                  </span>
                </FilterButton>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* ── Row 2: Setting Style | Band Type | Setting Profile ── */}
        <div className="flex flex-row gap-8 md:gap-12 overflow-x-auto pt-4
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Setting Style Section */}
          <div className="flex flex-col flex-shrink-0">
            <SectionHeader
              label="Setting Style"
              tooltip="The overall design style of the ring setting. From classic solitaires to romantic trilogy designs."
              rightContent={
                hasMoreSettingStyles ? (
                  <ShowAllButton
                    showAll={showAllSettingStyles}
                    onToggle={() => setShowAllSettingStyles(prev => !prev)}
                  />
                ) : undefined
              }
            />
            <div className="flex flex-wrap gap-2">
              {visibleSettingStyles.map(opt => (
                <FilterButton
                  key={opt.value}
                  isActive={activeFilters.settingStyle === opt.value}
                  onClick={() => toggleFilter('settingStyle', opt.value)}
                  title={opt.description}
                  filterKey="settingStyle"
                >
                  {opt.svgPath && (
                    <FilterIcon svgPath={opt.svgPath} label={opt.label} />
                  )}
                  <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">
                    {opt.label}
                  </span>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Band Type Section */}
          <div className="flex flex-col flex-shrink-0">
            <SectionHeader
              label="Band Type"
              tooltip="The style of the ring band. Plain bands are classic, pavé bands add sparkle, accented bands add detail."
            />
            <div className="flex flex-wrap gap-2">
              {bandTypeOptions.map(opt => (
                <FilterButton
                  key={opt.value}
                  isActive={activeFilters.bandType === opt.value}
                  onClick={() => toggleFilter('bandType', opt.value)}
                  title={opt.description}
                  filterKey="bandType"
                >
                  {opt.svgPath && (
                    <FilterIcon svgPath={opt.svgPath} label={opt.label} />
                  )}
                  <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">
                    {opt.label}
                  </span>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* Setting Profile Section */}
          <div className="flex flex-col flex-shrink-0">
            <SectionHeader
              label="Setting Profile"
              tooltip="How high the centre stone sits above the band. High set maximises light, low set is more practical."
            />
            <div className="flex flex-wrap gap-2">
              {settingProfileOptions.map(opt => (
                <FilterButton
                  key={opt.value}
                  isActive={activeFilters.settingProfile === opt.value}
                  onClick={() => toggleFilter('settingProfile', opt.value)}
                  title={opt.description}
                  filterKey="settingProfile"
                >
                  {opt.svgPath && (
                    <FilterIcon svgPath={opt.svgPath} label={opt.label} />
                  )}
                  <span className="text-[10px] font-medium tracking-wide whitespace-nowrap">
                    {opt.label}
                  </span>
                </FilterButton>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
