import type { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-no-1',
    slug: 'no-1-slim-wallet',
    name: 'No. 1 Slim Wallet',
    description: 'Constructed from a single piece of full-grain vegetable-tanned leather, the No. 1 requires no breaking-in period — it arrives already supple, already yours. Six cards. Two slip pockets. A profile so slim it disappears into your jacket pocket. This is the wallet as it should have always been made.',
    price_cents: 29500,
    currency: 'PKR',
    images: [
      { url: '/wallet_main.jpg', alt: 'No. 1 Slim Wallet — Espresso, front view on dark surface' },
      { url: '/wallet_open.png', alt: 'No. 1 Slim Wallet — open, showing card capacity' }
    ],
    material: 'Full-grain vegetable-tanned leather, linen thread edge stitching, burnished natural edge',
    dimensions: { width_mm: 95, height_mm: 72, depth_mm: 6.2 },
    card_capacity: 6,
    is_active: true,
    is_sold_out: false,
    display_order: 0,
    collection_id: null,
    created_at: '2026-05-30T00:00:00Z'
  },
  {
    id: 'mock-pluto',
    slug: 'pluto',
    name: 'The Pluto Bi-Fold',
    description: 'Combining a clean bi-fold shape with rich leather tone, Pluto brings ease and elegance to your essentials. Lightweight yet sturdy, it delivers the kind of dependability and class you expect from a quality men’s wallet.',
    price_cents: 16500,
    currency: 'PKR',
    images: [
      { url: '/pluto-1.png', alt: 'The Pluto Bi-Fold — Premium brown leather, upright view' },
      { url: '/pluto-2.png', alt: 'The Pluto Bi-Fold — Premium open layout displaying cards' }
    ],
    material: 'Premium full-grain vegetable-tanned leather with soft satin lining',
    dimensions: { width_mm: 110, height_mm: 90, depth_mm: 12.0 },
    card_capacity: 8,
    is_active: true,
    is_sold_out: false,
    display_order: 1,
    collection_id: null,
    created_at: '2026-05-30T00:01:00Z'
  },
  {
    id: 'mock-holly',
    slug: 'holly',
    name: 'The Holly Compact',
    description: 'Soft yet structured, Holly is a compact wallet built for daily function. The vegetable tanned leather construction offers durability, while the simple bi-fold format keeps your card and cash safe. Among the most trusted wallets, Holly fits neatly into any pocket.',
    price_cents: 14500,
    currency: 'PKR',
    images: [
      { url: '/holly-1.png', alt: 'The Holly Compact — Geneva Brown front view' },
      { url: '/holly-2.png', alt: 'The Holly Compact — open view with card storage' }
    ],
    material: 'Full-grain vegetable-tanned leather, heavy-duty waxed nylon stitching',
    dimensions: { width_mm: 105, height_mm: 80, depth_mm: 10.0 },
    card_capacity: 6,
    is_active: true,
    is_sold_out: false,
    display_order: 2,
    collection_id: null,
    created_at: '2026-05-30T00:02:00Z'
  },
  {
    id: 'mock-rio',
    slug: 'rio',
    name: 'The Rio Symmetrical',
    description: 'Sleek and symmetrical, the Rio wallet adds structure to your everyday with a premium finish and hidden interior coin pocket. Built from durable leather, this timeless wallet is crafted for those who appreciate fine details and everyday dependability.',
    price_cents: 19500,
    currency: 'PKR',
    images: [
      { url: '/rio-1.png', alt: 'The Rio Symmetrical — Geneva Brown standing front view' },
      { url: '/rio-2.png', alt: 'The Rio Symmetrical — internal layout and card slots' }
    ],
    material: 'Durable top-tier aniline leather, hand-burnished edges, internal coin pocket lining',
    dimensions: { width_mm: 115, height_mm: 95, depth_mm: 14.0 },
    card_capacity: 8,
    is_active: true,
    is_sold_out: false,
    display_order: 3,
    collection_id: null,
    created_at: '2026-05-30T00:03:00Z'
  },
  {
    id: 'mock-magic',
    slug: 'magic',
    name: 'The Magic Folding Wallet',
    description: 'The Magic wallet series reimagines how you carry – with innovating folding, German-engineered elastic, and dual slot compartments for both coins and cards. These are the wallets that blend function, fashion, and long-lasting flexibility.',
    price_cents: 22000,
    currency: 'PKR',
    images: [
      { url: '/magic-1.png', alt: 'The Magic Folding Wallet — Midnight Black close-up with gold Ark Pelle emblem' },
      { url: '/magic-2.png', alt: 'The Magic Folding Wallet — inside folding layout' }
    ],
    material: 'Full-grain hide with German-engineered cross-elastic straps and quick-draw pull tabs',
    dimensions: { width_mm: 100, height_mm: 75, depth_mm: 8.5 },
    card_capacity: 10,
    is_active: true,
    is_sold_out: false,
    display_order: 4,
    collection_id: null,
    created_at: '2026-05-30T00:04:00Z'
  },
  {
    id: 'mock-wax',
    slug: 'wax',
    name: 'Nourishing Leather Wax',
    description: 'A premium leather wax that nourishes, protects, and enhances the natural beauty of your leather. Provides lasting shine while keeping leather soft, supple and water-resistant.',
    price_cents: 3500,
    currency: 'PKR',
    images: [
      { url: '/wax-1.png', alt: 'Nourishing Leather Wax — premium jar on dark fabric' },
      { url: '/wax-2.png', alt: 'Nourishing Leather Wax — dab on leather surface details' }
    ],
    material: 'Natural beeswax, organic seed oils, and premium shine-enhancing wax blend',
    dimensions: { width_mm: 60, height_mm: 60, depth_mm: 35.0 },
    card_capacity: 0,
    is_active: true,
    is_sold_out: false,
    display_order: 5,
    collection_id: null,
    created_at: '2026-05-30T00:05:00Z'
  }
];
