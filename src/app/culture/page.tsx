'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Compass, Coffee, Sun, Sprout, ArrowRight } from 'lucide-react';

interface CultureSection {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  image: string;
  description: string;
  details: string[];
}

const SECTIONS: CultureSection[] = [
  {
    title: 'Kahwa Tea Ceremony',
    subtitle: 'The Spirit of Kashmiri Hospitality',
    icon: <Coffee className="w-5 h-5 text-brand-gold" />,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    description: 'Kahwa is not just a drink; it is an ancestral ceremony of warmth and welcome. Traditionally brewed in a copper samovar (a tall, ornate metal kettle with a central fire chamber filled with live charcoal embers), Kahwa is a green tea blend infused with pure Pampore saffron, green cardamom, cinnamon bark, and crushed sweet mountain almonds.',
    details: [
      'Brewed exclusively in copper Samovars',
      'Infused with raw saffron stigmas for golden color',
      'Sweetened naturally with local acacia honey',
      'Served warm with crushed high-altitude almonds'
    ]
  },
  {
    title: 'Valley Lifestyle',
    subtitle: 'Rhythms of Mountain Resilience',
    icon: <Compass className="w-5 h-5 text-brand-gold" />,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    description: 'Kashmiri life is intimately bound to the contours of the Himalayas. The locals maintain a gentle, eco-harmonious relationship with the land. From the wooden houseboats (Dungas) on Dal Lake to the remote stone hamlets in Ganderbal, life is characterized by patience, resilience, and a deep reverence for the elements.',
    details: [
      'Traditional Kangri wicker baskets for winter warmth',
      'Mud-plastered wall systems for natural insulation',
      'Ethical resource gathering and forest management',
      'Generational wisdom of mountain herbal remedies'
    ]
  },
  {
    title: 'Agricultural Cycles',
    subtitle: 'Farming by the Seasons',
    icon: <Sprout className="w-5 h-5 text-brand-gold" />,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    description: 'Farming in the valley is a sacred cycle synchronized with the sun and snow melt. The agricultural calendar is strictly divided into traditional periods: Sont (Spring sowing), Grishm (Summer cultivation), Harud (Autumn saffron plucking), and Wand (Winter preservation). Fields are dry-farmed organically, relying on mineral-rich glacial streams.',
    details: [
      'Glacial clay silt Karevas holding ancient minerals',
      'Strict adherence to lunar sowing timetables',
      'Organic compost fertilizing, zero chemical additives',
      'Seed preservation in traditional airtight clay urns'
    ]
  }
];

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-bg-cream text-text-primary pt-24 pb-16">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-[0.25em] pl-1 block">Living Traditions</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-brand-green tracking-tight leading-tight">
            The Soul of Kashmir
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
            Travel deep into the cultural identity of the valley—where mountain wisdom, ancient tea ceremonies, and organic farming rhythms weave together a lifestyle of pure simplicity.
          </p>
        </div>
      </div>

      {/* Culture Sections List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {SECTIONS.map((section, idx) => (
          <div 
            key={section.title}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image Block */}
            <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-bg-mist aspect-[4/3] border border-brand-green/10">
                <img 
                  src={section.image} 
                  alt={section.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
              </div>
            </div>

            {/* Content Block */}
            <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-brand-gold/10 rounded-xl border border-brand-gold/25">
                  {section.icon}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
                  {section.subtitle}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-green">
                {section.title}
              </h2>

              <p className="text-sm text-text-muted leading-relaxed font-light">
                {section.description}
              </p>

              <div className="border-t border-brand-green/10 pt-6">
                <h4 className="text-[10px] uppercase font-bold text-brand-green tracking-widest mb-4">Core Principles</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2 text-xs font-light text-text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sourcing / Call-to-action Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-brand-green text-bg-cream rounded-3xl overflow-hidden p-8 sm:p-12 text-center space-y-6 relative border border-brand-gold/20 shadow-2xl">
          <div className="absolute right-0 bottom-0 opacity-[0.03] font-serif text-9xl select-none translate-y-10 translate-x-10">
            KASHMIR
          </div>
          
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-[0.25em] block">Experience the Rhythms</span>
          
          <h2 className="font-serif text-3xl sm:text-4xl font-bold max-w-xl mx-auto leading-tight">
            Bring the Cultural Harmony to Your Store
          </h2>
          
          <p className="text-xs sm:text-sm text-bg-cream/80 max-w-md mx-auto font-light leading-relaxed">
            Our wholesale products include traditional packaging and cultural documentation. Share the authentic stories of the valley with your customers.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop-by-season"
              className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-transform duration-200 active:scale-95 shadow flex items-center justify-center gap-1.5"
            >
              Shop Seasonal Harvests <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              href="/inquiry"
              className="w-full sm:w-auto bg-bg-cream/10 hover:bg-bg-cream/15 text-bg-cream border border-bg-cream/20 font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-full transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              Partner Sourcing Desk
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
