'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, User, MapPin, Award, PhoneCall, ArrowRight, Heart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  image_url: string;
  gallery_urls: string;
  availability: string;
  certified: number;
  export_quality: number;
  moq: string;
  packaging: string;
  shipping: string;
  created_at: string;
  sub_category?: string;
  price?: number | null;
  discount_price?: number | null;
  sku?: string;
  stock?: number;
  season?: string;
}

interface GuildInfo {
  key: string;
  name: string;
  title: string;
  localTitle: string;
  location: string;
  heritageAge: string;
  philosophy: string;
  storyMarkdown: string;
  artisanLeader: {
    name: string;
    role: string;
    avatarUrl: string;
    quote: string;
  };
  details: { label: string; value: string }[];
  bgImage: string;
}

const GUILDS: GuildInfo[] = [
  {
    key: 'weavers',
    name: 'Pashmina Weavers',
    title: 'The Loom of Dreams',
    localTitle: 'Sada Pashmina & Kani Loom Guilds',
    location: 'Old City Srinagar & Ganderbal Highlands',
    heritageAge: '600+ Years Tradition',
    philosophy: 'Preserving the incredible refinement of hand-spun, hand-woven Changthangi pashm fibers, spun to 12-15 microns.',
    storyMarkdown: 'Pashmina weaving is the spiritual heartbeat of Kashmiri textiles. Originating from the undercoat of Changthangi goats living at altitudes above 14,000 feet in Ladakh, the raw wool (Pashm) is transported to Srinagar. Here, women spin it by hand on traditional wheels (Charkhas) before master weavers handloom it over weeks. One hand-embroidered Sozni or Kani shawl represents months of dedicated mathematical weave planning.',
    artisanLeader: {
      name: 'Ustad Ghulam Mohammad',
      role: '5th Generation Master Weaver',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      quote: "Every thread has a voice. On the loom, we are not just weaving fabric; we are scripting our ancestors' prayers into silk and wool."
    },
    details: [
      { label: 'Fiber Diameter', value: '12 - 14.5 Microns' },
      { label: 'Weaving Time', value: '3 weeks to 18 months' },
      { label: 'Traditional Dyeing', value: 'Organic Walnut, Saffron, Indigo' },
      { label: 'Certification', value: 'GI (Geographical Indication) Registered' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'carvers',
    name: 'Walnut Wood Carvers',
    title: 'The Breath of Walnut Wood',
    localTitle: 'Kharadi Woodworking Guilds',
    location: 'Srinagar, Safapora & Anantnag Groves',
    heritageAge: '450+ Years Tradition',
    philosophy: 'Turning seasoned walnut timber into timeless, intricately carved heirlooms reflecting the flora and fauna of the valley.',
    storyMarkdown: 'Kashmiri walnut wood carving is a specialized craft protected under Geographical Indication (GI). The slow-grown wood of Juglans Regia is extremely strong, yet soft enough for detailed chiseling. Wood logs are air-seasoned naturally for 2 to 5 years. Craftsmen use up to 40 different shapes of hand-forged iron chisels (Wathol) to carve delicate 3D patterns, famously featuring Chinar leaves, grapes, and iris flowers.',
    artisanLeader: {
      name: 'Mohammad Yusuf Bhat',
      role: 'Master Kharadi Carver',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      quote: "Walnut wood requires patience. You cannot rush the seasoning, and you cannot force the chisel. The wood tells you where to carve."
    },
    details: [
      { label: 'Wood Seasoning', value: '3 to 5 Years Natural Dehydration' },
      { label: 'Tools Utilized', value: 'Hand-Forged Steel Chisels' },
      { label: 'Natural Glaze', value: 'Stone Polishing & Walnut Oil Polish' },
      { label: 'GI Protection', value: 'Registered Kashmiri Handicraft' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'farmers',
    name: 'Saffron Farmers',
    title: 'The Pampore Gold Harvest',
    localTitle: 'Kong-Posh Cultivators',
    location: 'Pampore Karevas, Pulwama',
    heritageAge: '750+ Years Tradition',
    philosophy: 'Nurturing Crocus Sativus bulbs in the unique alluvial lacustrine soils (Karevas) to produce the world’s most potent saffron.',
    storyMarkdown: 'Pampore, known as the Saffron Town of Kashmir, is one of the very few places in the world that cultivates saffron at high altitudes. The dry-farmed soil holds exact minerals that yield the Crocin, Safranal, and Picrocrocin levels that give Kashmiri Mongra Saffron its dark violet-crimson color and medicinal quality. Hand-harvested in a short 2-week window in Autumn, it takes over 150,000 flowers to produce just one kilogram.',
    artisanLeader: {
      name: 'Abdul Rehman Dar',
      role: 'Senior Saffron Grower',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      quote: "Saffron is our gold, but it demands our sweat. When the Pampore fields turn purple under the morning mist, the beauty pays for everything."
    },
    details: [
      { label: 'Active Compound (Crocin)', value: '8.5%+ (World Highest Grade)' },
      { label: 'Harvesting Method', value: 'Before Sunrise Hand Plucking' },
      { label: 'Soil Type', value: 'Pulwama Karevas (Alluvial Silt)' },
      { label: 'Farming Practice', value: 'Zero chemical fertilizers' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    key: 'beekeepers',
    name: 'Nomadic Beekeepers',
    title: 'The Nomadic Honey Journey',
    localTitle: 'Pahadi Honey Hunter Collectives',
    location: 'High-Altitude Himalayan Meadows',
    heritageAge: 'Centuries of Wild Foraging',
    philosophy: 'Migrating hives following wildflower bloom cycles to extract pure, unpasteurized honey full of natural enzymes.',
    storyMarkdown: 'Our beekeepers practice ethical, migratory apiculture. They transport wooden hives from the low valleys in Spring up to the high alpine meadows in Summer. Following the blossoms of wild Acacia and mountain lavender, the bees forage in pesticide-free zones. The honey is cold-filtered once through cotton mesh to retain bioactive pollens, with zero heating or syrup dilution.',
    artisanLeader: {
      name: 'Bashir Ahmad Chopan',
      role: 'Nomadic Beekeeper',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      quote: "My hives travel to places where roads don't go. The bees gather nectar from clean mountain flowers, and that is why our honey is medicine."
    },
    details: [
      { label: 'Purity Level', value: '100% Unpasteurized Raw Honey' },
      { label: 'Hives Placement', value: 'Altitude 1,800m - 2,800m' },
      { label: 'Floral Source', value: 'Wild Acacia, Lavender, Alpine Thyme' },
      { label: 'Extraction', value: 'Gravity-led spin, no-heating' }
    ],
    bgImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function ArtisansPage() {
  const searchParams = useSearchParams();
  const guildParam = searchParams.get('guild');

  const [activeGuild, setActiveGuild] = useState<string>('weavers');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL parameter if present
  useEffect(() => {
    if (guildParam && GUILDS.some(g => g.key === guildParam)) {
      setActiveGuild(guildParam);
    }
  }, [guildParam]);

  // Load products client-side
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        } else {
          const response = await fetch('/api/products');
          const data = await response.json();
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedGuildData = useMemo(() => {
    return GUILDS.find(g => g.key === activeGuild) || GUILDS[0];
  }, [activeGuild]);

  // Filter products by artisan association
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const name = p.name.toLowerCase();
      const desc = p.short_description.toLowerCase();
      const longDesc = p.long_description.toLowerCase();
      
      if (activeGuild === 'weavers') {
        return name.includes('pashmina') || name.includes('shawl') || name.includes('wool') || desc.includes('weave');
      }
      if (activeGuild === 'carvers') {
        return name.includes('wood') || name.includes('coaster') || desc.includes('carve') || p.sub_category?.toLowerCase().includes('wood');
      }
      if (activeGuild === 'farmers') {
        return name.includes('saffron') || name.includes('kesar') || name.includes('gucchi') || name.includes('serum') || name.includes('mushroom');
      }
      if (activeGuild === 'beekeepers') {
        return name.includes('honey');
      }
      return false;
    });
  }, [products, activeGuild]);

  return (
    <div className="min-h-screen bg-bg-cream text-text-primary pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-[0.25em] pl-1 block">Preserving Ancient Guilds</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-green tracking-tight leading-tight">
            The Guardians of Kashmiri Craft
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
            Meet the master weavers, woodcarvers, saffron farmers, and nomadic beekeepers who carry forward the Geographical Indication (GI) protected legacies of the Kashmir Valley.
          </p>
        </div>
      </div>

      {/* Guilds Tab Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-bg-beige/40 rounded-2xl p-2 border border-brand-green/5 max-w-4xl mx-auto flex justify-between gap-1 overflow-x-auto">
          {GUILDS.map((guild) => (
            <button
              key={guild.key}
              onClick={() => setActiveGuild(guild.key)}
              className={`flex-1 min-w-[120px] py-4 px-4 rounded-xl text-center cursor-pointer transition-all duration-300 ${
                activeGuild === guild.key
                  ? 'bg-brand-green text-bg-cream shadow font-bold font-serif'
                  : 'text-text-secondary hover:bg-bg-beige/80 hover:text-brand-green'
              }`}
            >
              <span className="block text-xs uppercase tracking-wider">{guild.name}</span>
              <span className={`block text-[9px] font-normal italic ${activeGuild === guild.key ? 'text-brand-gold' : 'text-text-muted'}`}>
                {guild.localTitle.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Guild Profile Card & Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-bg-beige/20 border border-brand-green/10 rounded-3xl overflow-hidden p-6 sm:p-10"
        >
          {/* Guild Heritage & Story */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-gold" /> {selectedGuildData.heritageAge}
                </span>
                <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" /> {selectedGuildData.location}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green leading-tight">
                {selectedGuildData.title}
              </h2>
              
              <p className="text-xs uppercase font-extrabold tracking-wider text-brand-gold pl-1">
                {selectedGuildData.localTitle}
              </p>
              
              <p className="text-sm text-text-primary/95 leading-relaxed font-light">
                {selectedGuildData.storyMarkdown}
              </p>

              <div className="bg-bg-cream border border-brand-green/5 p-5 rounded-2xl space-y-2">
                <span className="text-[9px] uppercase font-extrabold text-brand-green tracking-widest">Guild Philosophy</span>
                <p className="text-xs text-text-muted italic leading-relaxed font-light">
                  "{selectedGuildData.philosophy}"
                </p>
              </div>
            </div>

            {/* Technical Details Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-brand-green/15 pt-6">
              {selectedGuildData.details.map((detail, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider block">{detail.label}</span>
                  <span className="text-xs font-semibold text-brand-green block">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Artisan Portrait & Quote */}
          <div className="lg:col-span-5 bg-brand-green text-bg-cream rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-8 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-gold/60">
                  <img 
                    src={selectedGuildData.artisanLeader.avatarUrl} 
                    alt={selectedGuildData.artisanLeader.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-bg-cream">{selectedGuildData.artisanLeader.name}</h4>
                  <p className="text-[10px] text-brand-gold uppercase tracking-wider mt-0.5">{selectedGuildData.artisanLeader.role}</p>
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-3 -top-5 text-brand-gold opacity-15 font-serif text-7xl select-none">“</span>
                <p className="text-sm font-serif italic text-bg-cream/90 leading-relaxed pl-1 pt-1">
                  {selectedGuildData.artisanLeader.quote}
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2 text-brand-gold text-xs font-extrabold uppercase tracking-widest pl-1">
                <Shield className="w-4 h-4 text-brand-gold" /> Fair-Trade Guild Sourced
              </div>
              <p className="text-[11px] text-bg-cream/80 font-light leading-relaxed pl-1">
                By purchasing these collections, you directly fund artisan healthcare cooperatives and children's traditional schooling in Ganderbal and Srinagar.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Products Grid of the Artisan Guild */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-brand-green/10 pb-4 mb-8 flex justify-between items-baseline">
          <h3 className="font-serif text-2xl font-bold text-brand-green">
            Artisan Offerings
          </h3>
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
            {filteredProducts.length} Authenticated Works
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-brand-green/10 border-t-brand-gold rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-text-muted">Loading artisan archive...</span>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-bg-cream/40 border border-brand-green/10 rounded-2xl overflow-hidden flex flex-col luxury-shadow hover:border-brand-gold/40 transition-all duration-300 relative"
                  >
                    <div className="absolute top-4 left-4 z-10">
                      {product.certified === 1 && (
                        <span className="bg-emerald-950/80 backdrop-blur-sm text-emerald-300 border border-emerald-500/20 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow">
                          USDA Organic
                        </span>
                      )}
                    </div>

                    <div className="h-64 overflow-hidden relative bg-bg-mist border-b border-brand-green/5">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                            {product.sub_category || 'Handcrafted'}
                          </span>
                          <span className="text-[10px] font-semibold text-text-muted capitalize">
                            📦 MOQ: {product.moq}
                          </span>
                        </div>
                        
                        <h4 className="font-serif text-lg font-bold text-brand-green group-hover:text-brand-gold transition-colors duration-300">
                          {product.name}
                        </h4>
                        
                        <p className="text-xs text-text-muted leading-relaxed font-light line-clamp-2">
                          {product.short_description}
                        </p>
                      </div>

                      <div className="border-t border-brand-green/5 pt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider">Heritage Sourced</span>
                          <span className="text-xs font-bold text-brand-green">GI Verified</span>
                        </div>
                        
                        <Link
                          href={`/products/${product.slug}`}
                          className="bg-brand-green hover:bg-brand-gold text-bg-cream hover:text-brand-green font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer"
                        >
                          Explore Sourcing <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-bg-beige/25 border border-brand-green/10 rounded-3xl p-10 text-center space-y-6 max-w-xl mx-auto">
                <Sparkles className="w-10 h-10 text-brand-gold mx-auto" />
                <div className="space-y-2">
                  <h4 className="font-serif text-lg font-bold text-brand-green">Custom {selectedGuildData.name} Commissions</h4>
                  <p className="text-xs text-text-muted font-light leading-relaxed">
                    Due to extreme scarcity, hand-woven Pashmina and high-grade wearables are produced exclusively to order. Let our श्रीनगर (Srinagar) desk organize custom commissions for your retail brand or private wardrobe.
                  </p>
                </div>
                <Link
                  href="/custom-pashmina"
                  className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-gold text-bg-cream hover:text-brand-green font-bold text-[10px] uppercase tracking-wider px-5 py-3 rounded-full transition-all duration-300"
                >
                  Configure Custom Pashmina <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
