import { describe, it, expect } from 'vitest'
import { filterRings, parseFiltersFromURL, filtersToURL, hasActiveFilters, clearFilters } from '@/lib/ring-filters'
import type { Ring } from '@/data/engagement-rings'

// Mock ring data for testing
const mockRings: Ring[] = [
  {
    id: 'ring-sheridan',
    slug: 'ring-sheridan',
    name: 'Sheridan',
    title: 'Sheridan - Oval 4 Claw Solitaire',
    description: 'Test description',
    basePrice: 1852,
    currency: 'USD',
    images: ['https://example.com/img1.jpg'],
    thumbnails: ['https://example.com/thumb1.jpg'],
    metalOptions: ['Platinum', '18k Yellow Gold', '18k Rose Gold', '18k White Gold'],
    settingOptions: ['High Setting', 'Low Setting'],
    sideStonesOptions: ['Lab Grown Diamond'],
    ringSizes: ['D', 'E', 'F', 'G', 'H'],
    specs: { bandWidth: '1.5mm' },
    shape: 'oval',
    settingStyle: 'solitaire',
    bandType: 'plain',
    settingProfile: 'high_set',
  },
  {
    id: 'ring-emma',
    slug: 'ring-emma',
    name: 'Emma',
    title: 'Emma - Classic Oval 4 Claw Solitaire with Hidden Halo',
    description: 'Test description',
    basePrice: 1626,
    currency: 'USD',
    images: ['https://example.com/img2.jpg'],
    thumbnails: ['https://example.com/thumb2.jpg'],
    metalOptions: ['Platinum', '18k Yellow Gold'],
    settingOptions: ['High Setting'],
    sideStonesOptions: ['Lab Grown Diamond'],
    ringSizes: ['D', 'E', 'F'],
    specs: { bandWidth: '1.5mm' },
    shape: 'oval',
    settingStyle: 'halo',
    bandType: 'pave',
    settingProfile: 'high_set',
  },
  {
    id: 'ring-francesca',
    slug: 'ring-francesca',
    name: 'Francesca',
    title: 'Francesca - Pear and Pear Claw Toi et Moi',
    description: 'Test description',
    basePrice: 1788,
    currency: 'USD',
    images: ['https://example.com/img3.jpg'],
    thumbnails: ['https://example.com/thumb3.jpg'],
    metalOptions: ['18k Rose Gold', '18k White Gold'],
    settingOptions: ['High Setting'],
    sideStonesOptions: ['Lab Grown Diamond'],
    ringSizes: ['D', 'E', 'F'],
    specs: { bandWidth: '1.5mm' },
    shape: 'pear',
    settingStyle: 'toi_et_moi',
    bandType: 'plain',
    settingProfile: 'high_set',
  },
  {
    id: 'ring-daisy',
    slug: 'ring-daisy',
    name: 'Daisy',
    title: 'Daisy - Classic Oval 4 Claw Solitaire',
    description: 'Test description',
    basePrice: 1301,
    currency: 'USD',
    images: ['https://example.com/img4.jpg'],
    thumbnails: ['https://example.com/thumb4.jpg'],
    metalOptions: ['Platinum', '18k Yellow Gold', '18k Rose Gold'],
    settingOptions: ['Low Setting'],
    sideStonesOptions: ['Lab Grown Diamond'],
    ringSizes: ['D', 'E', 'F'],
    specs: { bandWidth: '1.5mm' },
    shape: 'oval',
    settingStyle: 'solitaire',
    bandType: 'plain',
    settingProfile: 'low_set',
  },
]

