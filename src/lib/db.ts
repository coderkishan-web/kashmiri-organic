import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Define the interfaces for our DB models
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  phone?: string | null;
  otp?: string | null;
  otp_expiry?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface ProductType {
  id: number;
  name: string;
  slug: string;
}

export interface Material {
  id: number;
  name: string;
  slug: string;
  overview: string;
  origin: string;
  manufacturing_process: string;
  sustainability: string;
  benefits: string;
  image_url: string;
  history?: string;
  gallery_urls?: string;
  extraction_story?: string;
}


export interface Benefit {
  id: number;
  name: string;
  description: string;
}

export interface UsageType {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  image_url: string;
  gallery_urls: string; // JSON string of array
  availability: string; // 'bulk' | 'retail' | 'export' (comma-separated or single)
  certified: number; // 0 or 1
  export_quality: number; // 0 or 1
  moq: string;
  packaging: string;
  shipping: string;
  created_at: string;
  sub_category?: string; // administrative dynamic sub-category
  price?: number | null;
  discount_price?: number | null;
  sku?: string;
  stock?: number;
  season?: string; // 'spring' | 'summer' | 'autumn' | 'winter' | 'all'
  
  // Relations mapped in queries
  categories?: Category[];
  product_types?: ProductType[];
  materials?: Material[];
  benefits?: Benefit[];
  usage_types?: UsageType[];
  related_products?: Product[];
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string; // comma separated
  author: string;
  publish_date: string;
  status: 'draft' | 'published';
  seo_title: string;
  seo_description: string;
  related_products?: string; // JSON string of IDs
  related_materials?: string; // JSON string of IDs
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  inquiry_type: 'whatsapp' | 'quote' | 'bulk' | 'contact';
  message: string;
  product_id: number | null;
  product_name?: string;
  status: 'new' | 'read' | 'processed';
  created_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image_url: string;
}

