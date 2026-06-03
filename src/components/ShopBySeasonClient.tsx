'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Heart, ShieldCheck, Leaf, Truck, Sparkles } from 'lucide-react';

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

interface SeasonTab {
  key: string;
  name: string;
  localName: string;
  months: string;
  icon: React.ReactNode;
  description: string;
  timerDurationDays: number;
}

const SEASONS: SeasonTab[] = [
  {
    key: 'spring',
    name: 'SPRING',
    localName: 'Saffron Season',
    months: 'Mar - May',
    timerDurationDays: 18,
    description: 'Our Kashmiri saffron is handpicked at sunrise from the fields of Pampore.',
    icon: (
      <svg className="w-7 h-7 mx-auto transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M32 12C26 24 24 38 32 50C40 38 38 24 32 12Z" />
        <path d="M32 18C20 28 16 42 26 48" />
        <path d="M32 18C44 28 48 42 38 48" />
        <path d="M25 40C20 35 15 38 12 45C16 48 20 48 24 43" />
        <path d="M39 40C44 35 49 38 52 45C48 48 44 48 40 43" />
        <path d="M32 50V56" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    key: 'summer',
    name: 'SUMMER',
    localName: 'Honey & Herb Season',
    months: 'Jun - Aug',
    timerDurationDays: 12,
    description: 'Bees forage the high lavender and acacia mountain forests under the summer warmth.',
    icon: (
      <svg className="w-7 h-7 mx-auto transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M32 8V56" strokeWidth="1.5" />
        <path d="M32 16C24 20 24 28 32 32C40 28 40 20 32 16Z" fill="currentColor" fillOpacity="0.05" />
        <path d="M16 28C10 32 12 40 20 40C24 36 20 30 16 28Z" fill="currentColor" fillOpacity="0.05" />
        <path d="M48 28C54 32 52 40 44 40C40 36 44 30 48 28Z" fill="currentColor" fillOpacity="0.05" />
        <path d="M20 42C16 46 18 52 24 52C28 48 26 44 20 42Z" fill="currentColor" fillOpacity="0.05" />
        <path d="M44 42C48 46 46 52 40 52C36 48 38 44 44 42Z" fill="currentColor" fillOpacity="0.05" />
      </svg>
    )
  },
  {
    key: 'autumn',
    name: 'AUTUMN',
    localName: 'Walnut Harvest',
    months: 'Sep - Nov',
    timerDurationDays: 7,
    description: 'Fresh walnut kernel harvesting and premium cold-pressed walnut oil extractions.',
    icon: (
      <svg className="w-7 h-7 mx-auto transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="23" cy="34" r="10" />
        <circle cx="41" cy="34" r="10" />
        <path d="M23 24C26 28 26 34 23 44" />
        <path d="M41 24C38 28 38 34 41 44" />
        <path d="M13 34C15 36 21 34 23 34C25 34 31 36 33 34C35 34 41 36 43 34C45 34 51 36 53 34" strokeDasharray="1 1" />
      </svg>
    )
  },
  {
    key: 'winter',
    name: 'WINTER',
    localName: 'Pashmina Weave Season',
    months: 'Dec - Feb',
    timerDurationDays: 25,
    description: 'Heritage artisans gather at traditional handlooms to weave cozy custom pashminas.',
    icon: (
      <svg className="w-7 h-7 mx-auto transition-colors duration-300" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 16H52V42H12V16Z" rx="2" />
        <path d="M18 22H46" strokeDasharray="2 2" />
        <path d="M18 28H46" />
        <path d="M18 34H46" strokeDasharray="2 2" />
        <path d="M12 42V48" strokeWidth="1.5" />
        <path d="M18 42V48" strokeWidth="1.5" />
        <path d="M24 42V48" strokeWidth="1.5" />
        <path d="M30 42V48" strokeWidth="1.5" />
        <path d="M36 42V48" strokeWidth="1.5" />
        <path d="M42 42V48" strokeWidth="1.5" />
        <path d="M48 42V48" strokeWidth="1.5" />
        <path d="M52 42V48" strokeWidth="1.5" />
      </svg>
    )
  }
];

export default function ShopBySeasonClient({ initialProducts }: { initialProducts: Product[] }) {
  const [activeSeason, setActiveSeason] = useState<string>('spring');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const selectedSeasonData = useMemo(() => {
    return SEASONS.find(s => s.key === activeSeason) || SEASONS[0];
  }, [activeSeason]);

  // Rolling timer countdown
  useEffect(() => {
    const durationMs = selectedSeasonData.timerDurationDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const anchorTime = new Date('2026-01-01T00:00:00Z').getTime();
    const elapsed = now - anchorTime;
    const currentCycleIndex = Math.floor(elapsed / durationMs);
    const targetTime = anchorTime + (currentCycleIndex + 1) * durationMs;

    function updateTimer() {
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedSeasonData]);

  // Filter products by active season
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const prodSeason = p.season ? p.season.toLowerCase() : '';
      return prodSeason === activeSeason;
    });
  }, [initialProducts, activeSeason]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B3527] pt-20 pb-0 font-sans transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        {/* 1. Header & Season Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border-b border-[#EAE6DF] pb-4 mb-5">
          <div className="lg:col-span-5 space-y-1.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B3527]">
              Shop by Season
            </h1>
            <p className="text-[11px] text-[#4E6254] leading-normal max-w-xs font-light">
              Nature has its time. So do we. We bring you what each season grows best.
            </p>
            <div className="pt-0.5">
              <Link 
                href="/culture" 
                className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-[#C49B35] hover:opacity-80 transition-all border-b border-[#C49B35]/30 pb-0.5"
              >
                <Calendar className="w-3 h-3" /> View Season Calendar
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#F1EDE6]/50 rounded-2xl p-1.5 border border-[#EAE6DF] grid grid-cols-4 gap-1.5">
            {SEASONS.map((season) => {
              const isActive = activeSeason === season.key;
              return (
                <button
                  key={season.key}
                  onClick={() => setActiveSeason(season.key)}
                  className={`py-4 px-1 rounded-xl cursor-pointer text-center transition-all duration-300 flex flex-col justify-between items-center gap-2 relative ${
                    isActive 
                      ? 'bg-white shadow border border-[#EAE6DF] border-b-2 border-b-[#C49B35]' 
                      : 'hover:bg-white/40 border border-transparent'
                  }`}
                >
                  <span className={`block transition-colors duration-300 ${isActive ? 'text-[#C49B35]' : 'text-[#8A968E]'}`}>
                    {season.icon}
                  </span>
                  <div>
                    <span className="block text-[9px] font-bold tracking-widest text-[#1B3527] uppercase">
                      {season.name}
                    </span>
                    <span className="block text-[8px] text-[#8A968E] font-medium mt-0.5">
                      {season.months}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Active Season Story & Countdown Row */}
        <div className="bg-[#F1EDE6]/30 border border-[#EAE6DF] rounded-2xl p-4 sm:p-5 mb-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          <div className="lg:col-span-7 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#C49B35]">
                {selectedSeasonData.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#EAE6DF]" />
              <span className="text-[9px] font-bold text-[#4E6254] uppercase tracking-wider">
                Harvest Spotlight
              </span>
            </div>
            
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1B3527] leading-tight">
              {selectedSeasonData.localName}
            </h2>
            
            <p className="text-[11px] text-[#4E6254] font-light leading-relaxed max-w-xl">
              {selectedSeasonData.description}
            </p>

            <div className="pt-0">
              <Link 
                href="/culture" 
                className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#1B3527] hover:underline"
              >
                Discover the Story <ArrowRight className="w-3 h-3 text-[#C49B35]" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end space-y-2">
            <span className="text-[9px] font-bold text-[#8A968E] uppercase tracking-[0.2em] lg:text-right w-full text-center">
              Harvest Ends In
            </span>

            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="bg-white border border-[#EAE6DF] rounded-xl w-10 sm:w-12 py-1.5 shadow-sm">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#1B3527] block">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[7px] uppercase tracking-widest text-[#8A968E] font-bold block mt-1">Days</span>
              </div>
              
              <span className="text-[#8A968E] font-mono text-sm font-bold -mt-2">:</span>

              <div className="text-center">
                <div className="bg-white border border-[#EAE6DF] rounded-xl w-10 sm:w-12 py-1.5 shadow-sm">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#1B3527] block">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[7px] uppercase tracking-widest text-[#8A968E] font-bold block mt-1">Hrs</span>
              </div>

              <span className="text-[#8A968E] font-mono text-sm font-bold -mt-2">:</span>

              <div className="text-center">
                <div className="bg-white border border-[#EAE6DF] rounded-xl w-10 sm:w-12 py-1.5 shadow-sm">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#1B3527] block">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[7px] uppercase tracking-widest text-[#8A968E] font-bold block mt-1">Mins</span>
              </div>

              <span className="text-[#8A968E] font-mono text-sm font-bold -mt-2">:</span>

              <div className="text-center">
                <div className="bg-white border border-[#EAE6DF] rounded-xl w-10 sm:w-12 py-1.5 shadow-sm">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#C49B35] block animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[7px] uppercase tracking-widest text-[#8A968E] font-bold block mt-1">Secs</span>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Product Catalog Grid */}
        <div className="space-y-4">
          <div className="border-b border-[#EAE6DF] pb-2 flex justify-between items-baseline">
            <h3 className="font-serif text-xl font-bold text-[#1B3527]">
              Seasonal Catalog
            </h3>
            <span className="text-xs font-semibold text-[#C49B35] uppercase tracking-wider">
              {filteredProducts.length} limited-run batches
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="group bg-white border border-[#EAE6DF] rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 relative"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      {product.certified === 1 ? (
                        <span className="bg-[#1B3527] text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-1 rounded shadow">
                          Best Seller
                        </span>
                      ) : (
                        <span className="bg-[#C49B35] text-white text-[8px] font-extrabold uppercase tracking-widest px-2 py-1 rounded shadow">
                          Organic
                        </span>
                      )}
                    </div>

                    <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-[#1B3527] border border-[#EAE6DF] flex items-center justify-center cursor-pointer transition-colors shadow-sm">
                      <Heart className="w-4 h-4 text-[#8A968E] hover:text-red-500 transition-colors" />
                    </button>

                    <div className="h-56 overflow-hidden relative bg-[#F1EDE6] border-b border-[#EAE6DF]">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-[#8A968E] uppercase tracking-wider block">
                          {product.sub_category || 'GI-TAGGED'}
                        </h4>
                        
                        <h3 className="font-serif text-base font-bold text-[#1B3527] group-hover:text-[#C49B35] transition-colors duration-300 leading-tight">
                          {product.name}
                        </h3>
                        
                        <p className="text-[10px] text-[#8A968E] font-medium">
                          Handpicked • Lab Tested • 100% Pure
                        </p>

                        <div className="pt-2">
                          <span className="text-[#C49B35] font-serif text-base font-bold">
                            ₹{product.price ? product.price.toLocaleString('en-IN') : 'Call Desk'}
                          </span>
                          <span className="text-[9px] text-[#8A968E] font-light ml-1">
                            / {product.moq || 'unit'}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#EAE6DF] pt-4 flex items-center justify-between gap-2">
                        <Link
                          href="/custom-pashmina"
                          className="bg-[#1B3527] hover:bg-[#C49B35] text-white hover:text-[#1B3527] font-bold text-[9px] uppercase tracking-wider py-2.5 px-3 rounded-lg transition-all duration-300 text-center flex-1 cursor-pointer"
                        >
                          Add to Cart
                        </Link>
                        
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#1B3527] hover:underline"
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5 text-[#C49B35]" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-[#F1EDE6]/20 border border-dashed border-[#EAE6DF] rounded-3xl flex flex-col items-center gap-3">
                <Sparkles className="w-8 h-8 text-[#C49B35]" />
                <h3 className="font-serif text-lg font-bold text-[#1B3527]">No Seasonal Yields for this Cycle</h3>
                <p className="text-xs text-[#8A968E] max-w-sm font-light">
                  Sourcing allocations are currently being verified with agricultural co-operatives. Check back shortly or contact our desk.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* 4. Bottom Features Value Banner */}
      <div className="bg-[#F1EDE6] border-t border-[#EAE6DF] py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#EAE6DF] items-center">
            
            <div className="py-2 md:py-0 flex flex-col items-center gap-2">
              <Leaf className="w-5 h-5 text-[#C49B35]" />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1B3527] block">100% Organic</span>
                <span className="text-[8px] text-[#8A968E] font-medium">No pesticides. No chemicals.</span>
              </div>
            </div>

            <div className="py-2 md:py-0 flex flex-col items-center gap-2 pt-4 md:pt-0">
              <svg className="w-5 h-5 text-[#C49B35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1B3527] block">Sourced Ethically</span>
                <span className="text-[8px] text-[#8A968E] font-medium">From local family farmers.</span>
              </div>
            </div>

            <div className="py-2 md:py-0 flex flex-col items-center gap-2 pt-4 md:pt-0">
              <svg className="w-5 h-5 text-[#C49B35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1B3527] block">Handpicked with Care</span>
                <span className="text-[8px] text-[#8A968E] font-medium">Only the finest make the cut.</span>
              </div>
            </div>

            <div className="py-2 md:py-0 flex flex-col items-center gap-2 pt-4 md:pt-0">
              <Truck className="w-5 h-5 text-[#C49B35]" />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1B3527] block">Worldwide Shipping</span>
                <span className="text-[8px] text-[#8A968E] font-medium">Delivered with global care.</span>
              </div>
            </div>

            <div className="py-2 md:py-0 flex flex-col items-center gap-2 pt-4 md:pt-0">
              <ShieldCheck className="w-5 h-5 text-[#C49B35]" />
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1B3527] block">Secure Payment</span>
                <span className="text-[8px] text-[#8A968E] font-medium">Safe & trusted checkout.</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
