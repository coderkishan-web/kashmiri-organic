'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Tag, Sparkles } from 'lucide-react';

export default function PopupCoupon() {
  const router = useRouter();
  const [couponData, setCouponData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch active popup coupon from backend
    fetch('/api/customer/popup-coupon')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch');
      })
      .then(data => {
        if (data && data.coupon) {
          const coupon = data.coupon;
          const product = data.product;

          // Check if this coupon was already dismissed/seen in localStorage
          const hasSeen = localStorage.getItem(`dismissed_coupon_${coupon.id}`);
          if (!hasSeen) {
            setCouponData({ coupon, product });
            // Slide in after 2 seconds for a premium feel
            const timer = setTimeout(() => {
              setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load popup promotion:', err);
      });
  }, []);

  if (!couponData || !isVisible) return null;

  const { coupon, product } = couponData;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem(`dismissed_coupon_${coupon.id}`, 'true');
  };

  const handleCardClick = () => {
    setIsVisible(false);
    localStorage.setItem(`dismissed_coupon_${coupon.id}`, 'true');
    if (product?.slug) {
      router.push(`/products/${product.slug}`);
    } else {
      router.push('/products');
    }
  };

  const getValidityText = () => {
    if (coupon.condition_type === 'two_days') {
      return 'Valid for 48 hours only';
    }
    if (coupon.condition_type === 'first_purchase') {
      return 'First purchase only';
    }
    if (coupon.condition_type === 'period' && coupon.end_date) {
      const date = new Date(coupon.end_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `Valid until ${date}`;
    }
    return 'Limited time offer';
  };

  const getDiscountDescription = () => {
    const value = coupon.discount_type === 'percentage' 
      ? `${coupon.discount_value}%` 
      : `$${coupon.discount_value}`;
    
    if (product) {
      return `Get ${value} off on ${product.name}`;
    }
    return `Get ${value} off on all premium organic products`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:max-w-sm bg-brand-green/95 backdrop-blur-md border border-brand-gold/30 shadow-2xl rounded-2xl p-4 text-bg-cream cursor-pointer transform transition-all duration-500 ease-out hover:scale-[1.02] hover:border-brand-gold/60 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-bg-cream/70 hover:text-brand-gold transition-colors p-1 rounded-full hover:bg-white/10"
        aria-label="Close offer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-4">
        {/* Product Image Thumbnail */}
        {product?.image_url ? (
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-brand-gold/20 shrink-0 bg-white/5">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl flex items-center justify-center border border-brand-gold/20 shrink-0 bg-brand-gold/10 text-brand-gold">
            <Tag className="w-7 h-7 animate-pulse" />
          </div>
        )}

        {/* Content details */}
        <div className="flex-grow pr-4">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
              Exclusive Reward
            </span>
          </div>

          <h4 className="font-serif text-sm font-bold leading-snug text-bg-cream mb-1">
            {getDiscountDescription()}
          </h4>

          {/* Promo code badge */}
          <div className="inline-block bg-white/10 border border-white/10 rounded-lg px-2 py-0.5 text-xs font-mono font-bold text-brand-gold tracking-wide mb-2">
            CODE: {coupon.code}
          </div>

          <div className="flex items-center justify-between text-[10px] text-bg-cream/60">
            <span>{getValidityText()}</span>
            <span className="font-bold text-brand-gold group hover:underline">
              Claim Now →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
