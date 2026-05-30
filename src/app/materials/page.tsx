import React from 'react';
import Link from 'next/link';
import { executeQuery, Material } from '@/lib/db';
import { Compass, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default async function MaterialsPage() {
  // Fetch materials
  const materials = await executeQuery<Material[]>('SELECT * FROM materials');

  // Photographic references representing the organic origins
  const originImages: Record<string, string> = {
    saffron: 'https://images.unsplash.com/photo-1596790011462-c39c6f1a55f8?auto=format&fit=crop&w=600&q=80',
    honey: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
    wood: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=600&q=80',
    walnut: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    herbs: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=600&q=80',
    'royal-pahalgam-lavender': 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist animate-in fade-in duration-500">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Materials</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            Ethical Agriculture
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream mb-4">
            Purity of Elements
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            Our luxury organic products are crafted exclusively around five raw materials natively sourced from J&K forests, orchards, and valleys.
          </p>
        </div>
      </section>

      {/* 2. Materials Directory List */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="flex flex-col gap-12">
          {materials.map((mat, index) => {
            const isEven = index % 2 === 0;
            const primaryImage = originImages[mat.slug] || '/images/material-placeholder.jpg';
            
            return (
              <div
                key={mat.id}
                className={`bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow grid grid-cols-1 lg:grid-cols-12 items-stretch ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                
                {/* Visual Area */}
                <div className={`lg:col-span-5 relative min-h-[300px] lg:min-h-auto ${
                  isEven ? 'lg:order-1' : 'lg:order-2'
                }`}>
                  <img
                    src={primaryImage}
                    alt={mat.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Subtle vignette gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-green/30 to-transparent"></div>
                </div>

                {/* Narrative Area */}
                <div className={`lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between ${
                  isEven ? 'lg:order-2' : 'lg:order-1'
                }`}>
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs uppercase font-bold tracking-widest text-brand-gold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {mat.origin.split(',')[0]}
                      </span>
                      <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                      <span className="text-xs uppercase font-bold tracking-widest text-brand-sage flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Sustainable
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green mb-4">
                      {mat.name}
                    </h2>
                    
                    <p className="text-sm text-text-secondary font-light leading-relaxed mb-6">
                      {mat.overview}
                    </p>

                    {/* Quick highlights block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-bg-mist p-4 rounded-xl border border-brand-green/5">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown block">Key Benefit</span>
                        <span className="text-xs text-text-secondary font-light mt-0.5 block">{mat.benefits.split(',')[0]}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-brown block">Harvest Method</span>
                        <span className="text-xs text-text-secondary font-light mt-0.5 block">Traditional handwork</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-brand-green/5 pt-4 mt-4">
                    <span className="text-xs text-text-muted italic">
                      Protected GI Ingredient
                    </span>
                    
                    <Link
                      href={`/materials/${mat.slug}`}
                      className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300"
                    >
                      Read Origin Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Footer B2B Sourcing Call */}
      <section className="py-16 bg-brand-green text-bg-cream text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Compass className="w-10 h-10 text-brand-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bg-cream mb-4">
            B2B Raw Material Export Contracting
          </h2>
          <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed mb-6 max-w-md mx-auto">
            We partner with cosmetic laboratories, premium spice distributors, and luxury hotel chains to supply secure, audited containers of raw materials.
          </p>
          <Link
            href="/export"
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl inline-block"
          >
            Review Export Guidelines
          </Link>
        </div>
      </section>

    </div>
  );
}
