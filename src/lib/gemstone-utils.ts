// Gemstone utility functions for the Ring Builder configurator
import type { RecommendedGemstone } from '@/data/gemstone-options'

export interface GemstoneFilter {
  stoneType?: string
  clarity?: string
  caratRange?: string
  colour?: string
}

/**
 * Filter recommended gemstones by user's 4C selections.
 * All active filters must match (AND logic).
 */
export function filterGemstones(
  gemstones: RecommendedGemstone[],
  filter: GemstoneFilter
): RecommendedGemstone[] {
  return gemstones.filter(gem => {
    if (filter.stoneType && gem.type !== filter.stoneType) return false
    if (filter.clarity && gem.clarity !== filter.clarity) return false
    if (filter.colour && gem.colour !== filter.colour) return false
    if (filter.caratRange) {
      const [minStr, maxStr] = filter.caratRange.split('-')
      const min = parseFloat(minStr)
      const max = maxStr === undefined || maxStr === '' ? Infinity : parseFloat(maxStr.replace('+', ''))
      if (gem.carat < min || gem.carat > max) return false
    }
    return true
  })
}

/**
 * Parse carat range string to min/max values.
 * Handles formats like "1.00-1.49" and "3.00+"
 */
export function parseCaratRange(range: string): { min: number; max: number } {
  if (range.endsWith('+')) {
    return { min: parseFloat(range.replace('+', '')), max: Infinity }
  }
  const [minStr, maxStr] = range.split('-')
  return { min: parseFloat(minStr), max: parseFloat(maxStr) }
}

/**
 * Format price for display.
 */
export function formatGemstonePrice(price: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Get display label for stone type.
 */
export function getStoneTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    lab_grown_diamond: 'Lab Grown Diamond',
    natural_diamond: 'Natural Diamond',
    moissanite: 'Moissanite',
    lab_grown_sapphire: 'Lab Grown Sapphire',
  }
  return labels[type] ?? type
}
