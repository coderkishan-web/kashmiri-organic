'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Search, ArrowRight, PhoneCall, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showArtisansDropdown, setShowArtisansDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Customer auth state
  const [customerUser, setCustomerUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/customer/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.authenticated) {
          setCustomerUser(data.user);
        } else {
          setCustomerUser(null);
        }
      })
      .catch(() => setCustomerUser(null));
  }, [pathname]);

  // Hover timer refs to establish a smooth interactive hover bridge
  const megaMenuTimerRef = React.useRef<any>(null);
  const artisansTimerRef = React.useRef<any>(null);

  const openMega = () => {
    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
    setShowMegaMenu(true);
  };

  const closeMega = () => {
    if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
    megaMenuTimerRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 150);
  };

  const openArtisans = () => {
    if (artisansTimerRef.current) clearTimeout(artisansTimerRef.current);
    setShowArtisansDropdown(true);
  };

  const closeArtisans = () => {
    if (artisansTimerRef.current) clearTimeout(artisansTimerRef.current);
    artisansTimerRef.current = setTimeout(() => {
      setShowArtisansDropdown(false);
    }, 150);
  };

  // Listen to scroll events to apply sticky solid state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (megaMenuTimerRef.current) clearTimeout(megaMenuTimerRef.current);
      if (artisansTimerRef.current) clearTimeout(artisansTimerRef.current);
    };
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setIsOpen(false);
    setShowMegaMenu(false);
    setShowArtisansDropdown(false);
    setSearchLoading(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchLoading(true);
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Exactly requested links
  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Shop by Season', href: '/shop-by-season' },
    { name: 'Products', href: '/products', hasMega: true },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Artisans', href: '/artisans', hasDropdown: false },
    { name: 'Culture', href: '/culture' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const artisanGuilds = [
    { name: 'Pashmina Weavers', slug: 'weavers', desc: 'Masters of handloom Kani and Sozni shawls.', icon: '🧣' },
    { name: 'Walnut Wood Carvers', slug: 'carvers', desc: 'Crafting premium GI-tagged walnut decor.', icon: '🪵' },
    { name: 'Saffron Farmers', slug: 'farmers', desc: 'Traditional harvesters of Pampore gold.', icon: '🌸' },
    { name: 'Nomadic Beekeepers', slug: 'beekeepers', desc: 'Guardians of raw high-altitude forest hives.', icon: '🐝' },
  ];

  const categories = [
    { name: 'Health & Immunity', slug: 'health', desc: 'Immunity & high-altitude organic vitality.', icon: '🌿' },
    { name: 'Skincare & Beauty', slug: 'skincare', desc: 'Natural organic glow & botanical oil serums.', icon: '✨' },
    { name: 'Fitness & Energy', slug: 'fitness', desc: 'Sustained natural energy & plant proteins.', icon: '🍏' },
    { name: 'Natural Living', slug: 'natural-living', desc: 'Sustainable handcrafted walnut woodware.', icon: '🪵' },
    { name: 'Wellness & Aromatherapy', slug: 'wellness', desc: 'Aromatic stress-relief oils & herb blends.', icon: '🧘' },
  ];

  const highlightedMaterials = [
    { name: 'Kashmiri Saffron', slug: 'saffron', desc: 'Handpicked Pampore Mongra grade' },
    { name: 'Walnut Wood', slug: 'wood', desc: 'Carved natural woodwares' },
    { name: 'Forest Honey', slug: 'honey', desc: 'Wild high-altitude honey extraction' },
    { name: 'Himalayan Herbs', slug: 'herbs', desc: 'Wildcrafted alpine botanical flora' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${
        scrolled
          ? 'glassmorphism shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-green text-brand-gold font-serif text-lg font-bold shadow-inner transition-transform duration-300"
            >
              KO
            </motion.span>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-brand-green leading-none">
                Kashmiri
              </span>
              <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-gold uppercase leading-none mt-1">
                Organic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => {
                  if (link.hasMega) openMega();
                  if (link.hasDropdown) openArtisans();
                }}
                onMouseLeave={() => {
                  if (link.hasMega) closeMega();
                  if (link.hasDropdown) closeArtisans();
                }}
              >
                <Link
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1 py-2 ${
                    pathname === link.href
                      ? 'text-brand-green font-bold border-b-2 border-brand-gold'
                      : 'text-text-secondary hover:text-brand-green'
                  }`}
                >
                  {link.name}
                  {(link.hasMega || link.hasDropdown) && (
                    <motion.div
                      animate={{ rotate: (link.hasMega ? showMegaMenu : showArtisansDropdown) ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-brand-gold opacity-80" />
                    </motion.div>
                  )}
                </Link>

                {link.hasDropdown && (
                  <AnimatePresence>
                    {showArtisansDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 mt-2 w-72 bg-bg-cream border border-brand-green/15 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-1.5"
                      >
                        {artisanGuilds.map((guild) => (
                          <Link
                            key={guild.slug}
                            href={`/artisans?guild=${guild.slug}`}
                            className="group flex items-start gap-3 p-2 hover:bg-bg-beige/40 rounded-xl transition-all duration-300"
                          >
                            <span className="text-lg p-1 bg-bg-beige/65 rounded-lg group-hover:bg-brand-gold/25 transition-colors shrink-0">
                              {guild.icon}
                            </span>
                            <div className="text-left">
                              <span className="text-xs font-semibold text-brand-green group-hover:text-brand-gold transition-colors duration-300 block">
                                {guild.name}
                              </span>
                              <span className="text-[10px] text-text-muted font-light block leading-tight mt-0.5">
                                {guild.desc}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side: Global Search & B2B Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Icon Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-text-secondary hover:text-brand-green transition-colors duration-300 focus:outline-none cursor-pointer"
              aria-label="Open search dialog"
            >
              <Search className="w-5 h-5" />
            </button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/inquiry"
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-bg-cream px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider luxury-shadow transition-all duration-300"
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-gold animate-pulse" /> B2B Inquiry
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {customerUser ? (
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-green px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                >
                  <User className="w-3.5 h-3.5 text-brand-green" /> Account
                </Link>
              ) : (
                <Link
                  href="/account/login"
                  className="inline-flex items-center gap-2 border border-brand-green/20 hover:border-brand-green text-brand-green px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsOpen(false);
              }}
              className="p-2 text-text-secondary hover:text-brand-green focus:outline-none cursor-pointer"
              aria-label="Open mobile search dialog"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-green hover:text-brand-gold focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Global Full-Width Mega Menu Dropdown */}
        <AnimatePresence>
          {showMegaMenu && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 top-full bg-bg-cream rounded-3xl shadow-2xl p-8 border border-brand-green/15 mt-2 z-50 grid grid-cols-12 gap-8"
            >
              {/* Column 1: Categories & Collections */}
              <div className="col-span-12 md:col-span-5 border-r border-brand-green/10 pr-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-5 flex items-center gap-1.5 pl-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" /> Organic Collections
                </h3>
                <div className="grid gap-3">
                  {categories.map((cat, idx) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="group flex items-start gap-3 p-2.5 hover:bg-bg-beige/40 rounded-2xl transition-all duration-300"
                      >
                        <span className="text-xl p-1 bg-bg-beige/60 rounded-lg group-hover:bg-brand-gold/20 transition-colors shrink-0">
                          {cat.icon}
                        </span>
                        <div>
                          <span className="text-sm font-semibold text-brand-green group-hover:text-brand-gold transition-colors duration-300 block">
                            {cat.name}
                          </span>
                          <span className="text-xs text-text-muted font-light mt-0.5 block leading-relaxed">
                            {cat.desc}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Column 2: Kashmiri Materials */}
              <div className="col-span-12 md:col-span-4 border-r border-brand-green/10 pr-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-brown mb-5 pl-2">
                  🏔️ Kashmiri Materials
                </h3>
                <p className="text-xs text-text-muted leading-relaxed font-light mb-6 pl-2">
                  Discover the local valleys, pure alpine soil chemistry, and wild harvesting details behind our organic masterpieces.
                </p>
                <div className="flex flex-col gap-3">
                  {highlightedMaterials.map((mat, idx) => (
                    <motion.div 
                      key={mat.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 + 0.1 }}
                    >
                      <Link
                        href={`/materials/${mat.slug}`}
                        className="group block p-3 bg-bg-beige/25 hover:bg-bg-beige/65 border border-brand-green/5 hover:border-brand-gold/30 rounded-2xl transition-all duration-300"
                      >
                        <h4 className="text-xs font-bold text-brand-green group-hover:text-brand-gold transition-colors">
                          {mat.name}
                        </h4>
                        <p className="text-[11px] text-text-muted mt-0.5 font-light">
                          {mat.desc}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Column 3: B2B Sourcing Hub & Luxury Spotlight */}
              <div className="col-span-12 md:col-span-3 flex flex-col justify-between pl-2">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/30 px-3 py-1.5 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>
                    <span className="text-[9px] uppercase font-bold text-brand-gold tracking-widest">GI-Tag Certified</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-brand-green leading-tight">
                    Premium Sourcing Desk
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed font-light">
                    Direct shipping coordinates from Srinagar to London, Zurich, and global luxury B2B partners. Grade-A certified pure harvests.
                  </p>
                </div>

                <div className="bg-brand-green text-bg-cream p-5 rounded-2xl relative overflow-hidden shadow-lg mt-6 flex flex-col justify-between gap-4">
                  <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-2 translate-y-2 pointer-events-none">
                    <span className="font-serif text-9xl font-bold select-none">KO</span>
                  </div>
                  <p className="text-[11px] text-brand-gold font-serif italic font-semibold leading-relaxed">
                    "From absolute raw origins to high refined organic chemistry, we preserve natural perfection."
                  </p>
                  <Link
                    href="/inquiry"
                    className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 transition-transform duration-200 active:scale-95 shadow"
                  >
                    Bulk Sourcing Request <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Mobile Drawer Navigation (Slide-in) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-[68px] z-40 bg-bg-cream/98 backdrop-blur-lg overflow-y-auto border-t border-brand-green/5 shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col justify-between min-h-[calc(100vh-68px)]">
              
              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-bg-beige/30 pb-4">
                    <Link
                      href={link.href}
                      className={`text-xl font-serif font-bold tracking-tight block ${
                        pathname === link.href ? 'text-brand-gold' : 'text-brand-green'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {link.hasMega && (
                      <div className="mt-4 pl-4 grid gap-3 border-l-2 border-brand-gold/30">
                        {categories.map((cat) => (
                          <Link
                            key={cat.name}
                            href={`/products?category=${cat.slug}`}
                            className="text-sm font-semibold text-text-secondary hover:text-brand-green flex items-center gap-2"
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {link.hasDropdown && (
                      <div className="mt-4 pl-4 grid gap-3 border-l-2 border-brand-gold/30">
                        {artisanGuilds.map((guild) => (
                          <Link
                            key={guild.slug}
                            href={`/artisans?guild=${guild.slug}`}
                            className="text-sm font-semibold text-text-secondary hover:text-brand-green flex items-center gap-2"
                          >
                            <span>{guild.icon}</span>
                            <span>{guild.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Footer & Quick Contact */}
              <div className="border-t border-brand-green/10 pt-6 mt-8">
                <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest mb-3">
                  Export & Bulk Channels
                </p>
                <div className="grid gap-3">
                  <a
                    href="tel:+919876543210"
                    className="text-sm font-semibold text-brand-brown hover:underline block"
                  >
                    📞 Phone/WhatsApp: +91 98765 43210
                  </a>
                  <Link
                    href="/inquiry"
                    className="w-full text-center block bg-brand-green hover:bg-brand-green/90 text-bg-cream py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow"
                  >
                    Request B2B Corporate Quote
                  </Link>
                  {customerUser ? (
                    <Link
                      href="/account"
                      className="w-full text-center block bg-brand-gold hover:bg-brand-gold/90 text-brand-green py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow"
                    >
                      👤 Client Account Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/account/login"
                      className="w-full text-center block border border-brand-green/30 hover:border-brand-green text-brand-green py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Sign In / Register
                    </Link>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Search Loading Overlay */}
      <AnimatePresence>
        {searchLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-bg-mist/85 backdrop-blur-md z-[99999] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative flex items-center justify-center w-24 h-24">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute w-20 h-20 border-2 border-brand-green/10 border-t-brand-gold rounded-full"
              />
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center font-serif text-brand-gold font-bold text-sm shadow-inner"
              >
                KO
              </motion.div>
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="font-serif text-lg font-bold text-brand-green tracking-wide">
                Searching Pure Offerings
              </h3>
              <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-[0.25em] mt-1.5 animate-pulse">
                Evaluating Sourcing Archives
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-green/85 backdrop-blur-md z-[99998] flex items-center justify-center p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-bg-cream max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-brand-green/10 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-brand-green transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Search Header */}
              <div className="mb-6 text-center">
                <h3 className="font-serif text-2xl font-bold text-brand-green">
                  Valley Archive Search
                </h3>
                <p className="text-xs text-brand-gold font-semibold uppercase tracking-[0.2em] mt-1">
                  Lookup Pure Kashmiri Treasures
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Type to search saffron, honey, wood..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8F5] text-[#1B3527] text-base placeholder-text-muted px-6 py-4 pl-12 rounded-2xl border border-brand-green/15 focus:outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 transition-all duration-300 font-serif"
                  autoFocus
                />
                <Search className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </form>

              {/* Popular Searches */}
              <div className="mt-6 pt-4 border-t border-brand-green/5 flex flex-wrap items-center justify-between gap-3 text-[11px] text-text-secondary">
                <span className="font-medium text-brand-gold">Popular Searches:</span>
                <div className="flex flex-wrap gap-2">
                  {['Saffron', 'Honey', 'Walnut Bowl', 'Lavender'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        setSearchLoading(true);
                        setIsSearchOpen(false);
                        router.push(`/search?q=${encodeURIComponent(term)}`);
                        setSearchQuery('');
                      }}
                      className="bg-[#F1EDE6]/60 hover:bg-brand-gold/15 text-brand-green px-3 py-1 rounded-full border border-brand-green/5 hover:border-brand-gold/30 transition-all cursor-pointer font-semibold"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
