import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

const brandsData = [
  {
    slug: 'santiago-bros',
    name: 'Santiago Bros',
    description: 'Our signature collection — where Mediterranean heritage meets contemporary design. Each piece is crafted with meticulous attention to detail.',
    logo: '/images/brands/santiago-bros.svg',
  },
  {
    slug: 'artisan-living',
    name: 'Artisan Living',
    description: 'Celebrating traditional craftsmanship with modern sensibility. Artisan Living brings handcrafted furniture using time-honored techniques.',
    logo: '/images/brands/artisan-living.svg',
  },
  {
    slug: 'casa-moderna',
    name: 'Casa Moderna',
    description: 'Bold, contemporary designs for the modern home. Casa Moderna pushes boundaries with innovative materials and striking silhouettes.',
    logo: '/images/brands/casa-moderna.svg',
  },
  {
    slug: 'mediterra',
    name: 'Mediterra',
    description: 'Inspired by the warmth and textures of Mediterranean living. Natural materials, earthy tones, and organic forms define the Mediterra aesthetic.',
    logo: '/images/brands/mediterra.svg',
  },
];

const projectsData = [
  {
    slug: 'marbella-villa',
    title: 'Marbella Villa',
    location: 'Marbella, Spain',
    year: '2024',
    description: 'A complete interior design project for a stunning Mediterranean villa overlooking the sea.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    categories: ['Outdoor', 'Sofas', 'Lighting'],
  },
  {
    slug: 'london-penthouse',
    title: 'London Penthouse',
    location: 'Mayfair, London',
    year: '2024',
    description: 'An ultra-modern penthouse project featuring our Casa Moderna and Santiago Bros pieces.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    categories: ['Sofas', 'Tables', 'Cabinets'],
  },
  {
    slug: 'ibiza-boutique-hotel',
    title: 'Ibiza Boutique Hotel',
    location: 'Ibiza, Spain',
    year: '2023',
    description: 'A 24-suite boutique hotel project combining outdoor and indoor collections for a cohesive resort experience.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    categories: ['Outdoor', 'Bedroom', 'Lighting'],
  },
  {
    slug: 'paris-apartment',
    title: 'Paris Apartment',
    location: 'Le Marais, Paris',
    year: '2024',
    description: 'A Haussmann-era apartment reborn with our curated selection. Classic architecture meets contemporary furniture.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    categories: ['Armchair', 'Tables', 'Lighting'],
  },
  {
    slug: 'dubai-residence',
    title: 'Dubai Residence',
    location: 'Palm Jumeirah, Dubai',
    year: '2023',
    description: 'A palatial waterfront residence featuring our most luxurious pieces.',
    image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop',
    categories: ['Tables', 'Chairs', 'Cabinets'],
  },
  {
    slug: 'barcelona-showroom',
    title: 'Barcelona Showroom',
    location: 'Eixample, Barcelona',
    year: '2023',
    description: 'Our own flagship showroom designed as a living gallery.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    categories: ['Sofas', 'Armchair', 'Lighting'],
  },
];