export interface Certification {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export interface SEOEntry {
  id: number;
  path: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

export interface SiteSetting {
  id: number;
  setting_key: string;
  setting_value: string;
}

// In-Memory / File Database state for Fallback Mode
interface LocalDBState {
  users: User[];
  categories: Category[];
  product_types: ProductType[];
  materials: Material[];
  benefits: Benefit[];
  usage_types: UsageType[];
  products: Product[];
  product_categories: { product_id: number; category_id: number }[];
  product_types_mapping: { product_id: number; type_id: number }[];
  product_materials: { product_id: number; material_id: number }[];
  product_benefits: { product_id: number; benefit_id: number; custom_description?: string }[];
  product_usage_types: { product_id: number; usage_type_id: number; custom_description?: string }[];
  product_related: { product_id: number; related_product_id: number }[];
  blogs: Blog[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  certifications: Certification[];
  seo: SEOEntry[];
  site_settings: SiteSetting[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Establish if we should try MySQL or fallback
const isMySQLConfigured = () => {
  return !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
};

// Seed Data
const SEED_DATA: LocalDBState = {
  users: [
    {
      id: 1,
      name: 'Admin Kashmiri Organic',
      email: 'admin@kashmiriorganic.com',
      // password is 'kashmir@123'
      password_hash: '$2a$10$tMhP4p07n6z9YgK/YvKgeOSN.CymcWdM82oK5T5B/iB4lFskG64U.',
      role: 'admin',
      created_at: new Date().toISOString(),
      phone: null,
      otp: null,
      otp_expiry: null
    }
  ],
  categories: [
    { id: 1, name: 'Health', slug: 'health', description: 'Kashmiri organic solutions to strengthen immunity and vitality.', image_url: '/images/categories/health.jpg' },
    { id: 2, name: 'Skincare', slug: 'skincare', description: 'Glow naturally with saffron and cold-pressed botanical oils.', image_url: '/images/categories/skincare.jpg' },
    { id: 3, name: 'Fitness', slug: 'fitness', description: 'Clean energy resources harvested from the high-altitude fields of Kashmir.', image_url: '/images/categories/fitness.jpg' },
    { id: 4, name: 'Natural Living', slug: 'natural-living', description: 'Luxury handcrafted woodware and eco-friendly household goods.', image_url: '/images/categories/natural-living.jpg' },
    { id: 5, name: 'Wellness', slug: 'wellness', description: 'Aromatic therapeutic oils and traditional herbal wellness blends.', image_url: '/images/categories/wellness.jpg' },
  ],
  product_types: [
    { id: 1, name: 'Wearable', slug: 'wearable' },
    { id: 2, name: 'Eatable', slug: 'eatable' },
    { id: 3, name: 'Herbal', slug: 'herbal' },
    { id: 4, name: 'Oils', slug: 'oils' },
    { id: 5, name: 'Accessories', slug: 'accessories' },
  ],
  materials: [
    {
      id: 1,
      name: 'Saffron',
      slug: 'saffron',
      overview: 'Kashmiri Saffron (Lacha or Mongra) is globally celebrated for its dark crimson strands, strong aroma, and unmatched medical values. Grown in the fields of Pampore, it is the most premium saffron in the world.',
      origin: 'Pampore Saffron Fields, Kashmir Valley (Altitude: 1,600m)',
      manufacturing_process: 'Harvested exclusively by hand during a short two-week blooming window in autumn. Strands are carefully separated and shade-dried to lock in maximum crocin content.',
      sustainability: '100% dry-farmed using traditional heritage methods passed down through generations. No chemicals or synthetic boosters are used.',
      benefits: 'Powerful antioxidant, enhances skin glow and complexion, boosts mood and memory, supports cardiovascular health and acts as an organic immunity booster.',
      image_url: '/images/materials/saffron.jpg',
      history: 'Saffron cultivation has been recorded in Pampore since the 5th century BC, introduced by Central Asian traders and celebrated in ancient Ayurvedic scripts. Pampore is globally renowned as the "Saffron Town of Kashmir" due to its rich, high-grade soil chemistry.',
      gallery_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
      ])
    },
    {
      id: 2,
      name: 'Honey',
      slug: 'honey',
      overview: 'Our raw, unfiltered honey is collected from deep forests and wild lavender fields of Kashmir. It remains unpasteurized, retaining all living enzymes and organic pollens.',
      origin: 'Kashmiri Forest Reserves and Wild Lavender Valleys',
      manufacturing_process: 'Ethically harvested by local nomadic beekeepers. Coarse-filtered once through organic cotton mesh to remove large particles without heat treatment or micro-filtration.',
      sustainability: 'Bee-friendly and cruelty-free honey harvesting. Bees are nurtured naturally in organic hives, maintaining local agricultural biodiversity.',
      benefits: 'Natural prebiotic, rapid energy source, organic cough suppressant, excellent wound healer, and premium sugar substitute rich in wild floral trace minerals.',
      image_url: '/images/materials/honey.jpg',
      history: 'Nomadic beekeeping in the high valleys of Kashmir has been recorded in ancient Sanskrit and Persian courtly texts as a royal delicacy. Beekeepers migrate through floral belts according to seasonal blooms.',
      gallery_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80'
      ])
    },
    {
      id: 3,
      name: 'Wood',
      slug: 'wood',
      overview: 'Authentic Kashmiri Walnut Wood is highly durable and features beautiful dark grain patterns. Celebrated globally, walnut wood carving is a heritage craft protected as a GI asset in Kashmir.',
      origin: 'Srinagar and Anantnag Walnut Groves, Kashmir',
      manufacturing_process: 'Walnut logs are naturally seasoned for 2 to 5 years to prevent cracking. Talented master artisans then carve them by hand using specialized iron chisels.',
      sustainability: 'Felled strictly from dead or licensed senior walnut trees. We actively replant three walnut saplings for every tree utilized.',
      benefits: 'Food-safe natural coating, generation-lasting durability, beautiful organic centerpiece decor, biodegradable kitchenware, and support for rural woodcraft guilds.',
      image_url: '/images/materials/wood.jpg',
      history: 'Hand-carved walnut woodcrafts enjoyed extensive royal patronage during the Mughal Empire, forming the architectural and interior highlights of houseboats and imperial palaces throughout Srinagar.',
      gallery_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80'
      ])
    },
    {
      id: 4,
      name: 'Walnut',
      slug: 'walnut',
      overview: 'Rich in healthy fats and proteins, Kashmiri Walnuts are grown organically in clean mountain air. They are valued for thin shells, light-colored kernels, and superior buttery flavor.',
      origin: 'Kupwara and Shopian High Altitude Walnut Orchards',
      manufacturing_process: 'Sun-dried slowly on traditional straw mats. Shelled carefully by hand to preserve the golden butterfly-shaped kernel halves.',
      sustainability: 'Grown under rainfed conditions with zero artificial fertilizer or pesticide use. Preserving traditional orchard ecosystems.',
      benefits: 'Excellent source of Omega-3 (ALA) fatty acids, boosts cognitive performance, lowers LDL cholesterol, and maintains perfect skin elasticity and hair health.',
      image_url: '/images/materials/walnut.jpg',
      history: 'Historically, walnut orchards bordered the high Silk Road mountain passes. Kashmiri walnuts were historically traded with East Asian and Persian merchants as a premium energy-rich commodity.',
      gallery_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1589947966779-7a0e5b7b9ab8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80'
      ])
    },
    {
      id: 5,
      name: 'Herbs',
      slug: 'herbs',
      overview: 'Wildcrafted Himalayan herbs harvested from the pristine high meadows of Sonamarg and Gulmarg, capturing the concentrated therapeutic values of high-altitude flora.',
      origin: 'Pristine Himalayan Alpine Valleys (Altitude: 2,500m+)',
      manufacturing_process: 'Gently hand-picked by tribal herbalists, clean washed in glacial meltwater, and solar dehydrated at low temperatures to conserve medicinal volatile oils.',
      sustainability: 'Ethical wildcrafting principles followed. We harvest less than 20% of wild herb clusters to ensure zero disruption to alpine ecosystems.',
      benefits: 'Powerful adaptogens, deep respiratory relief, profound relaxation, soothing inflammation, and excellent base for luxury botanical skincare solutions.',
      image_url: '/images/materials/herbs.jpg',
      history: 'The high alpine meadows of Sonamarg and Gulmarg are celebrated in classical Unani and Ayurvedic traditions. They have provided rare medicinal plants for tribal healers across the Himalayas for eons.',
      gallery_urls: JSON.stringify([
        'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
      ])
    }
  ],
  benefits: [
    { id: 1, name: 'Immunity Booster', description: 'Strengthens natural body defenses against seasonal infections.' },
    { id: 2, name: 'Radiant Glow', description: 'Improves skin complexion, reduces pigmentation, and adds natural radiance.' },
    { id: 3, name: 'Cognitive Health', description: 'Improves brain power, focus, concentration, and protects neurons.' },
    { id: 4, name: 'Stress Relief', description: 'Soothes nervous system, reduces anxiety levels, and promotes deep sleep.' },
    { id: 5, name: 'Clean Energy', description: 'Provides sustained physical power and metabolism support without crashes.' },
  ],
  usage_types: [
    { id: 1, name: 'Daily Use', description: 'Designed for safe, continuous everyday usage in food or lifestyle.' },
    { id: 2, name: 'Therapy', description: 'Concentrated natural remedies for healing, soothing, and physical therapy.' },
    { id: 3, name: 'Beauty', description: 'Luxury cosmetic and skin-nourishment applications.' },
    { id: 4, name: 'Fitness', description: 'High-performance nutrition for pre/post workouts and weight management.' },
  ],
  products: [
    {
      id: 1,
      name: 'Kashmiri Mongra Saffron (Grade A+)',
      slug: 'kashmiri-mongra-saffron-grade-a',
      short_description: 'The world\'s finest saffron, hand-harvested from Pampore, boasting the highest crocin concentration and deep red stigma.',
      long_description: 'Our Grade A+ Kashmiri Mongra Saffron represents the absolute pinnacle of luxury spices. Harvested in the scenic Pampore valleys, it is highly distinct for its dark crimson red strands with no yellow waste styled parts. Rich in bioactive compounds like Crocin, Safranal, and Picrocrocin, this saffron is renowned globally for its intense aroma, coloring strength, and powerful therapeutic qualities. Every single strand is delicately plucked by hand and shade-dried to preserve its high oil content. Ideal for direct consumption, luxury cuisine, herbal milk, and organic face treatments.',
      image_url: '/images/products/saffron.jpg',
      gallery_urls: JSON.stringify(['/images/products/saffron.jpg', '/images/products/saffron-2.jpg', '/images/products/saffron-box.jpg']),
      availability: 'retail,bulk,export',
      certified: 1,
      export_quality: 1,
      moq: '50 grams (Retail) / 1kg (Export)',
      packaging: 'Premium moisture-resistant glass jars with gold-embossed velvet boxes.',
      shipping: 'Worldwide air shipping available. Certified with phytosanitary documentation.',
      created_at: new Date().toISOString(),
      price: 350,
      discount_price: 299,
      sku: 'KO-SAF-001',
      stock: 100,
      sub_category: 'Special Reserve',
      season: 'spring',
    },
    {
      id: 2,
      name: 'Organic Himalayan Acacia Honey',
      slug: 'organic-himalayan-acacia-honey',
      short_description: 'Pure, pale-golden wild acacia flower honey, harvested from the pristine high orchards of Kashmir with a sweet, mild flavor.',
      long_description: 'Harvested from beehives placed in wild Acacia forests in the high altitudes of Kashmir, this honey is renowned for its light straw color and clear, glass-like consistency. It remains liquid for a prolonged duration due to its high fructose concentration. Ethically collected using non-heating extraction processes, this honey is packed with wild floral pollens and natural enzymes. Its subtle floral sweetness makes it a fantastic premium alternative to processed sugar for sweetening beverages or raw culinary treats.',
      image_url: '/images/products/honey.jpg',
      gallery_urls: JSON.stringify(['/images/products/honey.jpg', '/images/products/honey-jar.jpg']),
      availability: 'retail,bulk,export',
      certified: 1,
      export_quality: 1,
      moq: '100 jars (Retail) / 500kg (Bulk Export)',
      packaging: 'Food-grade glass jars with cork lids and rustic jute neck wrap.',
      shipping: 'Secured vacuum sealed pallets for international sea and air shipping.',
      created_at: new Date().toISOString(),
      price: 999,
      discount_price: 899,
      sku: 'KO-HON-001',
      stock: 120,
      sub_category: 'Forest Wild',
      season: 'summer',
    },
    {
      id: 3,
      name: 'Heritage Carved Walnut Wood Fruit Bowl',
      slug: 'heritage-carved-walnut-wood-fruit-bowl',
      short_description: 'An exquisite hand-carved heritage bowl created from seasoned Kashmiri walnut wood by master woodcraft artisans.',
      long_description: 'Bring the historical craftsmanship of the Kashmir valley into your home with this stunning fruit bowl. Masterfully carved by local artisans from a single piece of seasoned walnut wood (aged over 3 years), it features traditional chinar leaf and floral motifs. Walnut wood is cherished globally for its dense grain and durability. Each piece has distinct wood rings and natural shades, making it a unique piece of living art. Finished with food-safe organic walnut oil coating.',
      image_url: '/images/products/walnut-bowl.jpg',
      gallery_urls: JSON.stringify(['/images/products/walnut-bowl.jpg', '/images/products/walnut-wood.jpg']),
      availability: 'retail,export',
      certified: 1,
      export_quality: 1,
      moq: '10 pieces',
      packaging: 'Custom felt-lined wooden crates with heavy eco-friendly cardboard layers.',
      shipping: 'Safe air/sea freight shipping with certified termite-fumigation certificate.',
      created_at: new Date().toISOString(),
      price: 3499,
      discount_price: 2999,
      sku: 'KO-WD-001',
      stock: 25,
      sub_category: 'Wood Carving',
      season: 'autumn',
    },
    {
      id: 4,
      name: 'Cold-Pressed Wild Walnut Kernel Oil',
      slug: 'cold-pressed-wild-walnut-kernel-oil',
      short_description: 'Rich, golden oil cold-pressed from premium Kashmiri walnuts, loaded with Omega-3 fatty acids and skin-rejuvenating nutrients.',
      long_description: 'Our Cold-Pressed Wild Walnut Kernel Oil is extracted from hand-selected walnuts grown in organic high-altitude orchards. We use a slow wooden-expeller process (Ghani) at temperatures under 38°C to ensure none of the essential nutrients, aroma, or delicate vitamin compounds are damaged. This nutrient-dense luxury oil is exceptional for anti-aging skin serums, soothing head massages, and high-end culinary dressings that support cardiovascular wellness.',
      image_url: '/images/products/walnut-oil.jpg',
      gallery_urls: JSON.stringify(['/images/products/walnut-oil.jpg', '/images/products/walnut-oil-bottle.jpg']),
      availability: 'retail,bulk,export',
      certified: 1,
      export_quality: 1,
      moq: '50 litres (Bulk) / 200 bottles (Retail)',
      packaging: 'Amber glass dropper bottles with gold seals / HDPE bulk food containers.',
      shipping: 'Leak-proof thermal-insulated transport packaging.',
      created_at: new Date().toISOString(),
      price: 1299,
      discount_price: 1199,
      sku: 'KO-OIL-001',
      stock: 65,
      sub_category: 'Cold Pressed Oils',
      season: 'autumn',
    },
    {
      id: 5,
      name: 'Wild Lavender Therapeutic Essential Oil',
      slug: 'wild-lavender-therapeutic-essential-oil',
      short_description: 'Pure steam-distilled essential oil harvested from wild lavender fields of the high Gulmarg valleys for ultimate relaxation.',
      long_description: 'Distilled using pristine mountain spring water, this essential oil represents the botanical essence of Kashmir\'s high-altitude wild lavender. The thermal stress on lavender growing in high climates forces the plants to synthesize richer concentrations of Linalool and Linalyl Acetate. This results in an incredibly sweet, calming aroma with profound therapeutic properties. Perfect for aromatherapy, easing sleep struggles, healing minor skin abrasions, and luxurious massage blends.',
      image_url: '/images/products/lavender-oil.jpg',
      gallery_urls: JSON.stringify(['/images/products/lavender-oil.jpg', '/images/products/lavender-fields.jpg']),
      availability: 'retail,bulk',
      certified: 1,
      export_quality: 1,
      moq: '100 bottles / 10 Litres (Bulk)',
      packaging: 'UV-blocking cobalt blue glass bottles with child-safety tamper drop seals.',
      shipping: 'Safe air transport certified under IATA hazardous liquid classifications.',
      created_at: new Date().toISOString(),
      price: 1499,
      discount_price: 1399,
      sku: 'KO-LAV-001',
      stock: 40,
      sub_category: 'Aromatic Oils',
      season: 'summer',
    },
    {
      id: 6,
      name: 'Organic Saffron Herbal Face Soap',
      slug: 'organic-saffron-herbal-face-soap',
      short_description: 'Luxurious handmade bathing soap infused with genuine Pampore saffron and rich therapeutic mountain herbs.',
      long_description: 'Indulge your skin with this artisanal cold-process herbal face soap, hand-poured in rural Kashmiri cooperatives. We infuse pure Mongra saffron strands, lavender petals, and cold-pressed walnut oil directly into the soap batter. It provides a luxurious creamy lather that gently cleanses skin pores, reduces dark spots, and maintains deep hydration. Free from synthetic sulfates, parabens, or artificial dyes.',
      image_url: 'https://images.unsplash.com/photo-1607006342411-92fc2a41d7c7?auto=format&fit=crop&w=800&q=80',
      gallery_urls: JSON.stringify(['https://images.unsplash.com/photo-1607006342411-92fc2a41d7c7?auto=format&fit=crop&w=800&q=80']),
      availability: 'retail,bulk',
      certified: 1,
      export_quality: 1,
      moq: '50 bars',
      packaging: 'Individually wrapped in recycled handmade paper box with gold-foil seal.',
      shipping: 'Standard ground and air transit.',
      created_at: new Date().toISOString(),
      price: 399,
      discount_price: 349,
      sku: 'KO-SOP-001',
      stock: 200,
      sub_category: 'Skincare Essentials',
      season: 'spring',
    },
    {
      id: 7,
      name: 'Pure Kesar Badam Infused Honey',
      slug: 'pure-kesar-badam-honey',
      short_description: 'Exquisite wild forest honey pre-blended with whole mountain almonds and Pampore saffron strands.',
      long_description: 'An ancestral winter tonic from Jammu & Kashmir. We steep high-purity Mongra saffron strands and whole premium mountain almonds in raw, unpasteurized forest acacia honey for 45 days. The result is a highly nutrient-dense, golden nectar with an unbelievably rich, nutty flavor. It naturally boosts immunity, builds core muscle endurance, and serves as an ultimate healthy breakfast topping.',
      image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      gallery_urls: JSON.stringify(['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80']),
      availability: 'retail,bulk,export',
      certified: 1,
      export_quality: 1,
      moq: '50 jars',
      packaging: 'Hexagonal glass jars with gold lids and hand-tied tag locks.',
      shipping: 'Thermal protected container crates.',
      created_at: new Date().toISOString(),
      price: 1499,
      discount_price: 1299,
      sku: 'KO-HON-002',
      stock: 120,
      sub_category: 'Forest Wild',
      season: 'winter',
    },
    {
      id: 8,
      name: 'Walnut Wood Circular Coaster Set',
      slug: 'walnut-wood-coaster-set',
      short_description: 'A set of 6 beautiful handcrafted coasters carved from seasoned walnut timber, protecting your surfaces in style.',
      long_description: 'Protect your luxury tables with these masterfully hand-turned circular coasters. Made from slow-growth Kashmiri walnut wood and treated for 3 years, they showcase distinct natural ring lines and deep chocolate grains. The set includes a custom-matched carved holder. Coated with organic oil for a food-safe, water-resistant surface.',
      image_url: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=800&q=80',
      gallery_urls: JSON.stringify(['https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=800&q=80']),
      availability: 'retail,export',
      certified: 0,
      export_quality: 1,
      moq: '20 sets',
      packaging: 'Wrapped in muslin cloth inside a heavy recycled craft paper tube.',
      shipping: 'Safe custom carton pallets.',
      created_at: new Date().toISOString(),
      price: 1899,
      discount_price: 1699,
      sku: 'KO-WD-002',
      stock: 35,
      sub_category: 'Wood Carving',
      season: 'autumn',
    },
    {
      id: 9,
      name: 'Premium Kashmiri Gucchi Mushrooms',
      slug: 'premium-gucchi-mushrooms',
      short_description: 'Rare, wild high-altitude morel mushrooms, hand-foraged from the deep pine forests of Kupwara.',
      long_description: 'Gucchi mushrooms (wild Himalayan black morels) are among the most expensive and sought-after gourmet mushrooms on earth. Locally hand-gathered by forest tribes in high pine forests of Kashmir, they cannot be cultivated artificially. They possess an incredibly rich, smoky, and earthy umami flavor. Sun-dried to preserve their nutrients, Gucchi mushrooms are high in Vitamin D and antioxidants, boosting core immunity.',
      image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      gallery_urls: JSON.stringify(['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80']),
      availability: 'retail,bulk,export',
      certified: 1,
      export_quality: 1,
      moq: '500 grams',
      packaging: 'Vacuum-sealed air-tight ambient packages within premium wooden gift boxes.',
      shipping: 'Direct air courier to preserve product dryness.',
      created_at: new Date().toISOString(),
      price: 9999,
      discount_price: 8999,
      sku: 'KO-MUSH-001',
      stock: 15,
      sub_category: 'Special Reserve',
      season: 'spring',
    },
    {
      id: 10,
      name: 'Saffron Infused Face Glow Serum',
      slug: 'saffron-rejuvenating-facial-serum',
      short_description: 'A luxurious botanical face oil blend, loaded with pure Pampore saffron extracts and alpine herbs.',
      long_description: 'Reveal natural glowing skin with this luxury botanical oil face glow serum. We dry-infuse Pampore Mongra saffron stigmas, sweet almond oil, wild lavender oil, and mountain spring herbs for a highly-nourishing treatment. Rich in vitamins and carotenoids, it helps reduce fine lines, brightens skin complexion, and builds a natural defensive layer against sun rays.',
      image_url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      gallery_urls: JSON.stringify(['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80']),
      availability: 'retail,bulk,export',
      certified: 1,
      export_quality: 1,
      moq: '100 bottles',
      packaging: 'Tamper-resistant gold dropper bottle inside a velvet-lined case.',
      shipping: 'Secure padded parcels for international safety.',
      created_at: new Date().toISOString(),
      price: 2499,
      discount_price: 2199,
      sku: 'KO-SER-001',
      stock: 55,
      sub_category: 'Skincare Essentials',
      season: 'autumn',
    }
  ],
  product_categories: [
    { product_id: 1, category_id: 1 }, // Saffron in Health
    { product_id: 1, category_id: 2 }, // Saffron in Skincare
    { product_id: 2, category_id: 1 }, // Honey in Health
    { product_id: 2, category_id: 5 }, // Honey in Wellness
    { product_id: 3, category_id: 4 }, // Walnut bowl in Natural Living
    { product_id: 4, category_id: 2 }, // Walnut oil in Skincare
    { product_id: 4, category_id: 5 }, // Walnut oil in Wellness
    { product_id: 5, category_id: 5 }, // Lavender oil in Wellness
    { product_id: 5, category_id: 2 }, // Lavender oil in Skincare
    { product_id: 6, category_id: 2 }, // Soap in Skincare
    { product_id: 6, category_id: 5 }, // Soap in Wellness
    { product_id: 7, category_id: 1 }, // Kesar Badam Honey in Health
    { product_id: 7, category_id: 3 }, // Kesar Badam Honey in Fitness
    { product_id: 7, category_id: 5 }, // Kesar Badam Honey in Wellness
    { product_id: 8, category_id: 4 }, // Coasters in Natural Living
    { product_id: 9, category_id: 1 }, // Gucchi in Health
    { product_id: 9, category_id: 3 }, // Gucchi in Fitness
    { product_id: 10, category_id: 2 }, // Serum in Skincare
    { product_id: 10, category_id: 5 }, // Serum in Wellness
  ],
  product_types_mapping: [
    { product_id: 1, type_id: 3 }, // Saffron is Herbal
    { product_id: 1, type_id: 2 }, // Saffron is Eatable
    { product_id: 2, type_id: 2 }, // Honey is Eatable
    { product_id: 3, type_id: 5 }, // Bowl is Accessories
    { product_id: 4, type_id: 4 }, // Walnut oil is Oils
    { product_id: 5, type_id: 4 }, // Lavender oil is Oils
    { product_id: 6, type_id: 3 }, // Soap is Herbal
    { product_id: 7, type_id: 2 }, // Honey is Eatable
    { product_id: 8, type_id: 5 }, // Coasters - Accessories
    { product_id: 9, type_id: 2 }, // Gucchi is Eatable
    { product_id: 10, type_id: 4 }, // Serum is Oils
  ],
  product_materials: [
    { product_id: 1, material_id: 1 }, // Saffron uses Saffron
    { product_id: 2, material_id: 2 }, // Honey uses Honey
    { product_id: 3, material_id: 3 }, // Bowl uses Wood
    { product_id: 4, material_id: 4 }, // Walnut oil uses Walnut
    { product_id: 5, material_id: 5 }, // Lavender oil uses Herbs
    { product_id: 6, material_id: 1 }, // Soap uses Saffron
    { product_id: 6, material_id: 5 }, // Soap uses Herbs
    { product_id: 7, material_id: 2 }, // Kesar Honey uses Honey
    { product_id: 7, material_id: 1 }, // Kesar Honey uses Saffron
    { product_id: 8, material_id: 3 }, // Coasters use Wood
    { product_id: 9, material_id: 5 }, // Gucchi uses Herbs
    { product_id: 10, material_id: 1 }, // Serum uses Saffron
    { product_id: 10, material_id: 5 }, // Serum uses Herbs
  ],
  product_benefits: [
    { product_id: 1, benefit_id: 1 }, // Saffron boosts Immunity
    { product_id: 1, benefit_id: 2 }, // Saffron boosts Glow
    { product_id: 2, benefit_id: 1 }, // Honey boosts Immunity
    { product_id: 2, benefit_id: 5 }, // Honey gives Energy
    { product_id: 4, benefit_id: 2 }, // Walnut oil boosts Glow
    { product_id: 4, benefit_id: 3 }, // Walnut oil supports Cognitive
    { product_id: 5, benefit_id: 4 }, // Lavender oil gives Stress Relief
    { product_id: 6, benefit_id: 2 }, // Soap gives Glow
    { product_id: 7, benefit_id: 1 }, // Kesar Honey - Immunity
    { product_id: 7, benefit_id: 5 }, // Kesar Honey - Energy
    { product_id: 8, benefit_id: 5 }, // Coasters - Energy (decor)
    { product_id: 9, benefit_id: 1 }, // Gucchi - Immunity
    { product_id: 10, benefit_id: 2 }, // Serum - Glow
    { product_id: 10, benefit_id: 4 }, // Serum - Stress Relief
  ],
  product_usage_types: [
    { product_id: 1, usage_type_id: 1 }, // Saffron - Daily Use
    { product_id: 1, usage_type_id: 2 }, // Saffron - Therapy
    { product_id: 1, usage_type_id: 3 }, // Saffron - Beauty
    { product_id: 2, usage_type_id: 1 }, // Honey - Daily Use
    { product_id: 3, usage_type_id: 1 }, // Bowl - Daily Use
    { product_id: 4, usage_type_id: 2 }, // Walnut Oil - Therapy
    { product_id: 4, usage_type_id: 3 }, // Walnut Oil - Beauty
    { product_id: 5, usage_type_id: 2 }, // Lavender - Therapy
    { product_id: 5, usage_type_id: 3 }, // Lavender - Beauty
    { product_id: 6, usage_type_id: 3 }, // Soap - Beauty
    { product_id: 7, usage_type_id: 1 }, // Kesar Honey - Daily
    { product_id: 7, usage_type_id: 4 }, // Kesar Honey - Fitness
    { product_id: 8, usage_type_id: 1 }, // Coasters - Daily Use
    { product_id: 9, usage_type_id: 1 }, // Gucchi - Daily Use
    { product_id: 9, usage_type_id: 4 }, // Gucchi - Fitness
    { product_id: 10, usage_type_id: 3 }, // Serum - Beauty
  ],
  product_related: [
    { product_id: 1, related_product_id: 2 }, // Saffron relates to Honey
    { product_id: 2, related_product_id: 1 }, // Honey relates to Saffron
    { product_id: 4, related_product_id: 5 }, // Walnut oil relates to Lavender
    { product_id: 5, related_product_id: 4 }, // Lavender relates to Walnut oil
    { product_id: 6, related_product_id: 10 },
    { product_id: 7, related_product_id: 2 },
    { product_id: 8, related_product_id: 3 },
    { product_id: 9, related_product_id: 7 },
    { product_id: 10, related_product_id: 6 }
  ],
  blogs: [
    {
      id: 1,
      title: 'The Saffron Heritage: Exploring Kashmir\'s Golden Harvest',
      slug: 'saffron-heritage-kashmir-golden-harvest',
      content: '## The Red Gold of Pampore\n\nFor centuries, the saffron of Kashmir has stood as a global benchmark of ultimate flavor, aroma, and healing potency. In the plateau fields of Pampore, just outside Srinagar, local families continue to cultivate this rare crop utilizing techniques that date back over thousands of years.\n\n### Why Kashmiri Saffron is Unique\n\nUnlike saffron grown in other regions, Kashmiri Saffron is uniquely rich in active elements like **Crocin** (responsible for the deep red hue), **Picrocrocin** (rendering the distinct bittersweet flavor), and **Safranal** (governing the luxurious fragrance). The high-altitude clay soil combined with cool weather cycles provides the optimal environment for producing these powerful stigmas.\n\n### The Art of Hand Harvesting\n\nSaffron harvesting is an exercise in extreme patience. During late autumn, the crocus flowers bloom in bright purple carpets. Flower pluckers must rise at dawn, collecting the blossoms before the sun opens the petals too wide. The delicate dark red stigmas are then separated manually in homesteads by local artisan women, demanding extreme precision and focus.\n\n### Integrating Saffron into your Wellness Routine\n\n1. **Saffron Tea (Kahwa):** Brew natural green tea leaves with cinnamon, crushed cardamom, Saffron strands, and sliced almonds.\n2. **Skincare:** Infuse 3-4 strands in fresh goat milk or organic rosewater and apply as a mask to target pigmentation and reveal an organic skin glow.\n3. **Nightly Elixir:** Steep 2 strands in warm almond milk before sleep to calm the nervous system and promote peaceful rest.',
      featured_image: '/images/blogs/saffron-harvest.jpg',
      category: 'Organic Living',
      tags: 'Saffron,Kashmir,Wellness,Skincare',
      author: 'Ayesha Mir (Lead Ethnobotanist)',
      publish_date: '2026-05-15',
      status: 'published',
      seo_title: 'Kashmiri Saffron Heritage: Pampore Organic Cultivation',
      seo_description: 'Discover the heritage of Kashmiri Saffron, the traditional hand-harvesting process in Pampore, and how to use this luxury organic spice in wellness.',
      related_products: JSON.stringify([1, 2]),
      related_materials: JSON.stringify([1]),
    },
    {
      id: 2,
      title: 'Preserving Heritage: The Untold Story of Walnut Woodcraft',
      slug: 'preserving-heritage-walnut-woodcraft-kashmir',
      content: '## The Sacred Timber of the Valley\n\nWalnut wood carving represents one of the most culturally revered and protected artisan skills of Jammu & Kashmir. Handed down across generations of woodcarvers, this craft transforms logs of slow-grown walnut trees into beautiful heirloom accessories.\n\n### Why Walnut Wood?\n\nKashmiri walnut trees (*Juglans regia*) grow under cold climatic cycles, resulting in extremely dense wood structures with highly unique dark brown and charcoal grain lines. The wood is naturally resistant to woodworms and does not easily warp, making it perfect for food-safe kitchenware and ornate furniture.\n\n### The Craftsmanship Process\n\n1. **Natural Seasoning:** Before a carver\'s chisel ever touches the wood, the logs must be dried naturally for two to five years. This stabilizes the fibers.\n2. **Khatamband and Carving:** Master artisans use specialized chisels to carve intricate nature patterns like Chinar leaves, grapes, and iris flowers into the dense timber.\n3. **Organic Finish:** We avoid toxic chemical varnishes. Instead, our artisans polish the bowls using natural walnut kernels wrapped in clean muslin cloth, releasing high-purity oils directly into the wood fiber.\n\n### Sustainable Stewardship\n\nAt Kashmiri Organic, sustainability is our core promise. We only source walnut wood from trees that have naturally ceased bearing fruit or have been felled by seasonal weather, and we plant three new saplings in our co-operative orchards for each tree used.',
      featured_image: '/images/blogs/walnut-craft.jpg',
      category: 'Natural Living',
      tags: 'Walnut Wood,Craftsmanship,Sustainability,Heritage',
      author: 'Ghulam Rasool (Master Carver)',
      publish_date: '2026-05-20',
      status: 'published',
      seo_title: 'Kashmiri Walnut Woodcraft: Sustainable Handcrafted Luxury',
      seo_description: 'An inside look at the historical art of walnut wood carving in Kashmir, the seasoning process, and the ethical forestry practices supporting our local artisans.',
      related_products: JSON.stringify([3, 4]),
      related_materials: JSON.stringify([3, 4]),
    }
  ],
  inquiries: [],
  testimonials: [
    { id: 1, name: 'Clara Dupont', role: 'Sourcing Director, L\'Élixir Organic (France)', content: 'We source Kashmiri Saffron and Wild Lavender Oil from Kashmiri Organic for our premium botanical skincare lines. The quality is exceptional, and their detailed laboratory reports and shipping logistics make B2B export extremely seamless.', rating: 5, image_url: '/images/testimonials/clara.jpg' },
    { id: 2, name: 'Rajesh Malhotra', role: 'Founder, Himalaya Wellness Retreats', content: 'Our wellness sanctuaries utilize Kashmiri Organic forest honey and walnut woodware. Our guests frequently praise the purity of the honey. Truly the gold standard of organic heritage products.', rating: 5, image_url: '/images/testimonials/rajesh.jpg' },
    { id: 3, name: 'Emma Wilson', role: 'Connoisseur & Naturalist (United Kingdom)', content: 'The hand-carved walnut fruit bowl is an absolute masterpiece in my dining room. Knowing the wood is sourced sustainably and helps support local Kashmiri craft families makes it feel incredibly special.', rating: 5, image_url: '/images/testimonials/emma.jpg' }
  ],
  certifications: [
    { id: 1, name: 'India Organic', description: 'Certified under the National Programme for Organic Production (NPOP) rules.', image_url: '/images/certs/india-organic.png' },
    { id: 2, name: 'USDA Organic', description: 'Certified organic in accordance with US Department of Agriculture standards.', image_url: '/images/certs/usda.png' },
    { id: 3, name: 'ISO 22000:2018', description: 'Certified International Food Safety Management Standards for packing and processing.', image_url: '/images/certs/iso.png' },
    { id: 4, name: 'GI Tag Protection', description: 'Geographical Indication certification protecting authentic origin products of Jammu & Kashmir.', image_url: '/images/certs/gi-tag.png' }
  ],
  seo: [
    { id: 1, path: '/', title: 'Kashmiri Organic | Premium Saffron, Forest Honey & Handcrafted Woodware', description: 'Discover the pure, luxurious organic heritage of Kashmir. Exporting Grade A+ Saffron, raw forest honey, cold-pressed walnut oil, and handcrafted walnut wood products.', keywords: 'kashmiri saffron, organic honey, walnut wood bowl, kashmir organic, bulk saffron export, premium cold pressed oils', og_image: '/images/og-home.jpg' }
  ],
  site_settings: [
    { id: 1, setting_key: 'site_name', setting_value: 'Kashmiri Organic' },
    { id: 2, setting_key: 'site_email', setting_value: 'info@kashmiriorganic.com' },
    { id: 3, setting_key: 'site_phone', setting_value: '+91 98765 43210' },
    { id: 4, setting_key: 'site_whatsapp', setting_value: '+919876543210' },
    { id: 5, setting_key: 'site_address', setting_value: 'Pampore Organic Farms, Highway 1A, Pulwama, Jammu & Kashmir, 192121' },
    { id: 6, setting_key: 'instagram_url', setting_value: 'https://instagram.com/kashmiriorganic' }
  ]
};

