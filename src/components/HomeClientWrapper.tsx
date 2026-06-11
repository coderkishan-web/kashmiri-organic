'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Product, Category, Material, Blog, Testimonial, Certification } from '@/lib/db';
import { Shield, Sparkles, Sprout, BadgeCheck, ArrowRight, MessageSquare, Star, Search, Globe, CheckCircle2, ChevronLeft, ChevronRight, Award, FileText, Compass } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HomeClientWrapperProps {
  products: Product[];
  categories: Category[];
  materials: Material[];
  blogs: Blog[];
  testimonials: Testimonial[];
  certifications: Certification[];
}

export default function HomeClientWrapper({
  products,
  categories,
  materials,
  blogs,
  testimonials,
  certifications,
}: HomeClientWrapperProps) {
  
  // Ref for Parallax Hero Container
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the hero section for premium Parallax effect
  const { scrollY } = useScroll();
  
  // Background image scrolls at 40% speed of foreground
  const bgY = useTransform(scrollY, [0, 800], [0, 320]);
  // Foreground text fades out and slides up slightly faster
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);

  const materialImages: Record<string, string> = {
    saffron: 'https://images.unsplash.com/photo-1596790011462-c39c6f1a55f8?auto=format&fit=crop&w=600&q=80',
    honey: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
    wood: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=600&q=80',
    walnut: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    herbs: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=600&q=80',
    'royal-pahalgam-lavender': 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
  };

  const categoryImages: Record<string, string> = {
    health: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    skincare: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=600&q=80',
    fitness: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    'natural-living': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
    wellness: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
  };

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

  const blogImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1508747703725-719ae2c98295?auto=format&fit=crop&w=800&q=80',
    2: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=800&q=80',
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist overflow-x-hidden">
      
      {/* ========================================================
          1. PARALLAX HERO SECTION
          ======================================================== */}
      <section 
        ref={heroRef}
        className="relative min-h-[95vh] flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-brand-green"
      >
        {/* Parallax Background Div */}
        <motion.div 
          style={{ 
            y: bgY,
            backgroundImage: "url('https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=80')" 
          }}
          className="absolute inset-0 bg-cover bg-center origin-top pointer-events-none scale-105"
        />

        {/* Deep Forest Overlay for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/95 via-brand-green/80 to-transparent z-0"></div>
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10"
        >
          {/* Main Hero Typography & Brand Pillars */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/30 px-3.5 py-1.5 rounded-full text-brand-gold text-xs font-semibold tracking-wider uppercase mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" /> 100% Protected Himalayan Heritage
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-bg-cream leading-[1.1] mb-6"
            >
              The Luxury of Pure <br />
              <span className="text-brand-gold">Himalayan Heritage</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-bg-cream/80 font-light mb-8 max-w-xl leading-relaxed"
            >
              We source and pack the pristine organic bounty of the Kashmir Valley. Experience Pampore's Grade-A Saffron, raw high-altitude forest honey, and generation-lasting handcrafted walnut woodware.
            </motion.p>
            
            {/* Search products bar */}
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              action="/search" 
              method="GET" 
              className="w-full max-w-lg mb-8 relative flex shadow-2xl"
            >
              <input
                type="text"
                name="q"
                required
                placeholder="Search premium saffron, honey, essential oils..."
                className="w-full bg-bg-cream text-text-primary text-xs sm:text-sm placeholder-text-muted px-4 py-3.5 pl-11 rounded-l-xl border border-transparent focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
              <Search className="w-4.5 h-4.5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider px-6 rounded-r-xl cursor-pointer transition-all duration-300"
              >
                Search
              </button>
            </motion.form>
            
            {/* Action buttons */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/products"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all hover:scale-105 duration-200"
              >
                Discover Catalog
              </Link>
              <Link
                href="/export"
                className="bg-transparent border border-bg-cream/30 hover:border-brand-gold text-bg-cream hover:text-brand-gold font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all duration-200"
              >
                B2B Bulk Export
              </Link>
            </motion.div>
          </div>
          
          {/* Hero Side Highlight Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 40, rotate: 1 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 60, delay: 0.4 }}
            className="lg:col-span-5 hidden lg:flex justify-end pr-8"
          >
            <div className="glassmorphism-dark text-bg-cream p-8 rounded-2xl max-w-xs border border-brand-gold/20 shadow-2xl relative">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-green font-bold text-xl mb-4 shadow-lg">
                KO
              </div>
              <p className="font-serif text-lg font-semibold text-brand-gold italic mb-2">
                "Purity Verified"
              </p>
              <p className="text-xs text-bg-cream/70 leading-relaxed font-light mb-4">
                Every batch of our Mongra saffron undergoes ISO-certified lab tests validating its crocin levels before leaving our facility in Pampore.
              </p>
              <div className="border-t border-bg-beige/10 pt-4 flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold text-brand-gold">
                <span>Grade A+ Mongra</span>
                <span>ISO 3632 Tested</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================
          2. FEATURED CATEGORIES (Viewport entrance animations)
          ======================================================== */}
      <section id="categories" className="py-24 bg-bg-mist px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
              Explore Kashmiri Botanicals
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
            <p className="text-sm text-text-secondary font-light leading-relaxed">
              Carefully categorized wellness elements harvested by local cooperatives and craft guilds.
            </p>
          </motion.div>
          
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.3}
            pagination={{
              el: '.swiper-pagination-categories',
              clickable: true,
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2.3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3.5,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            className="categories-swiper pb-8"
          >
            {categories.map((cat, index) => (
              <SwiperSlide key={cat.id} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] flex flex-col justify-end p-5 luxury-shadow cursor-pointer h-full"
                >
                  <Link href={`/products?category=${cat.slug}`} className="absolute inset-0 z-20" />
                  {/* Background image */}
                  <div className="absolute inset-0 bg-brand-green/20 z-10 transition-colors"></div>
                  <img
                    src={categoryImages[cat.slug] || '/images/category-placeholder.jpg'}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Bottom Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/40 to-transparent z-15"></div>
                  
                  {/* Content */}
                  <div className="relative z-20 text-bg-cream">
                    <h3 className="font-serif text-lg font-bold text-bg-cream">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-gold flex items-center gap-1 mt-1">
                      Explore Collection <ArrowRight className="w-2.5 h-2.5 ml-1" />
                    </span>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="swiper-pagination-categories flex justify-center items-center gap-2 mt-4"></div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURED PRODUCTS (Dynamic layout)
          ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-bg-cream">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
                Pure Selections
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
                Signature Kashmiri Masterpieces
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-brand-green hover:text-brand-gold flex items-center gap-1 group mt-4 md:mt-0"
            >
              View Full Organic Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
            </Link>
          </motion.div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.25}
            navigation={{
              nextEl: '.swiper-button-next-products',
              prevEl: '.swiper-button-prev-products',
            }}
            pagination={{
              el: '.swiper-pagination-products',
              clickable: true,
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2.3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.15,
                spaceBetween: 32,
              },
            }}
            className="products-swiper pb-6"
          >
            {products.slice(0, 8).map((prod, index) => (
              <SwiperSlide key={prod.id} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  whileHover={{ y: -8, boxShadow: '0 20px 30px -10px rgba(18, 43, 37, 0.12)' }}
                  className="group bg-bg-beige/10 rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow flex flex-col justify-between h-full"
                >
                  {/* Product Image & Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-mist">
                    {prod.export_quality === 1 && (
                      <span className="absolute top-4 left-4 z-10 bg-brand-green text-brand-gold text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                        Export Grade
                      </span>
                    )}
                    {prod.certified === 1 && (
                      <span className="absolute top-4 right-4 z-10 bg-brand-gold text-brand-green text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" /> Certified
                      </span>
                    )}
                    
                    <img
                      src={productImages[prod.id] || prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Product Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Category / Material tags */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
                          {prod.categories?.[0]?.name || 'Botanical'}
                        </span>
                        <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-brown">
                          {prod.materials?.[0]?.name || 'Origin'}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-xl font-bold text-brand-green mb-2 hover:text-brand-gold transition-colors leading-snug">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed mb-4 line-clamp-3">
                        {prod.short_description}
                      </p>

                      {/* Mini benefits list */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {prod.benefits?.map((ben) => (
                          <span key={ben.id} className="text-[10px] bg-brand-sage/15 text-brand-green px-2 py-0.5 rounded font-medium">
                            {ben.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Inquiry action */}
                    <div className="border-t border-brand-green/5 pt-4 flex items-center justify-between mt-auto">
                      <span className="text-xs text-text-muted font-light">
                        MOQ: {prod.moq}
                      </span>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors duration-300"
                      >
                        Explore Harvest
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Brand Navigation & Pagination Controls below the products swiper */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button className="swiper-button-prev-products w-11 h-11 rounded-full border border-brand-green/20 text-brand-green bg-bg-cream hover:bg-brand-green hover:text-bg-cream flex items-center justify-center transition-all duration-300 shadow-sm hover:border-brand-gold disabled:opacity-40 disabled:pointer-events-none group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="swiper-pagination-products !static !w-auto flex justify-center items-center gap-2"></div>
            
            <button className="swiper-button-next-products w-11 h-11 rounded-full border border-brand-green/20 text-brand-green bg-bg-cream hover:bg-brand-green hover:text-bg-cream flex items-center justify-center transition-all duration-300 shadow-sm hover:border-brand-gold disabled:opacity-40 disabled:pointer-events-none group">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE PURE PROMISE (Icon details scroll viewport animation)
          ======================================================== */}
      <section className="py-24 bg-brand-green text-bg-cream px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <span className="font-serif text-[24vw] font-bold select-none leading-none">KO</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              The Pure Promise
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-bg-cream">
              Why Kashmiri Organic is Unrivaled
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
            <p className="text-sm text-bg-cream/70 font-light">
              We stand apart from retail marketplaces by protecting ancestral heritage and strictly controlling global logistics.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-center">
            
            {/* 1. Organic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center p-4 bg-bg-cream/5 rounded-2xl border border-brand-gold/10"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-14 h-14 bg-bg-cream/5 border border-brand-gold/30 text-brand-gold rounded-full flex items-center justify-center mb-5"
              >
                <Sprout className="w-7 h-7" />
              </motion.div>
              <h3 className="font-serif text-lg font-bold text-bg-cream mb-2">100% Organic</h3>
              <p className="text-xs text-bg-cream/75 leading-relaxed font-light">
                Grown naturally under sun and rain without synthetic pesticides or chemical fertilizers.
              </p>
            </motion.div>

            {/* 2. Sustainable */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center p-4 bg-bg-cream/5 rounded-2xl border border-brand-gold/10"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-14 h-14 bg-bg-cream/5 border border-brand-gold/30 text-brand-gold rounded-full flex items-center justify-center mb-5"
              >
                <Shield className="w-7 h-7" />
              </motion.div>
              <h3 className="font-serif text-lg font-bold text-bg-cream mb-2">Preservation First</h3>
              <p className="text-xs text-bg-cream/75 leading-relaxed font-light">
                Ethical timber forestry and hive beekeeping supporting local mountain cooperatives.
              </p>
            </motion.div>

            {/* 3. Certified */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center p-4 bg-bg-cream/5 rounded-2xl border border-brand-gold/10"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-14 h-14 bg-bg-cream/5 border border-brand-gold/30 text-brand-gold rounded-full flex items-center justify-center mb-5"
              >
                <BadgeCheck className="w-7 h-7" />
              </motion.div>
              <h3 className="font-serif text-lg font-bold text-bg-cream mb-2">USDA Certified</h3>
              <p className="text-xs text-bg-cream/75 leading-relaxed font-light">
                Fully verified geographical origin and international safety certification protocols.
              </p>
            </motion.div>

            {/* 4. Export Quality */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center p-4 bg-bg-cream/5 rounded-2xl border border-brand-gold/10"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-14 h-14 bg-bg-cream/5 border border-brand-gold/30 text-brand-gold rounded-full flex items-center justify-center mb-5"
              >
                <Globe className="w-7 h-7" />
              </motion.div>
              <h3 className="font-serif text-lg font-bold text-bg-cream mb-2">Global Quality</h3>
              <p className="text-xs text-bg-cream/75 leading-relaxed font-light">
                B2B-ready vacuum packaging and customs-clearance phytosanitary logging checks.
              </p>
            </motion.div>

            {/* 5. Handcrafted */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center p-4 bg-bg-cream/5 rounded-2xl border border-brand-gold/10"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="w-14 h-14 bg-bg-cream/5 border border-brand-gold/30 text-brand-gold rounded-full flex items-center justify-center mb-5"
              >
                <Star className="w-7 h-7" />
              </motion.div>
              <h3 className="font-serif text-lg font-bold text-bg-cream mb-2">Heritage Artistry</h3>
              <p className="text-xs text-bg-cream/75 leading-relaxed font-light">
                Chiseled and harvested manually by fourth-generation local artisans and collectors.
              </p>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* ========================================================
          5. MATERIALS SHOWCASE
          ======================================================== */}
      <section className="py-24 bg-bg-cream px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Material Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
              The Elements of Purity
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
            <p className="text-sm text-text-secondary font-light">
              Discover the high-altitude valley origin, extraction method, and biological benefits of our heirloom ingredients.
            </p>
          </motion.div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.5}
            navigation={{
              nextEl: '.swiper-button-next-materials',
              prevEl: '.swiper-button-prev-materials',
            }}
            pagination={{
              el: '.swiper-pagination-materials',
              clickable: true,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="materials-swiper"
          >
            {materials.map((mat, index) => (
              <SwiperSlide key={mat.id} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-bg-beige/10 border border-brand-green/5 rounded-2xl overflow-hidden luxury-shadow flex flex-col justify-between h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-bg-mist">
                     <img
                      src={materialImages[mat.slug] || '/images/material-placeholder.jpg'}
                      alt={mat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-green group-hover:text-brand-gold transition-colors mb-1.5">
                        {mat.name}
                      </h3>
                      <p className="text-xs text-text-secondary font-light leading-relaxed line-clamp-3">
                        {mat.overview}
                      </p>
                    </div>
                    
                    <Link
                      href={`/products?material=${mat.slug}`}
                      className="border-t border-brand-green/5 pt-3 mt-4 flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold text-brand-gold group-hover:text-brand-green transition-colors"
                    >
                      <span>Origin: {mat.slug}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-1" />
                    </Link>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Brand Navigation & Pagination Controls below the swiper */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button className="swiper-button-prev-materials w-11 h-11 rounded-full border border-brand-green/20 text-brand-green bg-bg-cream hover:bg-brand-green hover:text-bg-cream flex items-center justify-center transition-all duration-300 shadow-sm hover:border-brand-gold disabled:opacity-40 disabled:pointer-events-none group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="swiper-pagination-materials !static !w-auto flex justify-center items-center gap-2"></div>
            
            <button className="swiper-button-next-materials w-11 h-11 rounded-full border border-brand-green/20 text-brand-green bg-bg-cream hover:bg-brand-green hover:text-bg-cream flex items-center justify-center transition-all duration-300 shadow-sm hover:border-brand-gold disabled:opacity-40 disabled:pointer-events-none group">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. CERTIFICATIONS APPROVED SECTION (Redesigned for Premium Appeal)
          ======================================================== */}
      <section className="py-20 bg-bg-cream px-4 sm:px-6 lg:px-8 border-y border-brand-green/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Quality Assurance
            </span>
            <h2 className="text-3xl font-serif font-bold text-brand-green">
              Approved Under International Standards
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
            <p className="text-sm text-text-secondary font-light">
              Our products are certified by leading global and national standard boards, ensuring uncompromised purity and ethical origin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => {
              // Map icons dynamically
              let Icon = Shield;
              if (cert.name.toLowerCase().includes('india')) Icon = Award;
              if (cert.name.toLowerCase().includes('usda')) Icon = Sprout;
              if (cert.name.toLowerCase().includes('iso')) Icon = FileText;
              if (cert.name.toLowerCase().includes('gi tag')) Icon = Compass;

              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 30px -10px rgba(18, 43, 37, 0.08)' }}
                  className="bg-bg-beige/10 p-8 rounded-3xl border border-brand-green/5 flex flex-col items-center text-center justify-between group"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-green/5 text-brand-green flex items-center justify-center mb-6 group-hover:bg-brand-green group-hover:text-brand-gold transition-all duration-300 shadow-inner">
                    <Icon className="w-8 h-8 transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-green mb-3 group-hover:text-brand-gold transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed font-light">
                        {cert.description}
                      </p>
                    </div>
                    
                    <div className="w-8 h-0.5 bg-brand-green/10 mx-auto mt-6 group-hover:bg-brand-gold/40 transition-colors"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. B2B / EXPORT SECTION WITH VIEWPORT SLIDE
          ======================================================== */}
      <section className="py-24 bg-bg-mist px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/10 luxury-shadow grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left Column - Form/Info */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
                Wholesale Sourcing
              </span>
              <h2 className="text-3xl font-serif font-bold text-brand-green mb-4">
                B2B Bulk Export Sourcing
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed font-light mb-8">
                We supply premium-grade Kashmiri organic raw ingredients and custom-packaged finished items directly to boutique stores, retail channels, and cosmetic labs worldwide. Let us assist you with import certificates, shipping quotas, and phytosanitary clearance documents.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-green">Custom Bulk Packaging</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Aluminum canisters, moisture-insulated crates, or customized retail packs.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-green">Global Air Freight</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Secure air-shipping dispatch with priority custom clearance.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-green">Certificate Authenticity</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Laboratory testing validation sheets with ISO Saffron metrics.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-brand-green">Direct Cooperatives</h4>
                    <p className="text-xs text-text-secondary mt-0.5">Zero middlemen retail fees. Full value returned directly to Pampore farming societies.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/export"
                className="bg-brand-green hover:bg-brand-green/90 text-bg-cream px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 group cursor-pointer"
              >
                View Export Processes <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
              </Link>
              <Link
                href="/inquiry"
                className="border border-brand-green text-brand-green hover:bg-bg-beige/40 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Send Sourcing Inquiry
              </Link>
            </div>
          </div>
          
          {/* Right Column - Media / Image */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-auto bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
            {/* Golden dust gradient */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-bg-cream via-transparent to-transparent lg:w-32 z-10"></div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          8. TESTIMONIALS WITH DUAL ROW INFINITE MARQUEE (Right & Left)
          ======================================================== */}
      <section className="py-24 bg-bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Worldwide Trust
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
              Endorsed by Connoisseurs & Businesses
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="w-full relative flex flex-col gap-6">
          {/* Left & Right Fade Gradients */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-48 bg-gradient-to-r from-bg-cream via-bg-cream/70 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 sm:w-48 bg-gradient-to-l from-bg-cream via-bg-cream/70 to-transparent z-10 pointer-events-none"></div>

          {/* Row 1: Upper Row (Right Scroll) */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-right py-2">
              {[
                ...(testimonials[0] ? [testimonials[0]] : [{ id: 1, name: 'Clara Dupont', role: 'Sourcing Director, L\'Élixir Organic (France)', content: 'We source Kashmiri Saffron and Wild Lavender Oil from Kashmiri Organic for our premium botanical skincare lines. The quality is exceptional, and their detailed laboratory reports and shipping logistics make B2B export extremely seamless.', rating: 5 }]),
                ...(testimonials[1] ? [testimonials[1]] : [{ id: 2, name: 'Rajesh Malhotra', role: 'Founder, Himalaya Wellness Retreats', content: 'Our wellness sanctuaries utilize Kashmiri Organic forest honey and walnut woodware. Our guests frequently praise the purity of the honey. Truly the gold standard of organic heritage products.', rating: 5 }]),
                ...(testimonials[2] ? [testimonials[2]] : [{ id: 3, name: 'Emma Wilson', role: 'Connoisseur & Naturalist (United Kingdom)', content: 'The hand-carved walnut fruit bowl is an absolute masterpiece in my dining room. Knowing the wood is sourced sustainably and helps support local Kashmiri craft families makes it feel incredibly special.', rating: 5 }]),
              ].concat([
                ...(testimonials[0] ? [testimonials[0]] : [{ id: 1, name: 'Clara Dupont', role: 'Sourcing Director, L\'Élixir Organic (France)', content: 'We source Kashmiri Saffron and Wild Lavender Oil from Kashmiri Organic for our premium botanical skincare lines. The quality is exceptional, and their detailed laboratory reports and shipping logistics make B2B export extremely seamless.', rating: 5 }]),
                ...(testimonials[1] ? [testimonials[1]] : [{ id: 2, name: 'Rajesh Malhotra', role: 'Founder, Himalaya Wellness Retreats', content: 'Our wellness sanctuaries utilize Kashmiri Organic forest honey and walnut woodware. Our guests frequently praise the purity of the honey. Truly the gold standard of organic heritage products.', rating: 5 }]),
                ...(testimonials[2] ? [testimonials[2]] : [{ id: 3, name: 'Emma Wilson', role: 'Connoisseur & Naturalist (United Kingdom)', content: 'The hand-carved walnut fruit bowl is an absolute masterpiece in my dining room. Knowing the wood is sourced sustainably and helps support local Kashmiri craft families makes it feel incredibly special.', rating: 5 }]),
              ]).map((testCard, i) => (
                <div 
                  key={`row1-${testCard.id}-${i}`}
                  className="w-[290px] sm:w-[380px] md:w-[440px] flex-shrink-0 mx-3 bg-bg-beige/10 p-6 sm:p-8 rounded-3xl border border-brand-green/5 luxury-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-brand-gold mb-4">
                      {[...Array(testCard.rating || 5)].map((_, starIdx) => (
                        <Star key={starIdx} className="w-4 h-4 fill-current animate-pulse" />
                      ))}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light italic mb-6">
                      "{testCard.content}"
                    </p>
                  </div>
                  
                  <div className="border-t border-brand-green/5 pt-4 mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green text-brand-gold flex items-center justify-center font-serif text-sm font-bold shadow-inner shrink-0">
                      {testCard.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-green">{testCard.name}</h4>
                      <p className="text-[9px] sm:text-[10px] text-text-muted">{testCard.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Lower Row (Left Scroll) */}
          <div className="w-full overflow-hidden">
            <div className="animate-marquee-left py-2">
              {[
                { id: 4, name: 'Aarav Sharma', role: 'Owner, Vedic Spice Co. (Delhi)', content: 'The Grade A+ Pampore Saffron from Kashmiri Organic has elevated our premium spice catalog. Customers notice the intense aroma, deep crimson filaments, and colouring potency difference instantly.', rating: 5 },
                { id: 5, name: 'Dr. Sofia Rossi', role: 'Chief Formulation Chemist, Bella Terra (Italy)', content: 'Finding pure, chemical-free essential oils with certified laboratory tracing is rare. Kashmiri Organic\'s wild lavender and rose distillates are of exceptional, clinical-grade quality.', rating: 5 },
                { id: 6, name: 'Benjamin Croft', role: 'Executive Chef, The Royal Pavilion (London)', content: 'The wild organic forest honey possesses a distinct floral depth and velvety mouthfeel that is completely unmatched. It has become a signature ingredient in our pastry and tea service menus.', rating: 5 }
              ].concat([
                { id: 4, name: 'Aarav Sharma', role: 'Owner, Vedic Spice Co. (Delhi)', content: 'The Grade A+ Pampore Saffron from Kashmiri Organic has elevated our premium spice catalog. Customers notice the intense aroma, deep crimson filaments, and colouring potency difference instantly.', rating: 5 },
                { id: 5, name: 'Dr. Sofia Rossi', role: 'Chief Formulation Chemist, Bella Terra (Italy)', content: 'Finding pure, chemical-free essential oils with certified laboratory tracing is rare. Kashmiri Organic\'s wild lavender and rose distillates are of exceptional, clinical-grade quality.', rating: 5 },
                { id: 6, name: 'Benjamin Croft', role: 'Executive Chef, The Royal Pavilion (London)', content: 'The wild organic forest honey possesses a distinct floral depth and velvety mouthfeel that is completely unmatched. It has become a signature ingredient in our pastry and tea service menus.', rating: 5 }
              ]).map((testCard, i) => (
                <div 
                  key={`row2-${testCard.id}-${i}`}
                  className="w-[290px] sm:w-[380px] md:w-[440px] flex-shrink-0 mx-3 bg-bg-beige/10 p-6 sm:p-8 rounded-3xl border border-brand-green/5 luxury-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-brand-gold mb-4">
                      {[...Array(testCard.rating || 5)].map((_, starIdx) => (
                        <Star key={starIdx} className="w-4 h-4 fill-current animate-pulse" />
                      ))}
                    </div>
                    
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light italic mb-6">
                      "{testCard.content}"
                    </p>
                  </div>
                  
                  <div className="border-t border-brand-green/5 pt-4 mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green text-brand-gold flex items-center justify-center font-serif text-sm font-bold shadow-inner shrink-0">
                      {testCard.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-green">{testCard.name}</h4>
                      <p className="text-[9px] sm:text-[10px] text-text-muted">{testCard.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. LATEST BLOGS / STORIES
          ======================================================== */}
      <section className="py-24 bg-bg-mist px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
                Editorial & Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
                Kashmiri Agricultural Diaries
              </h2>
            </div>
            <Link
              href="/blogs"
              className="text-sm font-bold text-brand-green hover:text-brand-gold flex items-center gap-1 group mt-4 md:mt-0"
            >
              Browse All Stories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow flex flex-col sm:flex-row h-full"
              >
                {/* Blog Image */}
                <div className="sm:w-2/5 relative min-h-[220px] sm:min-h-auto overflow-hidden bg-bg-mist">
                  <img
                    src={blogImages[blog.id] || blog.featured_image}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
                
                {/* Blog Body */}
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block mb-2">
                      {blog.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green leading-snug mb-3 hover:text-brand-gold transition-colors">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed mb-6 line-clamp-3">
                      {blog.seo_description}
                    </p>
                  </div>
                  
                  <div className="border-t border-brand-green/5 pt-4 flex items-center justify-between text-xs text-text-muted">
                    <span>By {blog.author}</span>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="text-xs font-bold text-brand-green hover:text-brand-gold flex items-center gap-1 group/blog-btn"
                    >
                      Read Diary <ArrowRight className="w-3 h-3 group-hover/blog-btn:translate-x-0.5 transition-transform ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          10. INQUIRY BOTTOM CTA
          ======================================================== */}
      <section className="py-24 bg-brand-green text-bg-cream px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Decorative background text elements */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 opacity-[0.03] font-serif text-[15vw] select-none pointer-events-none">
          Purity
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-[0.03] font-serif text-[15vw] select-none pointer-events-none">
          Heritage
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
            Begin the Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream leading-tight mb-6">
            Inquire About Our Seasonal Harvests
          </h2>
          <p className="text-base sm:text-lg text-bg-cream/80 font-light mb-8 max-w-xl mx-auto leading-relaxed">
            Whether you want a customized heritage walnut bowl or a bulk shipment of certified Pampore Saffron, we are ready to assist you with premium logistics.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                href="/inquiry"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-xl block text-center"
              >
                Request A Quote
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-bg-cream font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-center"
              >
                <MessageSquare className="w-4 h-4 shrink-0" /> WhatsApp Inquiry
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