const productsData = [
  { slug: 'outdoor-lounge-set', name: 'Terrazza Lounge Set', category: 'outdoor', price: 4850, brand: 'Santiago Bros', dimensions: '320 × 200 × 75 cm', materials: ['Teak Wood', 'Sunbrella Fabric', 'Stainless Steel'], description: 'A complete outdoor lounge set crafted from premium teak wood with weather-resistant cushions.', images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=800&fit=crop'], featured: true },
  { slug: 'garden-dining-table', name: 'Giardino Dining Table', category: 'outdoor', price: 3200, brand: 'Artisan Living', dimensions: '240 × 100 × 76 cm', materials: ['Solid Teak', 'Powder-Coated Aluminum'], description: 'An expansive dining table designed for al fresco gatherings.', images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=800&fit=crop'], featured: false },
  { slug: 'rope-garden-chair', name: 'Corda Garden Chair', category: 'outdoor', price: 890, brand: 'Mediterra', dimensions: '62 × 58 × 82 cm', materials: ['Woven Rope', 'Aluminum Frame', 'Olefin Cushion'], description: 'Hand-woven rope craftsmanship meets modern outdoor comfort.', images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=800&fit=crop'], featured: false },
  { slug: 'outdoor-daybed', name: 'Soleil Daybed', category: 'outdoor', price: 5600, brand: 'Santiago Bros', dimensions: '200 × 140 × 35 cm', materials: ['Rattan', 'Marine-Grade Fabric', 'Teak Legs'], description: 'A luxurious outdoor daybed that transforms your poolside into a resort experience.', images: ['https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1600566753086-00f18d89bc2e?w=800&h=800&fit=crop'], featured: true },
  { slug: 'velvet-modular-sofa', name: 'Nuvola Modular Sofa', category: 'sofas', price: 7200, brand: 'Santiago Bros', dimensions: '340 × 170 × 82 cm', materials: ['Italian Velvet', 'Solid Walnut Base', 'HR Foam'], description: 'Our signature modular sofa, upholstered in sumptuous Italian velvet.', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&h=800&fit=crop'], featured: true },
  { slug: 'leather-sofa-minimal', name: 'Puro Leather Sofa', category: 'sofas', price: 8900, brand: 'Casa Moderna', dimensions: '260 × 95 × 78 cm', materials: ['Full-Grain Leather', 'Brushed Steel', 'Memory Foam'], description: 'Minimalist perfection in full-grain Italian leather.', images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&h=800&fit=crop'], featured: true },
  { slug: 'curved-sectional', name: 'Luna Curved Sectional', category: 'sofas', price: 11500, brand: 'Santiago Bros', dimensions: '380 × 200 × 76 cm', materials: ['Bouclé Fabric', 'Oak Base', 'Layered Foam'], description: 'A sculptural masterpiece with a dramatic curved silhouette in soft bouclé fabric.', images: ['https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800&h=800&fit=crop'], featured: false },
  { slug: 'compact-sofa', name: 'Piccolo Two-Seater', category: 'sofas', price: 3400, brand: 'Artisan Living', dimensions: '180 × 85 × 80 cm', materials: ['Linen Blend', 'Solid Ash', 'Pocket Springs'], description: 'Perfectly proportioned for intimate spaces.', images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=800&fit=crop'], featured: false },
  { slug: 'wingback-velvet', name: 'Ala Wingback Chair', category: 'armchair', price: 2800, brand: 'Santiago Bros', dimensions: '78 × 82 × 110 cm', materials: ['Velvet Upholstery', 'Solid Beech Frame', 'Brass Legs'], description: 'A modern reinterpretation of the classic wingback.', images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=800&fit=crop'], featured: true },
  { slug: 'accent-lounge-chair', name: 'Riposo Lounge Chair', category: 'armchair', price: 3200, brand: 'Mediterra', dimensions: '85 × 90 × 75 cm', materials: ['Bouclé Fabric', 'Walnut Shell', 'Swivel Base'], description: 'Where sculptural art meets seating.', images: ['https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop'], featured: true },
  { slug: 'rattan-accent-chair', name: 'Natura Accent Chair', category: 'armchair', price: 1600, brand: 'Casa Moderna', dimensions: '70 × 72 × 80 cm', materials: ['Natural Rattan', 'Linen Cushion', 'Teak Legs'], description: 'Handcrafted from natural rattan.', images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop'], featured: false },
  { slug: 'leather-club-chair', name: 'Classico Club Chair', category: 'armchair', price: 4500, brand: 'Santiago Bros', dimensions: '82 × 88 × 78 cm', materials: ['Aniline Leather', 'Kiln-Dried Hardwood', 'Down Cushion'], description: 'Timeless sophistication in butter-soft aniline leather.', images: ['https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop'], featured: false },
  { slug: 'marble-dining-table', name: 'Marmo Dining Table', category: 'tables', price: 6800, brand: 'Santiago Bros', dimensions: '220 × 110 × 76 cm', materials: ['Calacatta Marble', 'Brushed Brass Base'], description: 'A breathtaking dining table featuring solid Calacatta marble.', images: ['https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop'], featured: true },
  { slug: 'walnut-coffee-table', name: 'Rotondo Coffee Table', category: 'tables', price: 1800, brand: 'Artisan Living', dimensions: '100 × 100 × 38 cm', materials: ['Solid Walnut', 'Tempered Glass'], description: 'A perfectly round coffee table combining walnut with tempered glass.', images: ['https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=800&fit=crop'], featured: false },
  { slug: 'console-table-gold', name: 'Eleganza Console', category: 'tables', price: 2400, brand: 'Casa Moderna', dimensions: '140 × 40 × 85 cm', materials: ['Lacquered Wood', 'Gold-Plated Metal'], description: 'The Eleganza console table makes a grand entrance statement.', images: ['https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&h=800&fit=crop'], featured: false },
  { slug: 'side-table-stone', name: 'Pietra Side Table', category: 'tables', price: 950, brand: 'Mediterra', dimensions: '45 × 45 × 55 cm', materials: ['Travertine Stone', 'Solid Form'], description: 'Carved from a single block of travertine.', images: ['https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800&h=800&fit=crop'], featured: true },
  { slug: 'dining-chair-woven', name: 'Tessuto Dining Chair', category: 'chairs', price: 680, brand: 'Santiago Bros', dimensions: '48 × 54 × 82 cm', materials: ['Woven Paper Cord', 'Solid Oak Frame'], description: 'Scandinavian-inspired dining chair with hand-woven paper cord seat.', images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop'], featured: false },
  { slug: 'bar-stool-leather', name: 'Alto Bar Stool', category: 'chairs', price: 1100, brand: 'Casa Moderna', dimensions: '42 × 48 × 100 cm', materials: ['Saddle Leather', 'Powder-Coated Steel'], description: 'Elevated seating in every sense.', images: ['https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=800&fit=crop'], featured: true },
  { slug: 'office-chair-modern', name: 'Studio Office Chair', category: 'chairs', price: 1950, brand: 'Artisan Living', dimensions: '60 × 62 × 95 cm', materials: ['Mesh Back', 'Leather Seat', 'Chrome Base'], description: 'Where ergonomics meets aesthetics.', images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop'], featured: false },
  { slug: 'stacking-chair', name: 'Impilo Stackable Chair', category: 'chairs', price: 420, brand: 'Mediterra', dimensions: '50 × 52 × 78 cm', materials: ['Molded Plywood', 'Chrome Legs'], description: 'Versatile and stackable, ideal for dynamic spaces.', images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&h=800&fit=crop'], featured: false },
  { slug: 'platform-bed-oak', name: 'Sereno Platform Bed', category: 'bedroom', price: 5200, brand: 'Santiago Bros', dimensions: '220 × 190 × 95 cm (King)', materials: ['Solid Oak', 'Upholstered Headboard', 'Slatted Base'], description: 'The Sereno creates a floating effect with its recessed base.', images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop'], featured: true },
  { slug: 'nightstand-walnut', name: 'Notte Nightstand', category: 'bedroom', price: 890, brand: 'Artisan Living', dimensions: '50 × 42 × 55 cm', materials: ['Walnut Veneer', 'Soft-Close Drawer', 'Brass Pulls'], description: 'A refined nightstand with a single soft-close drawer.', images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop'], featured: false },
  { slug: 'dresser-six-drawer', name: 'Lusso Dresser', category: 'bedroom', price: 3800, brand: 'Santiago Bros', dimensions: '160 × 50 × 75 cm', materials: ['Lacquered MDF', 'Solid Wood Legs', 'Leather Pulls'], description: 'Six generous drawers with leather loop pulls.', images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=800&fit=crop'], featured: false },
  { slug: 'vanity-desk', name: 'Bellezza Vanity Desk', category: 'bedroom', price: 2200, brand: 'Casa Moderna', dimensions: '120 × 50 × 78 cm', materials: ['Marble Top', 'Gold Metal Frame', 'Velvet Stool'], description: 'A glamorous vanity desk with a genuine marble top.', images: ['https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop'], featured: true },
  { slug: 'display-cabinet-glass', name: 'Vetrina Display Cabinet', category: 'cabinets', price: 4200, brand: 'Santiago Bros', dimensions: '100 × 45 × 190 cm', materials: ['Fluted Glass', 'Black Metal Frame', 'Oak Shelves'], description: 'Showcase your curated collection behind fluted glass doors.', images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop'], featured: true },
  { slug: 'bar-cabinet-art-deco', name: 'Cocktail Bar Cabinet', category: 'cabinets', price: 3600, brand: 'Artisan Living', dimensions: '90 × 45 × 140 cm', materials: ['Walnut Veneer', 'Mirrored Interior', 'Brass Details'], description: 'An Art Deco-inspired bar cabinet with a mirrored interior.', images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=800&fit=crop'], featured: false },
  { slug: 'sideboard-modern', name: 'Orizzonte Sideboard', category: 'cabinets', price: 2900, brand: 'Mediterra', dimensions: '180 × 45 × 72 cm', materials: ['Oak', 'Woven Cane Doors', 'Brass Legs'], description: 'Mid-century meets Mediterranean with woven cane doors.', images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop'], featured: false },
  { slug: 'bookshelf-modular', name: 'Libreria Modular Shelf', category: 'cabinets', price: 3400, brand: 'Casa Moderna', dimensions: '200 × 35 × 220 cm', materials: ['Powder-Coated Steel', 'Oak Shelves'], description: 'An architectural shelving system configurable to your space.', images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&h=800&fit=crop'], featured: true },
  { slug: 'pendant-brass', name: 'Sfera Pendant Light', category: 'lighting', price: 1200, brand: 'Santiago Bros', dimensions: 'Ø 40 cm, H 35 cm', materials: ['Brushed Brass', 'Opal Glass Globe'], description: 'A sculptural pendant featuring a luminous opal glass globe.', images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop'], featured: true },
  { slug: 'floor-lamp-arc', name: 'Arco Floor Lamp', category: 'lighting', price: 1800, brand: 'Artisan Living', dimensions: 'H 210 cm, Reach 150 cm', materials: ['Marble Base', 'Brushed Steel Arc', 'Linen Shade'], description: 'An iconic arcing floor lamp with a substantial marble base.', images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop'], featured: true },
  { slug: 'table-lamp-ceramic', name: 'Ceramica Table Lamp', category: 'lighting', price: 650, brand: 'Mediterra', dimensions: 'Ø 30 cm, H 55 cm', materials: ['Handmade Ceramic', 'Linen Shade', 'Brass Fitting'], description: 'Each Ceramica lamp is handcrafted by Mediterranean artisans.', images: ['https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop'], featured: false },
  { slug: 'chandelier-modern', name: 'Cascata Chandelier', category: 'lighting', price: 4500, brand: 'Santiago Bros', dimensions: 'Ø 80 cm, H 60 cm', materials: ['Hand-Blown Glass', 'Antique Brass Frame'], description: 'A cascading constellation of hand-blown glass droplets.', images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=800&fit=crop'], featured: false },
];

async function main() {
  console.log('Seeding Santiago Bros collection...\n');
  console.log('-> Seeding brands...');
  for (const b of brandsData) { await prisma.brand.upsert({ where: { slug: b.slug }, update: b, create: b }); }
  console.log(`  Done: ${brandsData.length} brands`);
  console.log('-> Seeding projects...');
  for (const p of projectsData) { await prisma.project.upsert({ where: { slug: p.slug }, update: p, create: p }); }
  console.log(`  Done: ${projectsData.length} projects`);
  console.log('-> Seeding products...');
  for (const p of productsData) { await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p }); }
  console.log(`  Done: ${productsData.length} products`);
  console.log('\nSeeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
