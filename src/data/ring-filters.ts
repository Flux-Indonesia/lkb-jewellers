// Ring filter options for the engagement rings listing page
// Matches Cullen Jewellery filter categories

export type ShapeValue = 'round' | 'oval' | 'emerald' | 'radiant' | 'pear' | 'cushion' | 'elongated_cushion' | 'elongated_hexagon' | 'marquise' | 'princess' | 'asscher'
export type MetalValue = 'platinum' | 'yellow_gold' | 'rose_gold' | 'white_gold' | '9k_yellow_gold' | '9k_white_gold' | '9k_rose_gold' | 'palladium'
export type SettingStyleValue = 'trilogy' | 'solitaire' | 'halo' | 'toi_et_moi' | 'bezel' | 'east_west'
export type BandTypeValue = 'plain' | 'pave' | 'accents'
export type SettingProfileValue = 'high_set' | 'low_set'

export interface FilterOption<T extends string = string> {
  value: T
  label: string
  description?: string
  svgPath?: string
}

export interface ShapeOption extends FilterOption<ShapeValue> {
  svgPath: string
}

export interface MetalOption extends FilterOption<MetalValue> {
  color: string
  secondaryColor?: string
}

export const shapeOptions: ShapeOption[] = [
  {
    value: 'round',
    label: 'Round',
    description: 'Classic and timeless, the most popular diamond shape',
    svgPath: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z',
  },
  {
    value: 'oval',
    label: 'Oval',
    description: 'Elongated shape that makes fingers appear longer',
    svgPath: 'M12 3C7.5 3 4 7 4 12s3.5 9 8 9 8-4 8-9-3.5-9-8-9z',
  },
  {
    value: 'emerald',
    label: 'Emerald',
    description: 'Rectangular step-cut with elegant hall-of-mirrors effect',
    svgPath: 'M5 7h14v10H5z M3 9l2-2 M3 15l2 2 M21 9l-2-2 M21 15l-2 2',
  },
  {
    value: 'radiant',
    label: 'Radiant',
    description: 'Rectangular with brilliant-cut facets for maximum sparkle',
    svgPath: 'M6 6h12v12H6z M4 8l2-2 M4 16l2 2 M20 8l-2-2 M20 16l-2 2',
  },
  {
    value: 'pear',
    label: 'Pear',
    description: 'Teardrop shape combining round and marquise cuts',
    svgPath: 'M12 3C9 3 6 6 6 10c0 4 2.5 7 6 9 3.5-2 6-5 6-9 0-4-3-7-6-7z',
  },
  {
    value: 'cushion',
    label: 'Cushion',
    description: 'Square with rounded corners, vintage-inspired brilliance',
    svgPath: 'M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  },
  {
    value: 'elongated_cushion',
    label: 'Elongated Cushion',
    description: 'Rectangular cushion with soft rounded corners',
    svgPath: 'M6 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  },
  {
    value: 'elongated_hexagon',
    label: 'Elongated Hexagon',
    description: 'Unique hexagonal shape with modern geometric appeal',
    svgPath: 'M8 4l8 0 4 7-4 7-8 0-4-7z',
  },
  {
    value: 'marquise',
    label: 'Marquise',
    description: 'Boat-shaped cut that maximizes carat weight appearance',
    svgPath: 'M12 3L20 12 12 21 4 12z',
  },
  {
    value: 'princess',
    label: 'Princess',
    description: 'Square brilliant cut with exceptional fire and sparkle',
    svgPath: 'M6 6h12v12H6z',
  },
  {
    value: 'asscher',
    label: 'Asscher',
    description: 'Square step-cut with distinctive windmill pattern',
    svgPath: 'M7 7h10v10H7z M5 9l2-2 M5 15l2 2 M19 9l-2-2 M19 15l-2 2',
  },
]

export const metalOptions: MetalOption[] = [
  {
    value: 'platinum',
    label: 'Platinum',
    description: 'Rare, durable, and naturally white metal',
    color: '#E8E8E8',
  },
  {
    value: 'palladium',
    label: 'Palladium',
    description: 'Lightweight, hypoallergenic white metal',
    color: '#CED0CE',
  },
  {
    value: 'yellow_gold',
    label: '18K Yellow Gold',
    description: 'Classic warm gold in 18k purity',
    color: '#D4AF37',
  },
  {
    value: 'rose_gold',
    label: '18K Rose Gold',
    description: 'Romantic blush-toned 18k gold',
    color: '#B76E79',
  },
  {
    value: 'white_gold',
    label: '18K White Gold',
    description: 'Bright white 18k gold with rhodium plating',
    color: '#D0D0D0',
  },
  {
    value: '9k_yellow_gold',
    label: '9K Yellow Gold',
    description: 'Classic warm gold in 9k purity',
    color: '#D4AF37',
  },
  {
    value: '9k_white_gold',
    label: '9K White Gold',
    description: 'Bright white 9k gold',
    color: '#D0D0D0',
  },
  {
    value: '9k_rose_gold',
    label: '9K Rose Gold',
    description: 'Romantic blush-toned 9k gold',
    color: '#B76E79',
  },
]

export const settingStyleOptions: FilterOption<SettingStyleValue>[] = [
  {
    value: 'trilogy',
    label: 'Trilogy',
    description: 'Three stones representing past, present, and future',
    // Three stones (center largest) above a band
    svgPath: 'M7 9 a5 5 0 0 1 10 0 a5 5 0 0 1-10 0 M3 15 a3 3 0 0 1 6 0 a3 3 0 0 1-6 0 M15 15 a3 3 0 0 1 6 0 a3 3 0 0 1-6 0 M2 21h20',
  },
  {
    value: 'solitaire',
    label: 'Solitaire',
    description: 'Single centre stone for timeless elegance',
    // Single stone above a band
    svgPath: 'M7 9 a5 5 0 0 1 10 0 a5 5 0 0 1-10 0 M4 19h16',
  },
  {
    value: 'halo',
    label: 'Halo',
    description: 'Centre stone surrounded by a halo of smaller diamonds',
    // Two concentric circles (halo + stone) above a band
    svgPath: 'M4 10 a8 8 0 0 1 16 0 a8 8 0 0 1-16 0 M7 10 a5 5 0 0 1 10 0 a5 5 0 0 1-10 0 M4 21h16',
  },
  {
    value: 'toi_et_moi',
    label: 'Toi et Moi',
    description: 'Two stones representing two souls united',
    // Round stone + vertical oval stone side by side above a band
    svgPath: 'M3 12 a4 4 0 0 1 8 0 a4 4 0 0 1-8 0 M13 12 a4 5.5 0 0 1 8 0 a4 5.5 0 0 1-8 0 M2 20h20',
  },
  {
    value: 'bezel',
    label: 'Bezel',
    description: 'Stone encircled by a metal rim for modern protection',
    // Rounded rectangle bezel frame with stone inside
    svgPath: 'M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M8.5 12 a3.5 3.5 0 0 1 7 0 a3.5 3.5 0 0 1-7 0',
  },
  {
    value: 'east_west',
    label: 'East West',
    description: 'Stone set horizontally for a contemporary look',
    // Horizontal wide ellipse above a band
    svgPath: 'M4 11 a8 5 0 0 1 16 0 a8 5 0 0 1-16 0 M4 20h16',
  },
]

export const bandTypeOptions: FilterOption<BandTypeValue>[] = [
  {
    value: 'plain',
    label: 'Plain',
    description: 'Clean, smooth band for understated elegance',
    // Two clean parallel horizontal lines (band cross-section)
    svgPath: 'M3 9h18 M3 15h18',
  },
  {
    value: 'pave',
    label: 'Pavé',
    description: 'Band set with small diamonds for extra sparkle',
    // Two parallel lines with diamond zigzag pattern between (pavé stones)
    svgPath: 'M3 9h18 M3 15h18 M6 12 l2,-2 l2,2 l2,-2 l2,2 l2,-2 l2,2',
  },
  {
    value: 'accents',
    label: 'Accents',
    description: 'Band with accent stones for added detail',
    // Two parallel lines with accent diamond shapes on band
    svgPath: 'M3 10h18 M3 14h18 M5 12 l2,-2 l2,2 l-2,2 l-2,-2 z M15 12 l2,-2 l2,2 l-2,2 l-2,-2 z',
  },
]

export const settingProfileOptions: FilterOption<SettingProfileValue>[] = [
  {
    value: 'high_set',
    label: 'High Set',
    description: 'Stone elevated above the band for maximum light exposure',
    // Stone high above band, long prongs
    svgPath: 'M4 20h16 M9 20 L8 11 M15 20 L16 11 M8 8 a4 4 0 0 1 8 0 a4 4 0 0 1-8 0',
  },
  {
    value: 'low_set',
    label: 'Low Set',
    description: 'Stone sits closer to the band for a sleek profile',
    // Stone close to band, short prongs
    svgPath: 'M4 20h16 M9 20 L8.5 16 M15 20 L15.5 16 M8 13 a4 4 0 0 1 8 0 a4 4 0 0 1-8 0',
  },
]

export interface AllFilterOptions {
  shapes: ShapeOption[]
  metals: MetalOption[]
  settingStyles: FilterOption<SettingStyleValue>[]
  bandTypes: FilterOption<BandTypeValue>[]
  settingProfiles: FilterOption<SettingProfileValue>[]
}

export const allFilterOptions: AllFilterOptions = {
  shapes: shapeOptions,
  metals: metalOptions,
  settingStyles: settingStyleOptions,
  bandTypes: bandTypeOptions,
  settingProfiles: settingProfileOptions,
}
