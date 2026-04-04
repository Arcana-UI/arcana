// ─── Product Data ────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  category: 'Kitchen' | 'Home' | 'Living' | 'Accessories' | 'Furniture';
  badge?: 'SALE' | 'NEW';
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
}

export const CATEGORIES = ['All', 'Kitchen', 'Home', 'Living', 'Accessories', 'Furniture'] as const;

export type Category = (typeof CATEGORIES)[number];

export const products: Product[] = [
  {
    id: 1,
    title: 'Alto Ceramic Bowl',
    slug: 'alto-ceramic-bowl',
    price: 185,
    category: 'Kitchen',
    rating: 4.8,
    reviewCount: 47,
    image: 'https://placehold.co/800x600/D4C5B0/6B5D4F?text=Alto+Ceramic+Bowl',
    description:
      'Thrown on a wheel in Oaxaca, each Alto bowl is signed by the maker. The interior glaze pools differently in every piece.',
  },
  {
    id: 2,
    title: 'Linen Throw No. 3',
    slug: 'linen-throw-no-3',
    price: 220,
    category: 'Home',
    rating: 4.9,
    reviewCount: 62,
    image: 'https://placehold.co/800x600/C9B99A/4A3E34?text=Linen+Throw+No.+3',
    description:
      'Pre-washed European linen that softens over time. Designed to look better after ten years than it does today.',
  },
  {
    id: 3,
    title: 'Walnut Tray, Small',
    slug: 'walnut-tray-small',
    price: 95,
    category: 'Home',
    rating: 4.6,
    reviewCount: 33,
    image: 'https://placehold.co/800x600/8B7355/2C2218?text=Walnut+Tray',
    description:
      'American black walnut, oiled with tung oil. No hardware. Joined entirely by hand.',
  },
  {
    id: 4,
    title: 'Forma Candle, Cedar',
    slug: 'forma-candle-cedar',
    price: 65,
    salePrice: 48,
    category: 'Living',
    badge: 'SALE',
    rating: 4.7,
    reviewCount: 89,
    image: 'https://placehold.co/800x600/C4BBB2/5A5048?text=Forma+Candle',
    description:
      'Two hundred hours of burn time. The cedar note develops slowly, like good wood smoke on a cold morning.',
  },
  {
    id: 5,
    title: 'Suede Card Wallet',
    slug: 'suede-card-wallet',
    price: 120,
    category: 'Accessories',
    rating: 4.5,
    reviewCount: 28,
    image: 'https://placehold.co/800x600/B8A898/3D3028?text=Suede+Card+Wallet',
    description:
      'Four card slots. One note fold. Saddle-stitched by hand in a small workshop in León.',
  },
  {
    id: 6,
    title: 'Handblown Carafe',
    slug: 'handblown-carafe',
    price: 155,
    category: 'Kitchen',
    badge: 'NEW',
    rating: 4.8,
    reviewCount: 12,
    image: 'https://placehold.co/800x600/C8D0C8/3D4A39?text=Handblown+Carafe',
    description:
      'Each carafe is blown with a long neck that slows the pour intentionally. No two are identical.',
  },
  {
    id: 7,
    title: 'Merino Blanket, Slate',
    slug: 'merino-blanket-slate',
    price: 340,
    category: 'Home',
    rating: 4.9,
    reviewCount: 41,
    image: 'https://placehold.co/800x600/A8B0B8/2A3038?text=Merino+Blanket',
    description:
      '240gsm merino from a single New Zealand flock. Blanket-stitched edge in a tonal slate thread.',
  },
  {
    id: 8,
    title: 'Leather Notebook Cover',
    slug: 'leather-notebook-cover',
    price: 85,
    category: 'Accessories',
    rating: 4.4,
    reviewCount: 56,
    image: 'https://placehold.co/800x600/B09878/2C1E10?text=Notebook+Cover',
    description:
      'Full-grain vegetable-tanned leather. Sized for A5 Leuchtturm. Will patina over years of use.',
  },
  {
    id: 9,
    title: 'Cast Iron Trivet',
    slug: 'cast-iron-trivet',
    price: 75,
    category: 'Kitchen',
    rating: 4.3,
    reviewCount: 19,
    image: 'https://placehold.co/800x600/707070/F0EDE8?text=Cast+Iron+Trivet',
    description:
      'Sand-cast in Pennsylvania. Heavy enough to be permanent. Designed by a foundry apprentice on her fifth year.',
  },
  {
    id: 10,
    title: 'Forma Soap Bar, Vetiver',
    slug: 'forma-soap-bar-vetiver',
    price: 28,
    category: 'Living',
    rating: 4.6,
    reviewCount: 104,
    image: 'https://placehold.co/800x600/D8CFC4/5A5048?text=Vetiver+Soap',
    description:
      'Cold-pressed with vetiver root and unrefined shea. Wrapped in unbleached kraft, sealed with a wax stamp.',
  },
  {
    id: 11,
    title: 'Oak Side Table',
    slug: 'oak-side-table',
    price: 490,
    category: 'Furniture',
    rating: 4.9,
    reviewCount: 15,
    image: 'https://placehold.co/800x600/C8B888/3C2C10?text=Oak+Side+Table',
    description:
      'White oak, oil-finished. Three mortise-and-tenon joints. Will outlast the room it sits in.',
  },
  {
    id: 12,
    title: 'Wool Cushion Cover',
    slug: 'wool-cushion-cover',
    price: 110,
    category: 'Home',
    rating: 4.7,
    reviewCount: 37,
    image: 'https://placehold.co/800x600/B8B0A0/3A3028?text=Wool+Cushion',
    description: 'Hand-woven in a small mill outside Edinburgh. The texture is the design.',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentId: number, count = 4): Product[] {
  const current = products.find((p) => p.id === currentId);
  if (!current) return products.slice(0, count);
  const sameCategory = products.filter(
    (p) => p.id !== currentId && p.category === current.category,
  );
  const others = products.filter((p) => p.id !== currentId && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}
