'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || '';
  const sessionId = searchParams.get('session_id') || '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      localStorage.removeItem('kashmiri_organic_cart');
      // Dispatch a custom event to notify any open layout components (like Navbar cart count badge)
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to clear cart in success page', e);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-20">
      {/* Ambient glows */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[45vw] h-[45vw] rounded-full bg-[#C5A880]/8 blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md bg-white border border-[#1B3527]/8 rounded-3xl p-8 shadow-2xl text-center space-y-7"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto shadow-inner"
        >
          <CheckCircle className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
        </motion.div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-emerald-600 block">
            Payment Successful
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1B3527] leading-tight">
            Thank You For Your Order
          </h1>
          <p className="text-xs text-[#8A968E] leading-relaxed font-light max-w-xs mx-auto">
            Your payment has been confirmed and your order is being prepared. A confirmation will be sent to your registered contact.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-[#FAF8F5] border border-[#1B3527]/8 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1B3527]/8 pb-3 mb-1">
            <Package className="w-4 h-4 text-[#C5A880]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
              Order Details
            </span>
          </div>

          {orderId && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#8A968E] font-light">Order ID</span>
              <span className="font-mono font-bold text-[#1B3527] bg-[#1B3527]/5 px-2 py-0.5 rounded-md">
                {orderId}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8A968E] font-light">Status</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Payment Confirmed
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#8A968E] font-light">Processing Time</span>
            <span className="font-medium text-[#1B3527]">1–3 Business Days</span>
          </div>
        </div>

        {/* Next steps note */}
        <p className="text-[10px] text-[#8A968E] leading-relaxed">
          Track your order status anytime in{' '}
          <span className="text-[#C5A880] font-semibold">My Account → My Orders</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 pt-1">
          <Link
            href="/account"
            className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-[0.97]"
          >
            <Package className="w-4 h-4" />
            View Order Status
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/products"
            className="w-full bg-transparent border border-[#1B3527]/15 hover:bg-[#1B3527]/5 text-[#1B3527] font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-[0.97]"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