// Initialize JSON database if it doesn't exist
const initializeJsonDb = () => {
  if (!fs.existsSync(JSON_DB_PATH)) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(SEED_DATA, null, 2), 'utf-8');
  }
};

// Load JSON db
const getJsonDb = (): LocalDBState => {
  initializeJsonDb();
  try {
    const data = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(data) as LocalDBState;
  } catch (e) {
    console.error('Error reading JSON DB, using seed data:', e);
    return SEED_DATA;
  }
};

// Save JSON db
const saveJsonDb = (data: LocalDBState) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// MySQL Connection Pool (Lazy loaded)
let pool: mysql.Pool | null = null;

const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kashmiri_organic',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

// Main SQL execution client
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T> {
  // If MySQL is configured, execute on MySQL
  if (isMySQLConfigured()) {
    try {
      const dbPool = getPool();
      const [rows] = await dbPool.execute(sql, params);
      return rows as T;
    } catch (error) {
      console.error('MySQL execution failed, falling back to local storage simulator:', error);
      // Fallback to JSON simulator
    }
  }

  // FALLBACK: Local JSON database simulator
  return simulateSQLQuery(sql, params);
}

// Unified, database-agnostic helper to load products with their complete relations hydrated
export async function getProductsWithRelations(): Promise<Product[]> {
  if (isMySQLConfigured()) {
    try {
      const dbPool = getPool();
      
      const [
        [products],
        [product_categories],
        [categories],
        [product_materials],
        [materials],
        [product_benefits],
        [benefits],
        [product_usage_types],
        [usage_types],
        [product_types_mapping],
        [product_types],
        [product_related]
      ] = await Promise.all([
        dbPool.execute('SELECT * FROM products'),
        dbPool.execute('SELECT * FROM product_categories'),
        dbPool.execute('SELECT * FROM categories'),
        dbPool.execute('SELECT * FROM product_materials'),
        dbPool.execute('SELECT * FROM materials'),
        dbPool.execute('SELECT * FROM product_benefits'),
        dbPool.execute('SELECT * FROM benefits'),
        dbPool.execute('SELECT * FROM product_usage_types'),
        dbPool.execute('SELECT * FROM usage_types'),
        dbPool.execute('SELECT * FROM product_types_mapping'),
        dbPool.execute('SELECT * FROM product_types'),
        dbPool.execute('SELECT * FROM product_related')
      ]);

      const localState: any = {
        products,
        product_categories,
        categories,
        product_materials,
        materials,
        product_benefits,
        benefits,
        product_usage_types,
        usage_types,
        product_types_mapping,
        product_types,
        product_related
      };

      return (products as Product[]).map(p => hydrateProductRelations(p, localState));
    } catch (error) {
      console.error('MySQL getProductsWithRelations failed, falling back:', error);
    }
  }

  // Simulator automatically hydrates relations for products in simulateSQLQuery
  return executeQuery<Product[]>('SELECT * FROM products');
}

