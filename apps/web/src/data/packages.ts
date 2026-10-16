export type PackageItem = {
  name: string
  detail: string
  original_2019_lkr: number
  updated_2026_lkr: number
}

export type DecoCartPackage = {
  id: string
  slug: 'budget' | 'silver' | 'gold' | 'platinum'
  title: string
  badge?: string
  tagline: string
  base_price_lkr: number
  base_price_usd: number
  original_2019_price_lkr: number
  guests: string
  cake: string
  flowers: string
  decorations: string
  food_and_beverages?: string
  entertainment_and_media: string
  features: string[]
  itemized_breakdown: PackageItem[]
  popular?: boolean
  highlight?: string
}

export const DECOCART_PACKAGES: DecoCartPackage[] = [
  {
    id: 'pkg-budget',
    slug: 'budget',
    title: 'Budget Package',
    badge: 'Essential',
    tagline: 'The classic midnight or daytime surprise with fresh cake, floral bouquet & birthday balloons.',
    base_price_lkr: 18500,
    base_price_usd: 60,
    original_2019_price_lkr: 7900,
    guests: '1 – 5 people',
    cake: '1 kg Chocolate Cake with custom celebration message',
    flowers: '1 Fresh Flower Bunch (Fresh Red Roses & Daisies)',
    decorations: 'Birthday Balloons styling & creative birthday photo props pack',
    entertainment_and_media: 'Personalized celebration soundtrack setup & arrival reaction photo',
    highlight: 'Stealth 12:00 AM delivery option available across Western Province',
    features: [
      '1 kg Handcrafted Chocolate Cake',
      '1 Fresh Flower Bunch (Roses + Daisies)',
      'Themed Birthday Balloons & Ribbon Deco',
      'Birthday Props & Celebration Hats',
      'Stealth Setup & Arrival Coordination',
      'Digital Reaction Photo delivered within 2 hours',
    ],
    itemized_breakdown: [
      { name: '1 kg Cake (Chocolate)', detail: 'Freshly baked chocolate cake with personalized lettering', original_2019_lkr: 2500, updated_2026_lkr: 6500 },
      { name: '1 Flower Bunch', detail: 'Fresh bouquet of roses and daisies with wrapping', original_2019_lkr: 1900, updated_2026_lkr: 4500 },
      { name: 'Birthday Balloons & Deco', detail: 'Colour-themed celebration balloons & ribbon styling', original_2019_lkr: 1000, updated_2026_lkr: 2500 },
      { name: 'Birthday Props', detail: 'Party photo props, noisemakers, blowouts & party hats', original_2019_lkr: 500, updated_2026_lkr: 1500 },
      { name: 'Service Charge & Logistics', detail: 'Stealth planning, delivery coordination & arrival execution', original_2019_lkr: 2000, updated_2026_lkr: 3500 },
    ],
  },
  {
    id: 'pkg-silver',
    slug: 'silver',
    title: 'Silver Package',
    badge: 'Party Favourite',
    tagline: 'Deluxe celebration with 1.5kg chocolate nugget cake, large floral bouquet & catering for 15 guests.',
    base_price_lkr: 32500,
    base_price_usd: 105,
    original_2019_price_lkr: 12900,
    guests: 'Up to 15 guests',
    cake: '1.5 kg Chocolate Cake topped with chocolate nuggets & rich ganache',
    flowers: "Large Flower Bunch (Red Roses & Baby's-breath)",
    decorations: 'Deluxe Birthday Balloons styling, streamers & props',
    food_and_beverages: 'Catering for 15 people: 2 varieties of savory short-eats + 2 refreshing beverages',
    entertainment_and_media: 'Sound system coordination, celebration music & high-res reaction photos',
    highlight: 'Includes full party refreshments & food for 15 guests',
    features: [
      '1.5 kg Chocolate Cake with crunchy nuggets',
      "Large Red Roses & Baby's-breath Floral Bouquet",
      'Deluxe Balloons & Room Decoration setup',
      'Birthday Photo Props & Party Hats',
      'Food & Beverages for 15 People (2 short eats + 2 beverages)',
      'Service charge & stealth event coordination included',
    ],
    itemized_breakdown: [
      { name: '1.5 kg Cake (Chocolate with nuggets)', detail: 'Decadent chocolate cake loaded with chocolate nuggets', original_2019_lkr: 3100, updated_2026_lkr: 9000 },
      { name: 'Large Flower Bunch', detail: "Fresh premium red roses paired with delicate baby's-breath", original_2019_lkr: 2800, updated_2026_lkr: 7000 },
      { name: 'Birthday Balloons & Deco', detail: 'Full room balloon clusters, streamers & banners', original_2019_lkr: 1500, updated_2026_lkr: 3500 },
      { name: 'Birthday Props', detail: 'Curated photo booth props & celebration accessories', original_2019_lkr: 500, updated_2026_lkr: 1500 },
      { name: 'Food & Beverages for 15 people', detail: '2 types of premium short-eats and 2 types of chilled beverages', original_2019_lkr: 3000, updated_2026_lkr: 7500 },
      { name: 'Service Charge & Event Crew', detail: 'On-site party arrangement & surprise execution', original_2019_lkr: 2000, updated_2026_lkr: 4000 },
    ],
  },
  {
    id: 'pkg-gold',
    slug: 'gold',
    title: 'Gold Package',
    badge: 'Most Popular',
    popular: true,
    tagline: 'Brownie cake with fresh strawberries, exotic lilies, catering for 20 & 1-day videography + photo booth.',
    base_price_lkr: 58000,
    base_price_usd: 190,
    original_2019_price_lkr: 23900,
    guests: 'Up to 20 guests',
    cake: '1.5 kg Chocolate Brownie Cake with fresh strawberries & floral cake decor',
    flowers: "Large Flower Bunch (Red Roses, Lily of the Incas & Baby's-breath) + Cake floral styling",
    decorations: 'Theme balloon arch, centerpieces, ceiling streamers, table ensemble & photo props',
    food_and_beverages: 'Catering for 20 people: 2 varieties of artisan short-eats + 2 varieties of beverages',
    entertainment_and_media: 'Special 1-Day Videography & Photo Booth setup with 12-hour edited highlight reel',
    highlight: 'Includes 12-hour edited videography highlight reel to gift on the same day',
    features: [
      '1.5 kg Gourmet Brownie Cake with Fresh Strawberries',
      'Fresh Floral Cake Dressing & Topper',
      'Exotic Floral Bouquet (Roses + Lily of the Incas + Baby’s-breath)',
      'Food & Beverages for 20 People (2 short eats + 2 beverages)',
      'Special 1-Day Videography & Photo Booth setup',
      'Edited Highlight Video delivered within 12 hours',
      'Complete Theme Balloons & Birthday Props Package',
      'Dedicated Event Planner & Logistics Support',
    ],
    itemized_breakdown: [
      { name: '1.5 kg Brownie Cake with Strawberries', detail: 'Artisan chocolate brownies with fresh strawberries & floral deco', original_2019_lkr: 4500, updated_2026_lkr: 12000 },
      { name: 'Large Exotic Flower Bunch + Cake Deco', detail: "Red roses, Lily of the Incas, baby's-breath & edible floral styling", original_2019_lkr: 4000, updated_2026_lkr: 9500 },
      { name: 'Birthday Balloons & Theme Deco', detail: 'Balloon pillars, centerpieces, streamers & table runners', original_2019_lkr: 1500, updated_2026_lkr: 4000 },
      { name: 'Birthday Props & Favors', detail: 'Deluxe party favor bags, photo props & personalized door sign', original_2019_lkr: 500, updated_2026_lkr: 2000 },
      { name: 'Food & Beverages for 20 people', detail: 'Gourmet short-eats (savory & sweet) + mocktails / fresh juice', original_2019_lkr: 3800, updated_2026_lkr: 10500 },
      { name: 'Videography & Photo Booth (1-Day)', detail: 'Professional camera crew + edited celebration video in <12 hours', original_2019_lkr: 8000, updated_2026_lkr: 15000 },
      { name: 'Service Charge & Expert Coordination', detail: 'Lead event director & operational crew handling setup to cleanup', original_2019_lkr: 1600, updated_2026_lkr: 5000 },
    ],
  },
  {
    id: 'pkg-platinum',
    slug: 'platinum',
    title: 'Platinum Package',
    badge: 'Ultimate VIP',
    tagline: 'The full DecoCart experience: Brownie cake, soft toy, catering for 20, videography & a 6-person surprise dance flash mob!',
    base_price_lkr: 89000,
    base_price_usd: 290,
    original_2019_price_lkr: 30900,
    guests: 'Up to 20+ guests / Large Venue',
    cake: '1.5 kg Chocolate Brownie Cake with fresh strawberries & luxury floral dressing',
    flowers: "Luxury Flower Bunch (Red Roses, Lily of the Incas & Baby's-breath) + Premium Soft Toy",
    decorations: 'Full venue transformation: Mylar balloons, helium bouquets, personalized banner & custom props',
    food_and_beverages: 'Catering for 20 people: 2 gourmet short-eats + 2 refreshing beverages',
    entertainment_and_media: 'Special 1-Day Videography & Photo Booth + Surprise Dance Crew (06 professional dancers)',
    highlight: 'Live 6-person flash mob dance crew performance to shock & delight your loved one!',
    features: [
      '1.5 kg Gourmet Brownie Cake with Fresh Strawberries & Florals',
      'Luxury Flower Bouquet + Premium Cuddly Soft Toy Gift',
      'Surprise Dance Crew (06 Professional Performers / Flash Mob)',
      'Special 1-Day Cinematic Videography & Photo Booth',
      'Same-Day Edited 4K Video Reel (delivered within 12 hours)',
      'Food & Beverages for 20 Guests (2 short eats + 2 beverages)',
      'Full Venue Styling: Helium Balloons, Mylar Accents & Props',
      'Personalized Celebration Banner & Souvenir Keepsake',
      'Senior Operations Manager On-Site Coordination',
    ],
    itemized_breakdown: [
      { name: '1.5 kg Brownie Cake with Strawberries', detail: 'Signature double chocolate brownie cake with strawberries & floral art', original_2019_lkr: 4500, updated_2026_lkr: 12000 },
      { name: 'Luxury Flower Bunch + Soft Toy + Cake Flowers', detail: 'Grand bouquet (roses, lilies, baby’s-breath) + premium plush toy', original_2019_lkr: 5000, updated_2026_lkr: 12500 },
      { name: 'Birthday Balloons & Full Venue Deco', detail: 'Helium bundles, mylar foil balloons, streamers & custom banner', original_2019_lkr: 1500, updated_2026_lkr: 4500 },
      { name: 'Birthday Props & Favors', detail: 'Party favors, take-home treats, masks, photo props & table ensemble', original_2019_lkr: 500, updated_2026_lkr: 2500 },
      { name: 'Food & Beverages for 20 people', detail: 'High-tea style short-eats & refreshing mocktails / beverages', original_2019_lkr: 3800, updated_2026_lkr: 10500 },
      { name: 'Videography & Photo Booth (1-Day)', detail: 'Professional videographer, photo booth backdrop & 12h video cut', original_2019_lkr: 8000, updated_2026_lkr: 15000 },
      { name: 'Surprise Dance Crew (06 dancers)', detail: 'Choreographed surprise flash-mob performance by professional dancers', original_2019_lkr: 6000, updated_2026_lkr: 26000 },
      { name: 'Executive Event Management & Logistics', detail: 'Full-service management, transportation of crew & instruments', original_2019_lkr: 1600, updated_2026_lkr: 6500 },
    ],
  },
]

export function getPackageBySlug(slug: string): DecoCartPackage | undefined {
  return DECOCART_PACKAGES.find((pkg) => pkg.slug === slug.toLowerCase())
}
