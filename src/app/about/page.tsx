import React from 'react';
import Link from 'next/link';
import { Sprout, ShieldCheck, Heart, Award, ArrowRight, Compass, ShieldAlert } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-mist animate-in fade-in duration-500">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Heritage</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            Pure Roots
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream mb-4">
            The Kashmiri Organic Story
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            Protecting ancestral J&K agriculture, supporting artisanal walnut guilds, and delivering uncompromised high-altitude purity to the world.
          </p>
        </div>
      </section>

      {/* 2. Narrative & Brand Philosophy */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Narrative Text (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Ancient Valley Origins
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-green leading-tight">
              Sourced at the Peak of Purity
            </h2>
            <div className="w-12 h-0.5 bg-brand-gold"></div>
            
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-light">
              Kashmiri Organic was born from a simple promise: to protect the delicate agricultural heritage of the Kashmir Valley and provide a direct path from family farms to premium global buyers. The unique microclimate of Jammu & Kashmir, with its freezing winters, volcanic soils, and pure glacial rivers, stimulates local plants to synthesize exceptionally high levels of therapeutic essential oils and active bio-compounds.
            </p>
            
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-light">
              From the deep red saffron fields of Pampore to the soaring wild lavender meadows of Gulmarg, we maintain strict control over every step of our supply chain. We reject wholesale middle-agents, ensuring our agricultural co-operatives and woodcraft carving guilds receive fair compensation for their expertise.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-green">100% Traceable</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">Every batch corresponds directly to its harvesting farm code.</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Sprout className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-green">Traditional dry Farming</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">Protecting soils and water tables using heritage crop rotations.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Showcase Frame (Right) */}
          <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-xl border border-brand-green/5">
            <img
              src="https://images.unsplash.com/photo-1508747703725-719ae2c98295?auto=format&fit=crop&w=800&q=80"
              alt="Pampore Saffron Fields"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Saffron accent dust overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 via-transparent to-transparent"></div>
            
            {/* Embedded Stat card */}
            <div className="absolute bottom-6 left-6 right-6 bg-bg-cream/90 backdrop-blur p-5 rounded-2xl border border-brand-gold/20 text-brand-green">
              <h4 className="font-serif font-bold text-lg">120+ Families</h4>
              <p className="text-[11px] text-text-secondary leading-relaxed font-light mt-1">
                Our collaborative framework supports agricultural homesteads and Master Woodcarver guilds across Anantnag, Pampore, and Kupwara.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Corporate Values Grid */}
      <section className="py-16 bg-brand-green text-bg-cream px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Mission */}
            <div className="bg-bg-cream/5 p-8 rounded-2xl border border-bg-cream/10 flex flex-col gap-4">
              <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bg-cream">Our Mission</h3>
              <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed">
                To protect the pristine botanical purity and artisanal woodworking heritage of Kashmir by maintaining direct co-operative trade routes that prioritize farm welfare and global quality certifications.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-bg-cream/5 p-8 rounded-2xl border border-bg-cream/10 flex flex-col gap-4">
              <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bg-cream">Our Vision</h3>
              <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed">
                To establish "Kashmiri Organic" as the world's most trusted luxury brand for authentic high-altitude wellness ingredients, recognized for carbon-neutral sourcing and total laboratory transparency.
              </p>
            </div>

            {/* Organic Philosophy */}
            <div className="bg-bg-cream/5 p-8 rounded-2xl border border-bg-cream/10 flex flex-col gap-4">
              <div className="w-10 h-10 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bg-cream">Organic Philosophy</h3>
              <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed">
                We believe health and wellness cannot be fast-tracked. Our honey hives are cruelty-free, our walnut trees are sustainably managed, and our saffron is dry-farmed strictly in harmony with seasonal sun cycles.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Quality Auditing & Certification Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 luxury-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Quality Assurance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Unrivaled Laboratory Credentials
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light">
              Because Kashmiri Saffron and wild essential oils command such premium global values, market adulteration is a persistent threat. To protect our buyers, every export batch must undergo independent laboratory audits. We verify saffron crocin density, picrocrocin bitterness profiles, and moisture levels before packing. Our seasoned walnut wood is naturally treated and certified fumigated for safe custom port entry worldwide.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mt-4 opacity-75">
              <span className="text-xs font-bold text-brand-green">India Organic NPOP</span>
              <span className="text-xs font-bold text-brand-green">USDA National Organic Program</span>
              <span className="text-xs font-bold text-brand-green">ISO 22000 Safety Certified</span>
            </div>
          </div>
          
          <div className="lg:col-span-4 bg-brand-green/5 p-6 rounded-2xl border border-brand-green/10 flex flex-col justify-between min-h-[200px]">
            <h4 className="font-serif text-lg font-bold text-brand-green">GI Tag Verification</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed font-light mt-1.5">
              Authentic Kashmiri products carry protected Geographical Indication (GI) badges, certifying they are cultivated natively in J&K rather than bulk-blended elsewhere.
            </p>
            <Link
              href="/export"
              className="mt-4 text-xs font-bold text-brand-green hover:text-brand-gold flex items-center gap-0.5 group/btn"
            >
              Verify Sourcing Protocols <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Bottom B2B Sourcing Call */}
      <section className="py-16 bg-brand-green text-bg-cream text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">Wholesale Sourcing</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-bg-cream mb-4">
            Partner with Kashmiri Organic
          </h2>
          <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed mb-6 max-w-md mx-auto">
            Let us assist your corporation with certified organic raw material contracts, phytosanitary logs, and global cargo logistics.
          </p>
          <Link
            href="/inquiry"
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl inline-block"
          >
            Submit Corporate inquiry
          </Link>
        </div>
      </section>

    </div>
  );
}