// Unified helper to load a single product by slug with complete relations hydrated
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isMySQLConfigured()) {
    try {
      const dbPool = getPool();
      const [rows] = await dbPool.execute('SELECT * FROM products WHERE slug = ?', [slug]);
      const product = (rows as Product[])?.[0];
      if (!product) return null;

      const [
        [product_categories],
        [categories],
        [product_materials],
        [materials],
        [product_benefits],
        [benefits],
        [product_usage_types],
        [usage_types],
        [product_types_mapping],
        [product_types],
        [product_related],
        [products]
      ] = await Promise.all([
        dbPool.execute('SELECT * FROM product_categories WHERE product_id = ?', [product.id]),
        dbPool.execute('SELECT * FROM categories'),
        dbPool.execute('SELECT * FROM product_materials WHERE product_id = ?', [product.id]),
        dbPool.execute('SELECT * FROM materials'),
        dbPool.execute('SELECT * FROM product_benefits WHERE product_id = ?', [product.id]),
        dbPool.execute('SELECT * FROM benefits'),
        dbPool.execute('SELECT * FROM product_usage_types WHERE product_id = ?', [product.id]),
        dbPool.execute('SELECT * FROM usage_types'),
        dbPool.execute('SELECT * FROM product_types_mapping WHERE product_id = ?', [product.id]),
        dbPool.execute('SELECT * FROM product_types'),
        dbPool.execute('SELECT * FROM product_related WHERE product_id = ?', [product.id]),
        dbPool.execute('SELECT * FROM products')
      ]);

      const localState: any = {
        products,
        product_categories,
        categories,
        product_materials,
        materials,
        product_benefits,
        benefits,
        product_usage_types,
        usage_types,
        product_types_mapping,
        product_types,
        product_related
      };

      return hydrateProductRelations(product, localState);
    } catch (error) {
      console.error('MySQL getProductBySlug failed, falling back:', error);
    }
  }

  const rows = await executeQuery<Product[]>('SELECT * FROM products WHERE slug = ?', [slug]);
  return rows?.[0] || null;
}

