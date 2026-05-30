'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-bg-mist/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer Premium Spinner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute w-20 h-20 border-2 border-brand-green/10 border-t-brand-gold rounded-full"
        />
        {/* Inner Pulsing Brand Icon */}
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
          Harnessing Alpine Purity
        </h3>
        <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-[0.25em] mt-1.5 animate-pulse">
          Kashmiri Organic
        </p>
      </div>
    </div>
  );
}
