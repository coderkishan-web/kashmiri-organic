'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  gallery: string[];
  productName: string;
  exportQuality: number;
  certified: number;
  productId: number;
}

export default function ProductImageGallery({
  gallery,
  productName,
  exportQuality,
  certified,
  productId,
}: ProductImageGalleryProps) {
  // Pre-mapped high-res photography to replace fallbacks
  const productImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', // saffron
    2: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', // honey
    3: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80', // bowl
    4: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', // oil
    5: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80', // lavender
  };

  const defaultImage = productImages[productId] || gallery[0];
  const [activeImage, setActiveImage] = useState(defaultImage);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Primary Display Frame */}
      <div className="bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow aspect-[4/3] relative">
        {exportQuality === 1 && (
          <span className="absolute top-6 left-6 z-10 bg-brand-green text-brand-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Premium Export Quality
          </span>
        )}
        {certified === 1 && (
          <span className="absolute top-6 right-6 z-10 bg-brand-gold text-brand-green text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-brand-gold" /> USDA Certified
          </span>
        )}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            initial={{ opacity: 0.92, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.92, scale: 0.99 }}
            transition={{ duration: 0.25 }}
            src={activeImage}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnail Gallery */}
      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {gallery.map((img, idx) => {
            const mappedImg = productImages[productId] || img;
            const isActive = activeImage === mappedImg;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveImage(mappedImg)}
                className={`aspect-video rounded-xl overflow-hidden border bg-bg-cream relative cursor-pointer transition-all duration-300 ${
                  isActive ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-brand-green/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={mappedImg}
                  alt={`${productName} Alternate View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
