'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activePath, setActivePath] = useState(pathname);

  useEffect(() => {
    if (pathname !== activePath) {
      setIsTransitioning(true);
      // Let the diagonal sweep play, then update active path
      const timer = setTimeout(() => {
        setActivePath(pathname);
        setIsTransitioning(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [pathname, activePath]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Active content */}
      <motion.div
        key={activePath}
        initial={{ opacity: 0.95 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* The Diagonal Sweep Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ x: '-150%', skewX: -25 }}
            animate={{ x: '150%', skewX: -25 }}
            exit={{ x: '150%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-y-0 w-[180vw] z-[99999] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #122b25 0%, #d4a373 100%)',
              boxShadow: '0 0 100px rgba(18, 43, 37, 0.4)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
