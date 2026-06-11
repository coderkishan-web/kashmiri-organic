'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sprout, 
  ShieldCheck, 
  Heart, 
  Award, 
  ArrowRight, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Users, 
  Activity,
  Layers,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function AboutPage() {
  // Parallax Hero Scroll Tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Transform backgrounds & opacities for premium parallax
  const bgY = useTransform(scrollY, [0, 800], [0, 260]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);

  // Framer Motion entry variants
  const fadeInSlideUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } 
    }
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } 
    },
    hover: {
      y: -6,
      scale: 1.02,
      boxShadow: "0 20px 30px -10px rgba(47, 79, 62, 0.08)",
      transition: { duration: 0.3, ease: "easeOut" as const }
    }
  };

  const guardians = [
    {
      name: 'Ayesha Mir',
      role: 'Lead Cooperative Coordinator, Pampore',
      quote: 'For us, saffron is not just a crop—it is the breath of our soil. We hand-pluck each stigma with care, preserving the heritage our grandparents left in these fields.',
      image: 'https://images.unsplash.com/photo-1596790011462-c39c6f1a55f8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ghulam Rasool',
      role: 'Master Woodcarver, Srinagar Guild',
      quote: 'Kashmiri walnut wood requires patience. We season it for up to five years, allowing the rings to tell their story before my chisel ever touches the grain.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Rahim Tariq',
      role: 'Nomadic Beekeeper Lead, Pahalgam Reserves',
      quote: 'Our hives migrate through the wild lavender and acacia forest belts depending on seasonal blooms. The honey captures the pure dew of the high valley.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Dr. Zahoor Bhat',
      role: 'compliance & Chemical Analysis Director',
      quote: 'Science guards our heritage. By measuring crocin density and testing essential oil volatiles, we guarantee the Grade A+ standard is met in every single batch.',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist overflow-x-hidden">
      
      {/* ========================================================
          1. PARALLAX HERO BANNER
          ======================================================== */}
      <section 
        ref={heroRef}
        className="relative min-h-[75vh] flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-brand-green"
      >
        {/* Parallax Background */}
        <motion.div 
          style={{ 
            y: bgY,
            backgroundImage: "url('https://images.unsplash.com/photo-1595815771614-1217575f8f1f?auto=format&fit=crop&w=1920&q=80')" 
          }}
          className="absolute inset-0 bg-cover bg-center origin-top pointer-events-none scale-105"
        />

        {/* Brand Green Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/95 via-brand-green/80 to-transparent z-0"></div>
        
        {/* Decorative Grid Patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-brand-green/20 to-brand-green/70 mix-blend-overlay pointer-events-none"></div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative max-w-7xl mx-auto w-full z-10 text-bg-cream flex flex-col items-start"
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/30 px-3.5 py-1.5 rounded-full text-brand-gold text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Hand-Harvested Heritage
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-bg-cream leading-[1.1] mb-6 max-w-3xl"
          >
            Sown in Mountain Soil, <br />
            <span className="text-brand-gold">Carried by Generations</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-bg-cream/80 font-light mb-8 max-w-xl leading-relaxed"
          >
            Kashmiri Organic protects ancestral J&K agriculture, validates it with laboratory science, and delivers certified high-altitude purity directly to global buyers.
          </motion.p>
          
          {/* Animated Scroll Down Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group hidden sm:flex"
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
          >
            <span className="text-[10px] uppercase tracking-widest text-bg-cream/50 group-hover:text-brand-gold transition-colors">
              Scroll to discover
            </span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-5 h-9 rounded-full border border-bg-cream/30 group-hover:border-brand-gold flex justify-center pt-1.5 transition-colors"
            >
              <div className="w-1 h-2 bg-brand-gold rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================
          2. ANIMATED STATS METRICS ROW
          ======================================================== */}
      <section className="py-16 bg-bg-cream px-4 sm:px-6 lg:px-8 border-b border-brand-green/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {/* Stat 1 */}
            <motion.div 
              variants={statCardVariants}
              whileHover="hover"
              className="bg-bg-mist p-6 sm:p-8 rounded-2xl border border-brand-green/5 text-center transition-all luxury-shadow flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-brand-green/5 text-brand-green rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-brand-gold" />
              </div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-brand-green block mb-1">
                120+
              </span>
              <span className="text-xs uppercase font-semibold text-brand-brown tracking-wider block mb-2">
                Partner Families
              </span>
              <p className="text-[11px] text-text-secondary font-light max-w-[180px]">
                Supporting master carvers & agricultural co-ops directly.
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div 
              variants={statCardVariants}
              whileHover="hover"
              className="bg-bg-mist p-6 sm:p-8 rounded-2xl border border-brand-green/5 text-center transition-all luxury-shadow flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-brand-green/5 text-brand-green rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-brand-gold" />
              </div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-brand-green block mb-1">
                1,600m+
              </span>
              <span className="text-xs uppercase font-semibold text-brand-brown tracking-wider block mb-2">
                Peak Altitude
              </span>
              <p className="text-[11px] text-text-secondary font-light max-w-[180px]">
                Thermal alpine valleys that concentrate active botanical compounds.
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div 
              variants={statCardVariants}
              whileHover="hover"
              className="bg-bg-mist p-6 sm:p-8 rounded-2xl border border-brand-green/5 text-center transition-all luxury-shadow flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-brand-green/5 text-brand-green rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-brand-gold" />
              </div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-brand-green block mb-1">
                100%
              </span>
              <span className="text-xs uppercase font-semibold text-brand-brown tracking-wider block mb-2">
                Lab Traceable
              </span>
              <p className="text-[11px] text-text-secondary font-light max-w-[180px]">
                Verified ISO 3632 testing logs matching every container batch.
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div 
              variants={statCardVariants}
              whileHover="hover"
              className="bg-bg-mist p-6 sm:p-8 rounded-2xl border border-brand-green/5 text-center transition-all luxury-shadow flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-brand-green/5 text-brand-green rounded-full flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-brand-gold" />
              </div>
              <span className="text-3xl sm:text-4xl font-serif font-bold text-brand-green block mb-1">
                Zero
              </span>
              <span className="text-xs uppercase font-semibold text-brand-brown tracking-wider block mb-2">
                Middlemen Fees
              </span>
              <p className="text-[11px] text-text-secondary font-light max-w-[180px]">
                Direct source routes returning maximum trade value to growers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          3. THE SOURCING JOURNEY (Interactive Timeline)
          ======================================================== */}
      <section className="py-24 bg-bg-mist px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto relative">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
              The Journey of Botanical Purity
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
            <p className="text-sm text-text-secondary font-light">
              Follow the physical lifecycle of our organic harvests, from glacial mountain soils directly to your hands.
            </p>
          </motion.div>

          {/* Central Vertical Connector Line */}
          <div className="absolute left-4 md:left-1/2 top-48 bottom-12 w-0.5 bg-brand-green/10 -translate-x-1/2 z-0 hidden md:block">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-200px' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-gradient-to-b from-brand-gold via-brand-green to-brand-gold"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-24">
            
            {/* Phase 1: High-Altitude Cultivation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Text */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInLeft}
                className="flex flex-col items-start gap-4 md:text-right md:items-end order-2 md:order-1"
              >
                <span className="inline-flex items-center gap-1.5 bg-brand-gold/15 text-brand-gold px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  <Sprout className="w-3.5 h-3.5" /> Phase 1
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-green">
                  Glacial Soil & Terroir
                </h3>
                <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed md:max-w-md">
                  Our journey begins in the high-altitude volcanic soils of Pampore and forest reserve buffer belts. The intense climatic cycles—freezing winter snows and bright summer sun—force native plants to synthesize exceptionally rich therapeutic antioxidants, crocin levels, and volatile oils.
                </p>
              </motion.div>
              {/* Right Image */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInRight}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-brand-green/5 order-1 md:order-2 group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1595815771614-1217575f8f1f?auto=format&fit=crop&w=800&q=80" 
                  alt="Glacial Valley Soil"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-green/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
            </div>

            {/* Phase 2: Morning Harvesting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Image */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInLeft}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-brand-green/5 group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1596790011462-c39c6f1a55f8?auto=format&fit=crop&w=800&q=80" 
                  alt="Saffron Plucking Cooperatives"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-green/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
              {/* Right Text */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInRight}
                className="flex flex-col items-start gap-4"
              >
                <span className="inline-flex items-center gap-1.5 bg-brand-gold/15 text-brand-gold px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  <Users className="w-3.5 h-3.5" /> Phase 2
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-green">
                  Traditional Dawn Harvesting
                </h3>
                <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-md">
                  At dawn, when the morning dew is fresh, cooperative farmers pick purple saffron crocus blossoms and gather wild mountain honeystraw. Simultaneously, wood artisans pick fallen or licensed senior walnut logs, ensuring everything is gathered sustainably under local guild guidelines.
                </p>
              </motion.div>
            </div>

            {/* Phase 3: Lab Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Text */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInLeft}
                className="flex flex-col items-start gap-4 md:text-right md:items-end order-2 md:order-1"
              >
                <span className="inline-flex items-center gap-1.5 bg-brand-gold/15 text-brand-gold px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" /> Phase 3
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-green">
                  Independent Laboratory Audit
                </h3>
                <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed md:max-w-md">
                  Because high-altitude spices are vulnerable to adulteration, science acts as our guard. Every single export batch undergoes rigorous chemical validation. We test saffron crocin density, picrocrocin bitterness levels, and honey volatile enzymes before packaging.
                </p>
              </motion.div>
              {/* Right Image */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInRight}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-brand-green/5 order-1 md:order-2 group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80" 
                  alt="Scientific Compliance and Quality Audits"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-green/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
            </div>

            {/* Phase 4: Sealed Export */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Image */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInLeft}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-brand-green/5 group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80" 
                  alt="Vacuum Sealed Export Quality Saffron Jars"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-green/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </motion.div>
              {/* Right Text */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={slideInRight}
                className="flex flex-col items-start gap-4"
              >
                <span className="inline-flex items-center gap-1.5 bg-brand-gold/15 text-brand-gold px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  <Award className="w-3.5 h-3.5" /> Phase 4
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-green">
                  Protected Sealed Export
                </h3>
                <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed max-w-md">
                  Once certified, we pack our products in moisture-resistant vacuum containers with custom GI Tag barcodes. Saffron is nestled in gold-embossed boxes, and cold-pressed oils are sealed in amber UV-proof glass to arrive globally with its delicate botanical strength fully intact.
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE CORE PRINCIPLES (Mission, Vision, Values)
          ======================================================== */}
      <section className="py-24 bg-brand-green text-bg-cream px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Soft background text element */}
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
          <span className="font-serif text-[20vw] font-bold select-none leading-none">Purity</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-bg-cream">
              Protecting What is Sacred
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-bg-cream/5 p-8 rounded-2xl border border-bg-cream/10 flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bg-cream">Our Mission</h3>
              <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed">
                To protect pristine high-altitude agricultural heritage by providing direct, transparent trade channels that uplift local cooperative growers and artisans in Jammu & Kashmir.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-bg-cream/5 p-8 rounded-2xl border border-bg-cream/10 flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bg-cream">Our Vision</h3>
              <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed">
                To be the global reference for uncompromised Kashmiri botanicals, recognized for zero carbon trace harvesting and complete third-party laboratory integrity.
              </p>
            </motion.div>

            {/* Philosophy */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-bg-cream/5 p-8 rounded-2xl border border-bg-cream/10 flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bg-cream">Organic Philosophy</h3>
              <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed">
                We believe premium wellness requires time. We reject quick chemical additives, dry-seasoning our wood naturally, protecting bee ecosystems, and respecting seasonal crop rotations.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. MEET THE GUARDIANS (Artisan Slider)
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
              The Keepers of Craft
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green">
              Guardians of the Harvest
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-4 mb-4"></div>
            <p className="text-sm text-text-secondary font-light">
              Meet the cooperative leaders and master craftsmen who bring the raw gifts of the Kashmir valley to life.
            </p>
          </motion.div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.1}
            navigation={{
              nextEl: '.swiper-button-next-guardians',
              prevEl: '.swiper-button-prev-guardians',
            }}
            pagination={{
              el: '.swiper-pagination-guardians',
              clickable: true,
            }}
            autoplay={{ delay: 7000, disableOnInteraction: false }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="guardians-swiper pb-6"
          >
            {guardians.map((g, index) => (
              <SwiperSlide key={index} className="h-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-bg-mist border border-brand-green/5 rounded-3xl overflow-hidden luxury-shadow flex flex-col justify-between h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-mist">
                     <img
                      src={g.image}
                      alt={g.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-brand-green/10"></div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block mb-1">
                        {g.role}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-brand-green mb-3">
                        {g.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary font-light italic leading-relaxed">
                        "{g.quote}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <button className="swiper-button-prev-guardians w-11 h-11 rounded-full border border-brand-green/20 text-brand-green bg-bg-cream hover:bg-brand-green hover:text-bg-cream flex items-center justify-center transition-all duration-300 shadow-sm hover:border-brand-gold disabled:opacity-40 disabled:pointer-events-none group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="swiper-pagination-guardians !static !w-auto flex justify-center items-center gap-2"></div>
            
            <button className="swiper-button-next-guardians w-11 h-11 rounded-full border border-brand-green/20 text-brand-green bg-bg-cream hover:bg-brand-green hover:text-bg-cream flex items-center justify-center transition-all duration-300 shadow-sm hover:border-brand-gold disabled:opacity-40 disabled:pointer-events-none group">
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          6. QUALITY AUDITING & CERTIFICATION STORY
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 luxury-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Origin Guarantee
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green">
              Geographical Indication & Verification
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold mt-1"></div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mt-3">
              Because true Kashmiri Saffron (Grade A+ Mongra) and wild forest honey carry premium global pricing, counterfeits are highly active in international retail. To guarantee authentic origin, every shipment exports with its corresponding J&K Geographic Indication (GI) Tag. This verifies the item was natively cultivated and prepared within local districts rather than blended with lower-grade spices from external regions.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 opacity-75">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                <CheckCircle className="w-3.5 h-3.5 text-brand-gold" /> India Organic NPOP
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                <CheckCircle className="w-3.5 h-3.5 text-brand-gold" /> USDA Program
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                <CheckCircle className="w-3.5 h-3.5 text-brand-gold" /> ISO 22000 Quality
              </span>
            </div>
          </div>
          
          <div className="lg:col-span-4 bg-brand-green/5 p-6 rounded-2xl border border-brand-green/10 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-brand-gold" />
              <h4 className="font-serif text-lg font-bold text-brand-green">GI Tag Verification</h4>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed font-light">
              We stamp our packaging with digital QR codes tied directly to laboratory batch reports. Consumers can trace Crocin levels and lead safety indicators transparently online.
            </p>
            <Link
              href="/export"
              className="mt-6 text-xs font-bold text-brand-green hover:text-brand-gold flex items-center gap-0.5 group/btn"
            >
              Verify Sourcing Protocols <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform ml-1" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          7. BOTTOM B2B SOURCING CALL
          ======================================================== */}
      <section className="py-20 bg-brand-green text-bg-cream text-center relative overflow-hidden">
        {/* Soft background text element */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-[0.03] font-serif text-[12vw] select-none pointer-events-none">
          Heritage
        </div>
        
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">Wholesale Sourcing</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-bg-cream mb-4">
            Partner with Kashmiri Organic
          </h2>
          <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed mb-8 max-w-md mx-auto">
            Let us assist your corporation with certified organic raw material contracts, phytosanitary logs, and global cargo logistics.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/inquiry"
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl inline-block"
            >
              Submit Corporate Inquiry
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
