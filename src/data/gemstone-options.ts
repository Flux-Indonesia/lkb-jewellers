// Gemstone configuration options for the Ring Builder
// Based on Cullen Jewellery's "Your Gemstone" section

export interface StoneTypeOption {
  value: string
  label: string
  description: string
  badge?: string
}

export interface ClarityOption {
  value: string
  label: string
  description: string
}

export interface CaratRangeOption {
  value: string
  label: string
  minCarat: number
  maxCarat: number
}

export interface ColourOption {
  value: string
  label: string
  description: string
}

export interface RecommendedGemstone {
  id: string
  type: string
  carat: number
  clarity: string
  colour: string
  dimensions: string
  price: number
  currency: string
  imageUrl: string
  badge?: string
}

export interface GemstoneConfig {
  stoneTypes: StoneTypeOption[]
  clarityOptions: ClarityOption[]
  caratRanges: CaratRangeOption[]
  colourOptions: ColourOption[]
}

export const stoneTypes: StoneTypeOption[] = [
  {
    value: 'lab_grown_diamond',
    label: 'Lab Grown Diamond',
    description: 'Chemically identical to natural diamonds, sustainably created in a laboratory',
    badge: 'Carbon Neutral',
  },
  {
    value: 'natural_diamond',
    label: 'Natural Diamond',
    description: 'Naturally formed over billions of years, ethically sourced',
  },
  {
    value: 'lab_grown_sapphire',
    label: 'Lab Grown Sapphire',
    description: 'Vibrant lab-created sapphires in a range of colours',
    badge: 'Carbon Neutral',
  },
]

export const clarityOptions: ClarityOption[] = [
  {
    value: 'IF',
    label: 'IF',
    description: 'Internally Flawless — no inclusions visible under 10x magnification',
  },
  {
    value: 'VVS1',
    label: 'VVS1',
    description: 'Very Very Slightly Included 1 — minute inclusions, extremely difficult to see',
  },
  {
    value: 'VVS2',
    label: 'VVS2',
    description: 'Very Very Slightly Included 2 — minute inclusions, very difficult to see',
  },
  {
    value: 'VS1',
    label: 'VS1',
    description: 'Very Slightly Included 1 — minor inclusions, difficult to see under 10x',
  },
  {
    value: 'VS2',
    label: 'VS2',
    description: 'Very Slightly Included 2 — minor inclusions, somewhat easy to see under 10x',
  },
]

export const caratRanges: CaratRangeOption[] = [
  { value: '0.50-0.99', label: '0.50 – 0.99ct', minCarat: 0.50, maxCarat: 0.99 },
  { value: '1.00-1.49', label: '1.00 – 1.49ct', minCarat: 1.00, maxCarat: 1.49 },
  { value: '1.50-1.99', label: '1.50 – 1.99ct', minCarat: 1.50, maxCarat: 1.99 },
  { value: '2.00-2.24', label: '2.00 – 2.24ct', minCarat: 2.00, maxCarat: 2.24 },
  { value: '2.25-2.49', label: '2.25 – 2.49ct', minCarat: 2.25, maxCarat: 2.49 },
  { value: '2.50-2.99', label: '2.50 – 2.99ct', minCarat: 2.50, maxCarat: 2.99 },
  { value: '3.00+', label: '3.00ct+', minCarat: 3.00, maxCarat: 99 },
]

export const colourOptions: ColourOption[] = [
  { value: 'D', label: 'D', description: 'Absolutely colourless — the highest grade' },
  { value: 'E', label: 'E', description: 'Colourless — minute traces of colour detectable by experts' },
  { value: 'F', label: 'F', description: 'Colourless — slight colour detected by expert gemologist' },
  { value: 'G', label: 'G', description: 'Near colourless — colour noticeable when compared to higher grades' },
  { value: 'H', label: 'H', description: 'Near colourless — colour slightly detectable' },
]

export const gemstoneConfig: GemstoneConfig = {
  stoneTypes,
  clarityOptions,
  caratRanges,
  colourOptions,
}

// Sample recommended gemstones (representative data from Cullen Jewellery)
export const recommendedGemstones: RecommendedGemstone[] = [
  {
    id: 'lgd-1ct-vs1-d-oval',
    type: 'lab_grown_diamond',
    carat: 1.01,
    clarity: 'VS1',
    colour: 'D',
    dimensions: '6.5 x 4.5mm',
    price: 890,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/lab/1ct-vs1-d.jpg',
    badge: 'Carbon Neutral',
  },
  {
    id: 'lgd-1.5ct-vvs1-e-oval',
    type: 'lab_grown_diamond',
    carat: 1.51,
    clarity: 'VVS1',
    colour: 'E',
    dimensions: '7.5 x 5.5mm',
    price: 1290,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/lab/1.5ct-vvs1-e.jpg',
    badge: 'Carbon Neutral',
  },
  {
    id: 'lgd-2ct-vs2-f-oval',
    type: 'lab_grown_diamond',
    carat: 2.02,
    clarity: 'VS2',
    colour: 'F',
    dimensions: '8.5 x 6.5mm',
    price: 1890,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/lab/2ct-vs2-f.jpg',
    badge: 'Carbon Neutral',
  },
  {
    id: 'nat-1ct-vs1-g-oval',
    type: 'natural_diamond',
    carat: 1.02,
    clarity: 'VS1',
    colour: 'G',
    dimensions: '6.5 x 4.5mm',
    price: 3200,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/natural/1ct-vs1-g.jpg',
  },
  {
    id: 'nat-1.5ct-vvs1-f-oval',
    type: 'natural_diamond',
    carat: 1.51,
    clarity: 'VVS1',
    colour: 'F',
    dimensions: '7.5 x 5.5mm',
    price: 5800,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/natural/1.5ct-vvs1-f.jpg',
  },
  {
    id: 'lgd-2.5ct-if-d-oval',
    type: 'lab_grown_diamond',
    carat: 2.51,
    clarity: 'IF',
    colour: 'D',
    dimensions: '9.5 x 7mm',
    price: 2890,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/lab/2.5ct-if-d.jpg',
    badge: 'Carbon Neutral',
  },
  {
    id: 'lgd-3ct-vvs1-e-oval',
    type: 'lab_grown_diamond',
    carat: 3.01,
    clarity: 'VVS1',
    colour: 'E',
    dimensions: '10.5 x 7.5mm',
    price: 3990,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/lab/3ct-vvs1-e.jpg',
    badge: 'Carbon Neutral',
  },
  {
    id: 'lgs-1ct-vs1-blue',
    type: 'lab_grown_sapphire',
    carat: 1.00,
    clarity: 'VS1',
    colour: 'D',
    dimensions: '6.5 x 4.5mm',
    price: 390,
    currency: 'USD',
    imageUrl: 'https://media.cullenjewellery.com/cdn-cgi/image/width=400,height=400/products/diamonds/oval/sapphire/1ct-vs1-blue.jpg',
    badge: 'Carbon Neutral',
  },
]
