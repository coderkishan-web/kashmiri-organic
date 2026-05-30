'use strict';

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-green text-bg-cream pt-16 pb-8 border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand Info + Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-bg-beige/10">
          
          {/* Logo & Narrative */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-gold text-brand-green font-serif text-xl font-bold shadow-md">
                KO
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-bg-cream leading-none">
                  Kashmiri Organic
                </span>
                <span className="text-[10px] tracking-[0.25em] font-semibold text-brand-gold uppercase leading-none mt-1.5">
                  Luxury Natural Heritage
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-bg-cream/70 leading-relaxed font-light max-w-md">
              Sourced from the fertile volcanic soils of Pampore and the ancient glacial valleys of the Himalayas. We unite family farming traditions with international certification standards to deliver the world's most premium saffron, wild honeys, cold-pressed seed oils, and handcarved walnut masterpieces.
            </p>

            {/* Certifications Quick Badges */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 bg-bg-cream/5 px-3 py-1.5 rounded-full border border-bg-cream/10">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-bg-cream/80">GI Tag Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-bg-cream/5 px-3 py-1.5 rounded-full border border-bg-cream/10">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-bg-cream/80">USDA Organic</span>
              </div>
            </div>
          </div>

          {/* Newsletter / Sourcing Inquiries */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-bg-cream/5 p-6 sm:p-8 rounded-2xl border border-bg-cream/10">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-bg-cream mb-2">
                Join our Global Sourcing Circle
              </h3>
              <p className="text-xs sm:text-sm text-bg-cream/70 mb-6 font-light">
                Receive analytical updates, harvesting reports from Pampore, and priority notifications on seasonal small-batch raw product availability.
              </p>
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    required
                    placeholder="Enter your corporate or personal email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-green/30 text-sm text-bg-cream placeholder-bg-cream/40 px-4 py-3 pl-11 rounded-xl border border-bg-cream/20 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
                  />
                  <Mail className="w-4 h-4 text-bg-cream/40 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                
                <button
                  type="submit"
                  className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 duration-200"
                >
                  {subscribed ? 'Subscribed!' : (
                    <>
                      Subscribe <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section: Quick Nav Lists */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-bg-beige/10">
          
          {/* Column 1: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Products Catalog
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Pure Materials
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Stories & Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/products?category=health" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Health & Vitality
                </Link>
              </li>
              <li>
                <Link href="/products?category=skincare" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Luxury Skincare
                </Link>
              </li>
              <li>
                <Link href="/products?category=natural-living" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Walnut Wood Artistry
                </Link>
              </li>
              <li>
                <Link href="/products?category=wellness" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Aromatherapy & Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Materials Origin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
              Heritage Materials
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/materials/saffron" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Kashmiri Mongra Saffron
                </Link>
              </li>
              <li>
                <Link href="/materials/honey" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Wild forest Honey
                </Link>
              </li>
              <li>
                <Link href="/materials/wood" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Carved Walnut Wood
                </Link>
              </li>
              <li>
                <Link href="/materials/walnut" className="text-sm text-bg-cream/70 hover:text-brand-gold transition-colors">
                  Himalayan Walnut Kernels
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: B2B Contact info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">
              B2B / Exports
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-xs text-bg-cream/70 leading-relaxed font-light">
                  Pampore Organic Farms, Highway 1A, Pulwama, J&K, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="tel:+919876543210" className="text-xs text-bg-cream/70 hover:text-brand-gold">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href="mailto:exports@kashmiriorganic.com" className="text-xs text-bg-cream/70 hover:text-brand-gold">
                  exports@kashmiriorganic.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright + Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 text-xs text-bg-cream/50">
          <p className="text-center md:text-left font-light">
            © {currentYear} Kashmiri Organic. All Rights Reserved. Crafted for global export and heritage preservation.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
            <Link href="/export" className="hover:text-brand-gold transition-colors">Sourcing Terms</Link>
            <Link href="/admin/login" className="hover:text-brand-gold transition-colors font-semibold border-b border-bg-cream/20 pb-0.5">
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
