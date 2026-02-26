import { describe, it, expect } from 'vitest'
import { filterGemstones, parseCaratRange, formatGemstonePrice, getStoneTypeLabel } from '@/lib/gemstone-utils'
import type { RecommendedGemstone } from '@/data/gemstone-options'

const mockGemstones: RecommendedGemstone[] = [
  {
    id: 'lgd-1ct-vs1-d',
    type: 'lab_grown_diamond',
    carat: 1.01,
    clarity: 'VS1',
    colour: 'D',
    dimensions: '6.5 x 4.5mm',
    price: 890,
    currency: 'USD',
    imageUrl: 'https://example.com/gem1.jpg',
    badge: 'Carbon Neutral',
  },
  {
    id: 'lgd-1.5ct-vvs1-e',
    type: 'lab_grown_diamond',
    carat: 1.51,
    clarity: 'VVS1',
    colour: 'E',
    dimensions: '7.5 x 5.5mm',
    price: 1290,
    currency: 'USD',
    imageUrl: 'https://example.com/gem2.jpg',
  },
  {
    id: 'mois-1ct-vs1-d',
    type: 'moissanite',
    carat: 1.00,
    clarity: 'VS1',
    colour: 'D',
    dimensions: '6.5 x 4.5mm',
    price: 290,
    currency: 'USD',
    imageUrl: 'https://example.com/gem3.jpg',
    badge: 'Best Value',
  },
  {
    id: 'nat-1ct-vs1-g',
    type: 'natural_diamond',
    carat: 1.02,
    clarity: 'VS1',
    colour: 'G',
    dimensions: '6.5 x 4.5mm',
    price: 3200,
    currency: 'USD',
    imageUrl: 'https://example.com/gem4.jpg',
  },
  {
    id: 'lgd-3ct-vvs1-e',
    type: 'lab_grown_diamond',
    carat: 3.01,
    clarity: 'VVS1',
    colour: 'E',
    dimensions: '10.5 x 7.5mm',
    price: 3990,
    currency: 'USD',
    imageUrl: 'https://example.com/gem5.jpg',
  },
]

describe('filterGemstones', () => {
  it('returns all gemstones when no filters are active', () => {
    const result = filterGemstones(mockGemstones, {})
    expect(result).toHaveLength(5)
  })

  it('filters by stone type correctly', () => {
    const result = filterGemstones(mockGemstones, { stoneType: 'lab_grown_diamond' })
    expect(result).toHaveLength(3)
    expect(result.every(g => g.type === 'lab_grown_diamond')).toBe(true)
  })

  it('filters by clarity correctly', () => {
    const result = filterGemstones(mockGemstones, { clarity: 'VS1' })
    expect(result).toHaveLength(3)
    expect(result.every(g => g.clarity === 'VS1')).toBe(true)
  })

  it('filters by colour correctly', () => {
    const result = filterGemstones(mockGemstones, { colour: 'D' })
    expect(result).toHaveLength(2)
    expect(result.every(g => g.colour === 'D')).toBe(true)
  })

  it('filters by carat range correctly (1.00-1.49)', () => {
    const result = filterGemstones(mockGemstones, { caratRange: '1.00-1.49' })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(g => g.carat >= 1.00 && g.carat <= 1.49)).toBe(true)
  })

  it('filters by carat range correctly (3.00+)', () => {
    const result = filterGemstones(mockGemstones, { caratRange: '3.00+' })
    expect(result).toHaveLength(1)
    expect(result[0].carat).toBeGreaterThanOrEqual(3.00)
  })

  it('uses AND logic for combined filters', () => {
    const result = filterGemstones(mockGemstones, {
      stoneType: 'lab_grown_diamond',
      clarity: 'VVS1',
    })
    expect(result).toHaveLength(2)
    expect(result.every(g => g.type === 'lab_grown_diamond' && g.clarity === 'VVS1')).toBe(true)
  })

  it('returns empty array when no gemstones match', () => {
    const result = filterGemstones(mockGemstones, { stoneType: 'lab_grown_sapphire' })
    expect(result).toHaveLength(0)
  })
})

describe('parseCaratRange', () => {
  it('parses range with min and max', () => {
    const result = parseCaratRange('1.00-1.49')
    expect(result.min).toBe(1.00)
    expect(result.max).toBe(1.49)
  })

  it('parses open-ended range with +', () => {
    const result = parseCaratRange('3.00+')
    expect(result.min).toBe(3.00)
    expect(result.max).toBe(Infinity)
  })
})

describe('formatGemstonePrice', () => {
  it('formats USD price correctly', () => {
    const result = formatGemstonePrice(890, 'USD')
    expect(result).toContain('890')
    expect(result).toContain('$')
  })

  it('formats large price without decimals', () => {
    const result = formatGemstonePrice(3200, 'USD')
    expect(result).toContain('3,200')
  })
})

describe('getStoneTypeLabel', () => {
  it('returns correct label for lab_grown_diamond', () => {
    expect(getStoneTypeLabel('lab_grown_diamond')).toBe('Lab Grown Diamond')
  })

  it('returns correct label for moissanite', () => {
    expect(getStoneTypeLabel('moissanite')).toBe('Moissanite')
  })

  it('returns the type itself for unknown types', () => {
    expect(getStoneTypeLabel('unknown_type')).toBe('unknown_type')
  })
})