// Highly robust SQL Parser & Simulator for the JSON DB
function simulateSQLQuery(sql: string, params: any[]): any {
  const db = getJsonDb();
  const normalizedSql = sql.trim().replace(/\s+/g, ' ').toLowerCase();

  // 1. SELECT inquires/queries
  if (normalizedSql.startsWith('select')) {
    // Basic match routines
    if (normalizedSql.includes('from users')) {
      if (normalizedSql.includes('where email =')) {
        const email = params[0] || '';
        return db.users.filter(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      }
      if (normalizedSql.includes('where phone =')) {
        const phone = params[0] || '';
        return db.users.filter(u => u.phone === phone);
      }
      if (normalizedSql.includes('where id =')) {
        const id = Number(params[0]);
        return db.users.filter(u => u.id === id);
      }
      return db.users;
    }
    
    if (normalizedSql.includes('from categories')) {
      if (normalizedSql.includes('where slug =')) {
        const slug = params[0] || '';
        return db.categories.filter(c => c.slug === slug);
      }
      return db.categories;
    }

    if (normalizedSql.includes('from product_types') || normalizedSql.includes('from producttypes')) {
      return db.product_types;
    }

    if (normalizedSql.includes('from materials')) {
      if (normalizedSql.includes('where slug =')) {
        const slug = params[0] || '';
        return db.materials.filter(m => m.slug === slug);
      }
      return db.materials;
    }

    if (normalizedSql.includes('from benefits')) {
      return db.benefits;
    }

    if (normalizedSql.includes('from usage_types') || normalizedSql.includes('from usagetypes')) {
      return db.usage_types;
    }

    if (normalizedSql.includes('from testimonials')) {
      return db.testimonials;
    }

    if (normalizedSql.includes('from certifications')) {
      return db.certifications;
    }

    if (normalizedSql.includes('from site_settings') || normalizedSql.includes('from sitesettings')) {
      return db.site_settings;
    }

    if (normalizedSql.includes('from seo')) {
      if (normalizedSql.includes('where path =')) {
        const path = params[0] || '/';
        return db.seo.filter(s => s.path === path);
      }
      return db.seo;
    }

    if (normalizedSql.includes('from inquiries')) {
      // Sort inquiries newest first
      const sortedInquiries = [...db.inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Inject product names
      return sortedInquiries.map(inq => {
        const prod = db.products.find(p => p.id === inq.product_id);
        return {
          ...inq,
          product_name: prod ? prod.name : undefined
        };
      });
    }

    if (normalizedSql.includes('from blogs')) {
      if (normalizedSql.includes('where slug =')) {
        const slug = params[0] || '';
        return db.blogs.filter(b => b.slug === slug);
      }
      if (normalizedSql.includes('where status =')) {
        const status = params[0] || 'published';
        return db.blogs.filter(b => b.status === status);
      }
      return db.blogs;
    }

    if (normalizedSql.includes('from products')) {
      let filtered = [...db.products];

      if (normalizedSql.includes('where slug =')) {
        const slug = params[0] || '';
        const prod = filtered.find(p => p.slug === slug);
        if (prod) {
          // Hydrate relations
          return [hydrateProductRelations(prod, db)];
        }
        return [];
      }

      if (normalizedSql.includes('where id =')) {
        const id = Number(params[0]);
        const prod = filtered.find(p => p.id === id);
        if (prod) {
          return [hydrateProductRelations(prod, db)];
        }
        return [];
      }

      // Hydrate all products
      const hydrated = filtered.map(p => hydrateProductRelations(p, db));
      return hydrated;
    }
  }

  // 2. INSERT inquiries/entries
  if (normalizedSql.startsWith('insert into')) {
    if (normalizedSql.includes('insert into users')) {
      const nextId = db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1;
      const newUser: User = {
        id: nextId,
        name: params[0] || '',
        email: params[1] || '',
        password_hash: params[2] || '',
        phone: params[3] || null,
        otp: params[4] || null,
        otp_expiry: params[5] || null,
        role: params[6] || 'customer',
        created_at: params[7] || new Date().toISOString()
      };
      db.users.push(newUser);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into inquiries')) {
      const nextId = db.inquiries.length > 0 ? Math.max(...db.inquiries.map(i => i.id)) + 1 : 1;
      const newInquiry: Inquiry = {
        id: nextId,
        name: params[0] || '',
        email: params[1] || '',
        phone: params[2] || '',
        company_name: params[3] || '',
        inquiry_type: params[4] || 'whatsapp',
        message: params[5] || '',
        product_id: params[6] ? Number(params[6]) : null,
        status: 'new',
        created_at: new Date().toISOString()
      };
      db.inquiries.push(newInquiry);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into products')) {
      const nextId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1;
      const newProduct: Product = {
        id: nextId,
        name: params[0] || '',
        slug: params[1] || '',
        short_description: params[2] || '',
        long_description: params[3] || '',
        image_url: params[4] || '',
        gallery_urls: params[5] || '[]',
        price: params[6] ? Number(params[6]) : null,
        discount_price: params[7] ? Number(params[7]) : null,
        sku: params[8] || '',
        stock: params[9] ? Number(params[9]) : 0,
        moq: params[10] || '',
        packaging: params[11] || '',
        shipping: params[12] || '',
        availability: params[13] || 'retail',
        certified: params[14] ? 1 : 0,
        export_quality: params[15] ? 1 : 0,
        sub_category: params[16] || '',
        season: params[17] || 'all',
        created_at: new Date().toISOString()
      };
      db.products.push(newProduct);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into blogs')) {
      const nextId = db.blogs.length > 0 ? Math.max(...db.blogs.map(b => b.id)) + 1 : 1;
      const newBlog: Blog = {
        id: nextId,
        title: params[0] || '',
        slug: params[1] || '',
        content: params[2] || '',
        featured_image: params[3] || '',
        category: params[4] || '',
        tags: params[5] || '',
        author: params[6] || '',
        publish_date: params[7] || new Date().toISOString().split('T')[0],
        status: params[8] || 'draft',
        seo_title: params[9] || '',
        seo_description: params[10] || '',
        related_products: params[11] || '[]',
        related_materials: params[12] || '[]'
      };
      db.blogs.push(newBlog);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into materials')) {
      const nextId = db.materials.length > 0 ? Math.max(...db.materials.map(m => m.id)) + 1 : 1;
      const newMaterial: Material = {
        id: nextId,
        name: params[0] || '',
        slug: params[1] || '',
        overview: params[2] || '',
        origin: params[3] || '',
        manufacturing_process: params[4] || '',
        sustainability: params[5] || '',
        benefits: params[6] || '',
        image_url: params[7] || '',
        history: params[8] || '',
        gallery_urls: params[9] || '[]',
        extraction_story: params[10] || ''
      };
      db.materials.push(newMaterial);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into categories')) {
      const nextId = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) + 1 : 1;
      const newCategory: Category = {
        id: nextId,
        name: params[0] || '',
        slug: params[1] || '',
        description: params[2] || '',
        image_url: params[3] || ''
      };
      db.categories.push(newCategory);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into benefits')) {
      const nextId = db.benefits.length > 0 ? Math.max(...db.benefits.map(b => b.id)) + 1 : 1;
      const newBenefit: Benefit = {
        id: nextId,
        name: params[0] || '',
        description: params[1] || ''
      };
      db.benefits.push(newBenefit);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }

    if (normalizedSql.includes('insert into usage_types')) {
      const nextId = db.usage_types.length > 0 ? Math.max(...db.usage_types.map(u => u.id)) + 1 : 1;
      const newUsageType: UsageType = {
        id: nextId,
        name: params[0] || '',
        description: params[1] || ''
      };
      db.usage_types.push(newUsageType);
      saveJsonDb(db);
      return { insertId: nextId, affectedRows: 1 };
    }
  }

  // 3. UPDATE entries
  if (normalizedSql.startsWith('update')) {
    if (normalizedSql.includes('update users')) {
      if (normalizedSql.includes('set otp =') && normalizedSql.includes('otp_expiry =')) {
        const otp = params[0];
        const otp_expiry = params[1];
        if (normalizedSql.includes('where id =')) {
          const id = Number(params[2]);
          const u = db.users.find(x => x.id === id);
          if (u) {
            u.otp = otp;
            u.otp_expiry = otp_expiry;
            saveJsonDb(db);
            return { affectedRows: 1 };
          }
        } else if (normalizedSql.includes('where phone =')) {
          const phone = params[2];
          const u = db.users.find(x => x.phone === phone);
          if (u) {
            u.otp = otp;
            u.otp_expiry = otp_expiry;
            saveJsonDb(db);
            return { affectedRows: 1 };
          }
        }
      } else if (normalizedSql.includes('set name =') && normalizedSql.includes('email =')) {
        const name = params[0];
        const email = params[1];
        const id = Number(params[2]);
        const u = db.users.find(x => x.id === id);
        if (u) {
          u.name = name;
          u.email = email;
          saveJsonDb(db);
          return { affectedRows: 1 };
        }
      }
    }

    if (normalizedSql.includes('update inquiries')) {
      if (normalizedSql.includes('set status =')) {
        const status = params[0];
        const id = Number(params[1]);
        const inq = db.inquiries.find(i => i.id === id);
        if (inq) {
          inq.status = status;
          saveJsonDb(db);
          return { affectedRows: 1 };
        }
      }
    }

    if (normalizedSql.includes('update site_settings')) {
      const val = params[0];
      const key = params[1];
      const setting = db.site_settings.find(s => s.setting_key === key);
      if (setting) {
        setting.setting_value = val;
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }

    if (normalizedSql.includes('update products')) {
      const id = Number(params[18]);
      const pIdx = db.products.findIndex(p => p.id === id);
      if (pIdx > -1) {
        db.products[pIdx] = {
          ...db.products[pIdx],
          name: params[0],
          slug: params[1],
          short_description: params[2],
          long_description: params[3],
          image_url: params[4],
          gallery_urls: params[5],
          price: params[6] ? Number(params[6]) : null,
          discount_price: params[7] ? Number(params[7]) : null,
          sku: params[8],
          stock: params[9] ? Number(params[9]) : 0,
          moq: params[10],
          packaging: params[11],
          shipping: params[12],
          availability: params[13],
          certified: params[14] ? 1 : 0,
          export_quality: params[15] ? 1 : 0,
          sub_category: params[16],
          season: params[17] || 'all'
        };
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }

    if (normalizedSql.includes('update blogs')) {
      const id = Number(params[13]);
      const bIdx = db.blogs.findIndex(b => b.id === id);
      if (bIdx > -1) {
        db.blogs[bIdx] = {
          ...db.blogs[bIdx],
          title: params[0],
          slug: params[1],
          content: params[2],
          author: params[3],
          category: params[4],
          tags: params[5],
          status: params[6],
          seo_title: params[7],
          seo_description: params[8],
          featured_image: params[9],
          related_products: params[10],
          related_materials: params[11],
          publish_date: params[12]
        };
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }

    if (normalizedSql.includes('update materials')) {
      const id = Number(params[11]);
      const mIdx = db.materials.findIndex(m => m.id === id);
      if (mIdx > -1) {
        db.materials[mIdx] = {
          ...db.materials[mIdx],
          name: params[0],
          slug: params[1],
          overview: params[2],
          origin: params[3],
          manufacturing_process: params[4],
          sustainability: params[5],
          benefits: params[6],
          image_url: params[7],
          history: params[8] || '',
          gallery_urls: params[9] || '[]',
          extraction_story: params[10] || ''
        };
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }

    if (normalizedSql.includes('update categories')) {
      const id = Number(params[4]);
      const cIdx = db.categories.findIndex(c => c.id === id);
      if (cIdx > -1) {
        db.categories[cIdx] = {
          ...db.categories[cIdx],
          name: params[0],
          slug: params[1],
          description: params[2],
          image_url: params[3]
        };
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }

    if (normalizedSql.includes('update benefits')) {
      const id = Number(params[2]);
      const bIdx = db.benefits.findIndex(b => b.id === id);
      if (bIdx > -1) {
        db.benefits[bIdx] = {
          ...db.benefits[bIdx],
          name: params[0],
          description: params[1]
        };
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }

    if (normalizedSql.includes('update usage_types')) {
      const id = Number(params[2]);
      const uIdx = db.usage_types.findIndex(u => u.id === id);
      if (uIdx > -1) {
        db.usage_types[uIdx] = {
          ...db.usage_types[uIdx],
          name: params[0],
          description: params[1]
        };
        saveJsonDb(db);
        return { affectedRows: 1 };
      }
    }
  }

  // 4. DELETE entries
  if (normalizedSql.startsWith('delete')) {
    if (normalizedSql.includes('from users')) {
      const id = Number(params[0]);
      db.users = db.users.filter(u => u.id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from inquiries')) {
      const id = Number(params[0]);
      db.inquiries = db.inquiries.filter(i => i.id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from products')) {
      const id = Number(params[0]);
      db.products = db.products.filter(p => p.id !== id);
      db.product_categories = db.product_categories.filter(pc => pc.product_id !== id);
      db.product_materials = db.product_materials.filter(pm => pm.product_id !== id);
      db.product_benefits = db.product_benefits.filter(pb => pb.product_id !== id);
      db.product_usage_types = db.product_usage_types.filter(pu => pu.product_id !== id);
      db.product_types_mapping = db.product_types_mapping.filter(pt => pt.product_id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from blogs')) {
      const id = Number(params[0]);
      db.blogs = db.blogs.filter(b => b.id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from materials')) {
      const id = Number(params[0]);
      db.materials = db.materials.filter(m => m.id !== id);
      db.product_materials = db.product_materials.filter(pm => pm.material_id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from categories')) {
      const id = Number(params[0]);
      db.categories = db.categories.filter(c => c.id !== id);
      db.product_categories = db.product_categories.filter(pc => pc.category_id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from benefits')) {
      const id = Number(params[0]);
      db.benefits = db.benefits.filter(b => b.id !== id);
      db.product_benefits = db.product_benefits.filter(pb => pb.benefit_id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }

    if (normalizedSql.includes('from usage_types')) {
      const id = Number(params[0]);
      db.usage_types = db.usage_types.filter(u => u.id !== id);
      db.product_usage_types = db.product_usage_types.filter(pu => pu.usage_type_id !== id);
      saveJsonDb(db);
      return { affectedRows: 1 };
    }
  }

  // For many-to-many relationship syncs in local JSON
  if (normalizedSql.includes('delete from product_categories')) {
    const prodId = Number(params[0]);
    db.product_categories = db.product_categories.filter(pc => pc.product_id !== prodId);
    saveJsonDb(db);
    return { affectedRows: 1 };
  }
  if (normalizedSql.includes('insert into product_categories')) {
    db.product_categories.push({ product_id: Number(params[0]), category_id: Number(params[1]) });
    saveJsonDb(db);
    return { affectedRows: 1 };
  }

  if (normalizedSql.includes('delete from product_materials')) {
    const prodId = Number(params[0]);
    db.product_materials = db.product_materials.filter(pm => pm.product_id !== prodId);
    saveJsonDb(db);
    return { affectedRows: 1 };
  }
  if (normalizedSql.includes('insert into product_materials')) {
    db.product_materials.push({ product_id: Number(params[0]), material_id: Number(params[1]) });
    saveJsonDb(db);
    return { affectedRows: 1 };
  }

  if (normalizedSql.includes('delete from product_benefits')) {
    const prodId = Number(params[0]);
    db.product_benefits = db.product_benefits.filter(pb => pb.product_id !== prodId);
    saveJsonDb(db);
    return { affectedRows: 1 };
  }
  if (normalizedSql.includes('insert into product_benefits')) {
    db.product_benefits.push({ 
      product_id: Number(params[0]), 
      benefit_id: Number(params[1]),
      custom_description: params[2] || ''
    });
    saveJsonDb(db);
    return { affectedRows: 1 };
  }

  if (normalizedSql.includes('delete from product_usage_types')) {
    const prodId = Number(params[0]);
    db.product_usage_types = db.product_usage_types.filter(pu => pu.product_id !== prodId);
    saveJsonDb(db);
    return { affectedRows: 1 };
  }
  if (normalizedSql.includes('insert into product_usage_types')) {
    db.product_usage_types.push({ 
      product_id: Number(params[0]), 
      usage_type_id: Number(params[1]),
      custom_description: params[2] || ''
    });
    saveJsonDb(db);
    return { affectedRows: 1 };
  }

  if (normalizedSql.includes('delete from product_types_mapping')) {
    const prodId = Number(params[0]);
    db.product_types_mapping = db.product_types_mapping.filter(pt => pt.product_id !== prodId);
    saveJsonDb(db);
    return { affectedRows: 1 };
  }
  if (normalizedSql.includes('insert into product_types_mapping')) {
    db.product_types_mapping.push({ product_id: Number(params[0]), type_id: Number(params[1]) });
    saveJsonDb(db);
    return { affectedRows: 1 };
  }

  return [];
}

// Helper to fully hydrate a product's relationships from the local DB state
function hydrateProductRelations(prod: Product, db: LocalDBState): Product {
  const pCategories = db.product_categories
    .filter(pc => pc.product_id === prod.id)
    .map(pc => db.categories.find(c => c.id === pc.category_id))
    .filter(Boolean) as Category[];

  const pTypes = db.product_types_mapping
    .filter(pt => pt.product_id === prod.id)
    .map(pt => db.product_types.find(t => t.id === pt.type_id))
    .filter(Boolean) as ProductType[];

  const pMaterials = db.product_materials
    .filter(pm => pm.product_id === prod.id)
    .map(pm => db.materials.find(m => m.id === pm.material_id))
    .filter(Boolean) as Material[];

  const pBenefits = db.product_benefits
    .filter(pb => pb.product_id === prod.id)
    .map(pb => {
      const b = db.benefits.find(b => b.id === pb.benefit_id);
      if (!b) return null;
      return {
        ...b,
        description: pb.custom_description || b.description
      };
    })
    .filter(Boolean) as Benefit[];

  const pUsages = db.product_usage_types
    .filter(pu => pu.product_id === prod.id)
    .map(pu => {
      const u = db.usage_types.find(u => u.id === pu.usage_type_id);
      if (!u) return null;
      return {
        ...u,
        description: pu.custom_description || u.description
      };
    })
    .filter(Boolean) as UsageType[];

  // Related products
  const pRelatedIds = db.product_related
    .filter(pr => pr.product_id === prod.id)
    .map(pr => pr.related_product_id);
    
  const pRelated = db.products
    .filter(p => pRelatedIds.includes(p.id))
    .map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      short_description: p.short_description,
      image_url: p.image_url,
      availability: p.availability,
      certified: p.certified,
      export_quality: p.export_quality
    })) as Product[];

  return {
    ...prod,
    categories: pCategories,
    product_types: pTypes,
    materials: pMaterials,
    benefits: pBenefits,
    usage_types: pUsages,
    related_products: pRelated
  };
}

// Generate the database schema SQL for Vercel/VPS/Hostinger setups
export const SCHEMA_SQL = `
-- Kashmiri Organic - Database Schema
-- Optimized for MySQL / Normalized Relational Database Design

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) UNIQUE DEFAULT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) UNIQUE DEFAULT NULL,
  otp VARCHAR(10) DEFAULT NULL,
  otp_expiry TIMESTAMP DEFAULT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (email),
  INDEX (phone)
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  INDEX (slug)
);

CREATE TABLE IF NOT EXISTS product_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  INDEX (slug)
);

CREATE TABLE IF NOT EXISTS materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  overview TEXT,
  origin VARCHAR(255),
  manufacturing_process TEXT,
  sustainability TEXT,
  benefits TEXT,
  image_url VARCHAR(255),
  history TEXT,
  gallery_urls TEXT,
  extraction_story TEXT,
  INDEX (slug)
);

CREATE TABLE IF NOT EXISTS benefits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS usage_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  long_description TEXT,
  image_url VARCHAR(255) NOT NULL,
  gallery_urls TEXT, -- JSON Array of images
  availability VARCHAR(255) DEFAULT 'retail', -- bulk, retail, export
  certified TINYINT(1) DEFAULT 0,
  export_quality TINYINT(1) DEFAULT 0,
  moq VARCHAR(100),
  packaging TEXT,
  shipping TEXT,
  sub_category VARCHAR(255) DEFAULT '',
  season VARCHAR(100) DEFAULT 'all',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (slug)
);

-- Many-to-Many Join Tables for Product Relationships
CREATE TABLE IF NOT EXISTS product_categories (
  product_id INT,
  category_id INT,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_types_mapping (
  product_id INT,
  type_id INT,
  PRIMARY KEY (product_id, type_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) REFERENCES product_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_materials (
  product_id INT,
  material_id INT,
  PRIMARY KEY (product_id, material_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_benefits (
  product_id INT,
  benefit_id INT,
  PRIMARY KEY (product_id, benefit_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (benefit_id) REFERENCES benefits(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_usage_types (
  product_id INT,
  usage_type_id INT,
  PRIMARY KEY (product_id, usage_type_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (usage_type_id) REFERENCES usage_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_related (
  product_id INT,
  related_product_id INT,
  PRIMARY KEY (product_id, related_product_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  featured_image VARCHAR(255),
  category VARCHAR(100),
  tags VARCHAR(255),
  author VARCHAR(100),
  publish_date DATE,
  status VARCHAR(20) DEFAULT 'draft', -- draft, published
  seo_title VARCHAR(255),
  seo_description TEXT,
  related_products TEXT, -- JSON Array of IDs
  related_materials TEXT, -- JSON Array of IDs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (slug)
);

CREATE TABLE IF NOT EXISTS inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  inquiry_type VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, quote, bulk, contact
  message TEXT NOT NULL,
  product_id INT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, read, processed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  content TEXT,
  rating INT DEFAULT 5,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS seo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  keywords TEXT,
  og_image VARCHAR(255),
  INDEX (path)
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  INDEX (setting_key)
);
`;

// Run initial JSON database seed
initializeJsonDb();
