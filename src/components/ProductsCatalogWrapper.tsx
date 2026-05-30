'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product, Category, Material, ProductType } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BadgeCheck, RotateCcw, ShieldCheck, HelpCircle, ArrowRight, Compass } from 'lucide-react';

interface ProductsCatalogWrapperProps {
  initialProducts: Product[];
  categories: Category[];
  materials: Material[];
  productTypes: ProductType[];
}

export default function ProductsCatalogWrapper({
  initialProducts,
  categories,
  materials,
  productTypes,
}: ProductsCatalogWrapperProps) {
  // Client state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sidebar checkbox states
  const [onlyOrganic, setOnlyOrganic] = useState<boolean>(false);
  const [onlyExport, setOnlyExport] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Hardcoded visual mapping for products
  const productImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // saffron
    2: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', // honey
    3: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80', // bowl
    4: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', // oil
    5: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80', // lavender
    6: 'https://images.unsplash.com/photo-1607006342411-92fc2a41d7c7?auto=format&fit=crop&w=600&q=80', // soap
    7: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80', // kesar badam honey
    8: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=600&q=80', // coaster
    9: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80', // gucchi
    10: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // glow serum
  };

  const materialImages: Record<string, string> = {
    saffron: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    wood: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=400&q=80',
    walnut: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    herbs: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80',
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSearchQuery('');
    setOnlyOrganic(false);
    setOnlyExport(false);
    setSelectedType('all');
    setSelectedAvailability('all');
  };

  // Dynamic filter matching
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inName = product.name.toLowerCase().includes(query);
        const inShort = product.short_description.toLowerCase().includes(query);
        const inLong = product.long_description.toLowerCase().includes(query);
        if (!inName && !inShort && !inLong) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all') {
        const matchesCategory = product.categories?.some(c => c.slug === selectedCategory);
        if (!matchesCategory) return false;
      }

      // 3. Material
      if (selectedMaterial !== 'all') {
        const matchesMaterial = product.materials?.some(m => m.slug === selectedMaterial);
        if (!matchesMaterial) return false;
      }

      // 4. Organic USDA cert
      if (onlyOrganic && product.certified !== 1) return false;

      // 5. Premium Export Quality
      if (onlyExport && product.export_quality !== 1) return false;

      // 6. Product Type
      if (selectedType !== 'all') {
        const matchesType = product.product_types?.some(t => t.slug === selectedType);
        if (!matchesType) return false;
      }

      // 7. Sourcing Availability
      if (selectedAvailability !== 'all') {
        const parts = product.availability.split(',').map(s => s.trim());
        if (!parts.includes(selectedAvailability)) return false;
      }

      return true;
    });
  }, [initialProducts, searchQuery, selectedCategory, selectedMaterial, onlyOrganic, onlyExport, selectedType, selectedAvailability]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* ========================================================
          1. PRODUCT HERO (Top full width box)
          ======================================================== */}
      <section className="bg-brand-green text-bg-cream py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Catalog</span>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto relative z-10 text-center lg:text-left"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            Premium Sourcing & Discovery
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-bg-cream mb-4">
            Organic Valley Archives
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            Our products combine the absolute integrity of rain-fed organic farming with luxury aesthetic presentation. Filter by mountain material, active categories, or usage styles to explore.
          </p>
        </motion.div>
      </section>

      {/* ========================================================
          2. CATEGORIES HORIZONTAL PILL CIRCLE LIST (Under Hero)
          ======================================================== */}
      <section className="py-6 border-b border-brand-green/10 bg-bg-cream/50 backdrop-blur-sm sticky top-[60px] z-30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold pr-2">Collections:</span>
            {/* All categories circle pill */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-5 py-2.5 rounded-full border cursor-pointer font-medium tracking-wide transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-green text-brand-gold border-brand-green font-bold shadow-md'
                  : 'bg-transparent text-text-secondary border-brand-green/15 hover:border-brand-gold'
              }`}
            >
              All Categories
            </motion.button>

            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs px-5 py-2.5 rounded-full border cursor-pointer font-medium tracking-wide transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-green text-brand-gold border-brand-green font-bold shadow-md'
                    : 'bg-transparent text-text-secondary border-brand-green/15 hover:border-brand-gold'
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. DOUBLE COLUMN LAYOUT (Filters Left, Products Right)
          ======================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. SIDEBAR: All the filters for products (Left Column) */}
          <aside className="lg:col-span-3 flex flex-col gap-6 sticky top-[140px] z-20">
            <div className="bg-bg-cream rounded-3xl p-6 border border-brand-green/10 luxury-shadow flex flex-col gap-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-brand-green/5">
                <span className="font-serif font-bold text-brand-green flex items-center gap-1.5">
                  Filter Coordinates
                </span>
                {(selectedCategory !== 'all' || selectedMaterial !== 'all' || searchQuery.trim() || onlyOrganic || onlyExport || selectedType !== 'all' || selectedAvailability !== 'all') && (
                  <motion.button
                    whileHover={{ rotate: -90 }}
                    onClick={resetFilters}
                    className="text-[10px] uppercase font-bold text-brand-brown hover:text-brand-gold cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </motion.button>
                )}
              </div>

              {/* 1. Interactive Search Bar Inside Sidebar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-beige/40 text-xs placeholder-text-muted text-text-primary px-4 py-2.5 pl-9 rounded-xl border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* 2. Quality Badges (Checkboxes) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-3">Authenticity</h4>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-text-secondary select-none">
                    <input
                      type="checkbox"
                      checked={onlyOrganic}
                      onChange={(e) => setOnlyOrganic(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-green border-brand-green/20 focus:ring-brand-gold cursor-pointer"
                    />
                    USDA Certified Organic
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-text-secondary select-none">
                    <input
                      type="checkbox"
                      checked={onlyExport}
                      onChange={(e) => setOnlyExport(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-green border-brand-green/20 focus:ring-brand-gold cursor-pointer"
                    />
                    Premium Export Grade
                  </label>
                </div>
              </div>

              {/* 3. Product Sourcing Types */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-brown mb-3">Product Type</h4>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-bg-beige/40 text-xs text-text-secondary px-3 py-2.5 rounded-xl border border-brand-green/10 focus:outline-none focus:border-brand-gold"
                >
                  <option value="all">All Types</option>
                  {productTypes.map(t => (
                    <option key={t.id} value={t.slug}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* 4. Sourcing Availability */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green mb-3">Sourcing Volume</h4>
                <div className="flex flex-col gap-1.5">
                  {['all', 'retail', 'bulk', 'export'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedAvailability(size)}
                      className={`text-left text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer capitalize ${
                        selectedAvailability === size
                          ? 'bg-brand-sage/20 text-brand-green font-bold'
                          : 'text-text-secondary hover:bg-bg-beige/40'
                      }`}
                    >
                      {size === 'all' ? 'All Packaging Sizes' : size + ' Packings'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* B2B Sourcing Support Box */}
            <div className="bg-brand-green text-bg-cream rounded-3xl p-6 border border-brand-gold/10 luxury-shadow flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <Compass className="w-24 h-24 text-bg-cream" />
              </div>
              <h3 className="font-serif text-lg font-bold text-brand-gold">Custom Sourcing</h3>
              <p className="text-xs text-bg-cream/80 leading-relaxed font-light">
                Do you require specialized private labeling packaging, specific bulk certifications, or high volume pricing?
              </p>
              <Link
                href="/inquiry"
                className="mt-2 w-full text-center bg-brand-gold hover:bg-brand-gold/90 text-brand-green py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 duration-200"
              >
                Inquire Directly
              </Link>
            </div>
          </aside>

          {/* B. PRODUCT LIST: Grid layout (Right Column) */}
          <main className="lg:col-span-9 flex flex-col gap-6">
            
            <div className="flex items-center justify-between text-xs text-text-secondary font-light px-2">
              <span>
                Found <strong className="text-brand-green font-semibold">{filteredProducts.length}</strong> luxury organic catalog offerings
              </span>
              {selectedMaterial !== 'all' && (
                <span>
                  Material Filter: <strong className="text-brand-gold font-semibold capitalize">{selectedMaterial}</strong>
                </span>
              )}
            </div>

            {/* Products grid containing micro-animations */}
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      layout
                      variants={cardVariants}
                      whileHover={{ y: -6, boxShadow: '0 20px 30px -10px rgba(18, 43, 37, 0.12)' }}
                      className="bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow flex flex-col justify-between"
                    >
                      {/* Media container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-bg-mist border-b border-brand-green/5">
                        {prod.export_quality === 1 && (
                          <span className="absolute top-4 left-4 z-10 bg-brand-green text-brand-gold text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                            Premium Export
                          </span>
                        )}
                        {prod.certified === 1 && (
                          <span className="absolute top-4 right-4 z-10 bg-brand-gold text-brand-green text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-0.5">
                            <BadgeCheck className="w-3.5 h-3.5" /> USDA Organic
                          </span>
                        )}
                        
                        <img
                          src={productImages[prod.id] || prod.image_url}
                          alt={prod.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      </div>
                      
                      {/* Text content */}
                      <div className="p-6 flex flex-col flex-grow justify-between gap-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                            <span>{prod.categories?.[0]?.name || 'Health'}</span>
                            <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                            <span>{prod.materials?.[0]?.name || 'Origin Source'}</span>
                          </div>
                          
                          <h3 className="font-serif text-xl font-bold text-brand-green hover:text-brand-gold transition-colors leading-snug">
                            <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                          </h3>
                          
                          <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed line-clamp-3">
                            {prod.short_description}
                          </p>
                        </div>

                        {/* Benefits list */}
                        <div className="flex flex-wrap gap-1.5">
                          {prod.benefits?.slice(0, 2).map(ben => (
                            <span key={ben.id} className="text-[10px] bg-brand-sage/15 text-brand-green px-2.5 py-1 rounded font-medium">
                              {ben.name}
                            </span>
                          ))}
                        </div>
                        
                        {/* Inquiry Action bottom row */}
                        <div className="border-t border-brand-green/5 pt-4 flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">MOQ</span>
                            <span className="text-xs font-semibold text-text-secondary">
                              {prod.moq}
                            </span>
                          </div>
                          
                          <Link
                            href={`/products/${prod.slug}`}
                            className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                          >
                            Explore Sourcing
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-bg-cream rounded-3xl p-12 text-center border border-brand-green/10 luxury-shadow flex flex-col items-center gap-4 py-20"
                >
                  <HelpCircle className="w-12 h-12 text-brand-gold" />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">No Organic Products Found</h3>
                  <p className="text-sm text-text-secondary font-light max-w-sm leading-relaxed">
                    We currently do not have stock fitting this exact filter configuration. Try resetting filters or search terms.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 bg-brand-green hover:bg-brand-green/90 text-bg-cream px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </section>

      {/* ========================================================
          4. MATERIAL CATEGORY (Shows different material in circle box - Bottom Box)
          ======================================================== */}
      <section className="py-16 bg-bg-cream border-t border-brand-green/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1.5 block">Pure Origins</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Shop by Pure Harvest Material
            </h2>
            <p className="text-xs text-text-secondary font-light leading-relaxed mt-1">
              Select one of our certified high-altitude raw elements below to view all premium organic products containing it.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* All Materials Circle Box */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedMaterial('all')}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className={`w-24 h-24 rounded-full p-1 border-2 transition-colors duration-300 flex items-center justify-center bg-bg-mist shadow-md ${
                selectedMaterial === 'all' ? 'border-brand-gold ring-4 ring-brand-gold/20' : 'border-brand-green/10 hover:border-brand-gold'
              }`}>
                <div className="w-full h-full rounded-full bg-brand-green/5 flex items-center justify-center text-brand-green font-serif text-sm font-bold uppercase tracking-wider">
                  All Raw
                </div>
              </div>
              <span className="text-xs font-bold text-brand-green uppercase tracking-wider group-hover:text-brand-gold transition-colors">
                All Materials
              </span>
            </motion.div>

            {materials.map((mat) => (
              <motion.div
                key={mat.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedMaterial(mat.slug)}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className={`w-24 h-24 rounded-full p-1 border-2 transition-colors duration-300 overflow-hidden shadow-md ${
                  selectedMaterial === mat.slug ? 'border-brand-gold ring-4 ring-brand-gold/20' : 'border-brand-green/10 hover:border-brand-gold'
                }`}>
                  <img
                    src={materialImages[mat.slug] || '/images/material-placeholder.jpg'}
                    alt={mat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-xs font-bold text-brand-green uppercase tracking-wider group-hover:text-brand-gold transition-colors">
                  {mat.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
