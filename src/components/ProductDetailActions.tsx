'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Loader2, X, Phone, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  slug: string;
  price?: number | null;
  discount_price?: number | null;
  image_url: string;
}

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();

  // Auth/Modal States
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  
  // Inputs
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  // Cart & State check
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Messaging/Loading
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Sync quantity if product is already in cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kashmiri_organic_cart');
      if (saved) {
        const currentCart = JSON.parse(saved);
        const item = currentCart.find((item: any) => item.id === product.id);
        if (item) {
          setQuantity(item.quantity);
        }
      }
    } catch (e) {}
  }, [product.id, isInCart]);

  // Check on mount if item is in the cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kashmiri_organic_cart');
      if (saved) {
        const currentCart = JSON.parse(saved);
        const exists = currentCart.some((item: any) => item.id === product.id);
        setIsInCart(exists);
      }
    } catch (e) {}
  }, [product.id]);

  // Adjust quantity
  const handleQuantityChange = (val: number) => {
    const newQty = Math.max(1, quantity + val);
    setQuantity(newQty);

    // If already in cart, update cart quantity directly in localStorage
    if (isInCart) {
      try {
        const saved = localStorage.getItem('kashmiri_organic_cart');
        if (saved) {
          const currentCart = JSON.parse(saved);
          const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);
          if (existingIndex > -1) {
            currentCart[existingIndex].quantity = newQty;
            localStorage.setItem('kashmiri_organic_cart', JSON.stringify(currentCart));
          }
        }
      } catch (e) {}
    }
  };

  // Check auth and add to cart
  const handleOrderClick = async () => {
    setCheckingAuth(true);
    setAuthError('');
    setAuthSuccess('');
    
    try {
      const res = await fetch('/api/customer/auth/me');
      const data = await res.json();

      if (res.ok && data?.authenticated) {
        // Logged in! Add to cart
        addToCart();
      } else {
        // Not logged in. Prompt login modal
        setShowLoginModal(true);
        setAuthStep('phone');
      }
    } catch (err) {
      // Fallback: prompt login
      setShowLoginModal(true);
      setAuthStep('phone');
    } finally {
      setCheckingAuth(false);
    }
  };

  // Cart helper
  const addToCart = () => {
    const activePrice = product.discount_price || product.price || 0;
    const cartItem = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: activePrice,
      quantity: quantity,
      image_url: product.image_url,
    };

    // Load existing cart
    let currentCart: any[] = [];
    try {
      const saved = localStorage.getItem('kashmiri_organic_cart');
      if (saved) currentCart = JSON.parse(saved);
    } catch (e) {
      currentCart = [];
    }

    // Check if item already in cart
    const existingIndex = currentCart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity = quantity;
    } else {
      currentCart.push(cartItem);
    }

    // Save cart
    localStorage.setItem('kashmiri_organic_cart', JSON.stringify(currentCart));
    setIsInCart(true);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setActionLoading(true);

    if (!phone || phone.trim().length < 10) {
      setAuthError('Please enter a valid mobile number.');
      setActionLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/customer/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setAuthStep('otp');
        setAuthSuccess('Secure code sent successfully.');
        if (data.otp) {
          setGeneratedOtp(data.otp);
        }
      } else {
        setAuthError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setAuthError('Network communication error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setActionLoading(true);

    if (!otp) {
      setAuthError('Please enter the 6-digit verification code.');
      setActionLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();

      if (res.ok && data?.success) {
        setAuthSuccess('Coordinates verified. Adding to cart...');
        
        // Trigger global event or reload navbar if required
        window.dispatchEvent(new Event('customer-login'));

        // Delay slightly for visual feedback
        setTimeout(() => {
          setShowLoginModal(false);
          addToCart();
        }, 1200);
      } else {
        setAuthError(data.error || 'Invalid secure code.');
      }
    } catch (err) {
      setAuthError('Verification system failure. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* Sourcing Order Now trigger with Quantity Selector */}
      <div className="flex items-center gap-3 w-full">
        {/* Quantity selector */}
        <div className="flex items-center border border-[#1B3527]/20 rounded-xl bg-[#FAF8F5] overflow-hidden h-[52px] shrink-0">
          <button
            type="button"
            onClick={() => handleQuantityChange(-1)}
            className="px-4 h-full hover:bg-[#1B3527]/5 text-[#1B3527] font-bold text-sm transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-[#1B3527]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(1)}
            className="px-4 h-full hover:bg-[#1B3527]/5 text-[#1B3527] font-bold text-sm transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          onClick={isInCart ? () => router.push('/cart') : handleOrderClick}
          disabled={checkingAuth}
          className="flex-1 bg-[#C5A880] hover:bg-[#1B3527] text-[#1B3527] hover:text-[#C5A880] font-bold text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-md transition-all duration-300 active:scale-[0.97] cursor-pointer border border-[#C5A880]"
        >
          {checkingAuth ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : isInCart ? (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>

      {/* Auth OTP popup modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-[#122B25]/45 backdrop-blur-md"
            />

            {/* Modal layout */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-[#FAF8F5] border border-[#1B3527]/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 z-10 text-[#1B3527]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-[#8A968E] hover:text-[#1B3527] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Section */}
              <div className="text-center mb-6">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#C5A880] flex items-center justify-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" /> Authenticity Check
                </span>
                <h3 className="font-serif text-xl font-bold">Secure Sourcing Access</h3>
                <p className="text-[10px] text-[#4E6254] font-light leading-normal max-w-[280px] mx-auto mt-1">
                  Provide your mobile coordinates to register or authenticate and finalize this purchase.
                </p>
              </div>

              {/* Messaging */}
              {authError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-500/10 text-red-800 text-[10px] font-light text-center">
                  {authError}
                </div>
              )}
              {authSuccess && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-500/10 text-emerald-800 text-[10px] font-medium text-center">
                  {authSuccess}
                </div>
              )}

              {/* Form step 1: Phone */}
              {authStep === 'phone' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="modal-phone" className="text-[9px] uppercase font-bold tracking-widest text-[#C5A880]">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="modal-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 9988776655"
                        disabled={actionLoading}
                        className="w-full bg-[#F1EDE6]/30 text-sm px-4 py-3 pl-10 rounded-xl border border-[#1B3527]/15 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                        required
                      />
                      <Phone className="w-4 h-4 text-[#8A968E] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-[0.97]"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Request Secure Code</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Form step 2: OTP */}
              {authStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Simulation Helper */}
                  {generatedOtp && (
                    <div className="p-3 mb-2 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/30 text-[10px] text-center leading-normal">
                      <span className="font-bold text-[#1B3527] block">Simulated OTP Delivery:</span>
                      Use verification code: <strong className="font-mono text-[#C5A880] text-xs font-black tracking-widest">{generatedOtp}</strong>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="modal-otp" className="text-[9px] uppercase font-bold tracking-widest text-[#C5A880]">
                      Verification Code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="modal-otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code..."
                        disabled={actionLoading}
                        maxLength={6}
                        className="w-full bg-[#F1EDE6]/30 text-center font-mono text-sm tracking-widest px-4 py-3 pl-10 rounded-xl border border-[#1B3527]/15 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                        required
                      />
                      <Lock className="w-4 h-4 text-[#8A968E] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-[0.97]"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Verify Secure Code</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthStep('phone'); setOtp(''); }}
                    className="w-full bg-transparent hover:bg-[#1B3527]/5 text-[#1B3527] font-semibold text-[10px] uppercase tracking-wider py-2 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Back to Mobile Coordinates
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