describe('filterRings', () => {
  it('returns all rings when no filters are active', () => {
    const result = filterRings(mockRings, {})
    expect(result).toHaveLength(4)
  })

  it('filters by shape correctly', () => {
    const result = filterRings(mockRings, { shape: 'oval' })
    expect(result).toHaveLength(3)
    expect(result.every(r => r.shape === 'oval')).toBe(true)
  })

  it('filters by settingStyle correctly', () => {
    const result = filterRings(mockRings, { settingStyle: 'solitaire' })
    expect(result).toHaveLength(2)
    expect(result.every(r => r.settingStyle === 'solitaire')).toBe(true)
  })

  it('filters by bandType correctly', () => {
    const result = filterRings(mockRings, { bandType: 'pave' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Emma')
  })

  it('filters by settingProfile correctly', () => {
    const result = filterRings(mockRings, { settingProfile: 'low_set' })
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Daisy')
  })

  it('filters by metal correctly (yellow_gold)', () => {
    const result = filterRings(mockRings, { metal: 'yellow_gold' })
    // Sheridan, Emma, Daisy have 18k Yellow Gold
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(r => r.metalOptions.some(m => m.includes('Yellow Gold')))).toBe(true)
  })

  it('uses AND logic for multiple filters', () => {
    const result = filterRings(mockRings, { shape: 'oval', settingStyle: 'solitaire' })
    expect(result).toHaveLength(2)
    expect(result.every(r => r.shape === 'oval' && r.settingStyle === 'solitaire')).toBe(true)
  })

  it('returns empty array when no rings match filters', () => {
    const result = filterRings(mockRings, { shape: 'heart' })
    expect(result).toHaveLength(0)
  })

  it('returns empty array for invalid filter value', () => {
    const result = filterRings(mockRings, { shape: 'nonexistent' as never })
    expect(result).toHaveLength(0)
  })
})

describe('parseFiltersFromURL', () => {
  it('parses empty search params to empty filters', () => {
    const params = new URLSearchParams()
    const result = parseFiltersFromURL(params)
    expect(result).toEqual({})
  })

  it('parses shape from URL correctly', () => {
    const params = new URLSearchParams('shape=oval')
    const result = parseFiltersFromURL(params)
    expect(result.shape).toBe('oval')
  })

  it('parses multiple filters from URL', () => {
    const params = new URLSearchParams('shape=oval&settingStyle=solitaire&metal=platinum')
    const result = parseFiltersFromURL(params)
    expect(result.shape).toBe('oval')
    expect(result.settingStyle).toBe('solitaire')
    expect(result.metal).toBe('platinum')
  })

  it('ignores unknown URL params', () => {
    const params = new URLSearchParams('shape=oval&unknown=value')
    const result = parseFiltersFromURL(params)
    expect(result.shape).toBe('oval')
    expect((result as Record<string, unknown>).unknown).toBeUndefined()
  })
})

describe('filtersToURL', () => {
  it('returns empty string for empty filters', () => {
    const result = filtersToURL({})
    expect(result).toBe('')
  })

  it('serializes single filter correctly', () => {
    const result = filtersToURL({ shape: 'oval' })
    expect(result).toBe('?shape=oval')
  })

  it('serializes multiple filters correctly', () => {
    const result = filtersToURL({ shape: 'oval', settingStyle: 'solitaire' })
    expect(result).toContain('shape=oval')
    expect(result).toContain('settingStyle=solitaire')
    expect(result.startsWith('?')).toBe(true)
  })

  it('skips undefined values', () => {
    const result = filtersToURL({ shape: 'oval', metal: undefined })
    expect(result).toBe('?shape=oval')
    expect(result).not.toContain('metal')
  })
})

describe('parseFiltersFromURL + filtersToURL roundtrip', () => {
  it('preserves filter state through roundtrip', () => {
    const original = { shape: 'oval', settingStyle: 'solitaire', metal: 'platinum' }
    const url = filtersToURL(original)
    const params = new URLSearchParams(url.replace('?', ''))
    const parsed = parseFiltersFromURL(params)
    expect(parsed.shape).toBe(original.shape)
    expect(parsed.settingStyle).toBe(original.settingStyle)
    expect(parsed.metal).toBe(original.metal)
  })
})

describe('hasActiveFilters', () => {
  it('returns false for empty filters', () => {
    expect(hasActiveFilters({})).toBe(false)
  })

  it('returns true when any filter is set', () => {
    expect(hasActiveFilters({ shape: 'oval' })).toBe(true)
  })
})

describe('clearFilters', () => {
  it('returns empty filters object', () => {
    expect(clearFilters()).toEqual({})
  })
})
