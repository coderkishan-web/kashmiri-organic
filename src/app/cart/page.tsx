'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Plus, Minus, ShoppingBag, Loader2, CheckCircle, 
  ArrowRight, ShieldCheck, ArrowLeft, RefreshCw, ShoppingCart 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  
  // Cart & Session states
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Checkout process states
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'success'>('cart');
  const [orderId, setOrderId] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // 1. Load cart and verify session on mount
  useEffect(() => {
    // Load Cart
    try {
      const saved = localStorage.getItem('kashmiri_organic_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart items from local storage', e);
    }

    // Verify Session
    fetch('/api/customer/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error('Failed checking authentication', err))
      .finally(() => setLoading(false));
  }, []);

  // Update localStorage when cart changes
  const saveCart = (items: any[]) => {
    setCartItems(items);
    localStorage.setItem('kashmiri_organic_cart', JSON.stringify(items));
  };

  // Adjust Quantity
  const handleQuantityChange = (id: number, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    saveCart(updated);
  };

  // Remove Item
  const handleRemoveItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  // Clear Cart
  const handleClearCart = () => {
    saveCart([]);
  };

  // Calculate Totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const estShipping = subtotal > 0 ? 350 : 0; // Flat packaging / transport fee
  const total = subtotal + estShipping;

  // Handle Checkout Sourcing Order
  const handleCheckout = async () => {
    if (!user) {
      // If session expired, redirect to login page
      router.push('/account/login?redirect=/cart');
      return;
    }

    setPlacingOrder(true);
    
    // Build order summary message
    const itemsSummary = cartItems
      .map((item) => `- ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');
    
    const message = `Order checkout coordinates summary:\n${itemsSummary}\n\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\nPackaging/Dispatch: ₹${estShipping.toLocaleString('en-IN')}\nTotal Sourcing Cost: ₹${total.toLocaleString('en-IN')}`;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name || `Client ${user.phone}`,
          email: user.email || 'customer@kashmiriorganic.com',
          phone: user.phone,
          companyName: 'Direct Checkout',
          inquiryType: 'order',
          message,
          productId: cartItems[0]?.id || null, // Primary item ID
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const generatedId = `KO-ORD-2026-${Math.floor(100 + Math.random() * 900)}`;
        setOrderId(generatedId);
        setCheckoutStep('success');
        // Clear cart
        saveCart([]);
      } else {
        alert(data.error || 'Failed to submit order.');
      }
    } catch (err) {
      alert('Communication error placing order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B3527] flex items-center justify-center text-[#FAF8F5] gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#C5A880]" />
        <span className="font-light text-xs uppercase tracking-widest text-[#FAF8F5]/70">
          Loading Sourcing Coordinates...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B3527] pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#1B3527]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] rounded-full bg-[#C5A880]/4 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <AnimatePresence mode="wait">
          {checkoutStep === 'cart' ? (
            <motion.div
              key="cart-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Cart items */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1B3527]/10 pb-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#C5A880] flex items-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5" /> Client Order Queue
                    </span>
                    <h1 className="font-serif text-3xl font-bold tracking-tight mt-0.5">Sourcing Cart</h1>
                  </div>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-[10px] uppercase font-bold text-red-700 hover:text-red-900 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                    </button>
                  )}
                </div>

                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#1B3527]/5 hover:border-[#C5A880]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 shadow-sm"
                      >
                        {/* Left side: Item image and name */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F1EDE6] border border-[#1B3527]/10 shrink-0">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-serif text-sm font-bold leading-tight">
                              <Link href={`/products/${item.slug}`} className="hover:text-[#C5A880] transition-colors">
                                {item.name}
                              </Link>
                            </h3>
                            <span className="text-[9px] text-[#C5A880] font-bold uppercase tracking-wider block mt-1">
                              GI Certified Sourcing
                            </span>
                          </div>
                        </div>

                        {/* Right side: Quantity control, price, and delete */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#1B3527]/5 pt-3 sm:pt-0">
                          {/* Quantity selector */}
                          <div className="flex items-center bg-[#F1EDE6]/50 border border-[#1B3527]/10 rounded-lg p-1">
                            <button
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-[#1B3527] hover:text-[#C5A880] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#1B3527] hover:text-[#C5A880] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Item Total Price */}
                          <div className="text-right min-w-[80px]">
                            <span className="font-serif text-sm font-bold">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[8px] text-[#8A968E] font-light">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </span>
                          </div>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-[#8A968E] hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-[#1B3527]/10 rounded-3xl p-12 text-center py-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center border border-[#1B3527]/5 shadow-inner">
                      <ShoppingBag className="w-7 h-7 text-[#C5A880]" />
                    </div>
                    <h3 className="font-serif text-xl font-bold">Your cart is empty</h3>
                    <p className="text-xs text-[#8A968E] max-w-xs leading-relaxed font-light">
                      It seems you haven't added any premium Kashmiri products yet. Browse our catalog and start sourcing.
                    </p>
                    <Link
                      href="/products"
                      className="mt-2 bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                )}
                
                {/* Back button */}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:text-[#C5A880] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Continue Sourcing
                </Link>
              </div>

              {/* Right Column: Checkout Breakdown */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-[#1B3527]/10 rounded-3xl p-6 shadow-md flex flex-col gap-6 sticky top-28">
                  <div>
                    <h3 className="font-serif text-lg font-bold">Sourcing Summary</h3>
                    <div className="w-full h-px bg-[#1B3527]/5 my-3" />
                  </div>

                  <div className="space-y-3.5 text-xs font-light">
                    <div className="flex justify-between">
                      <span className="text-[#8A968E]">Items Subtotal</span>
                      <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8A968E]">Packaging & Dispatch</span>
                      <span className="font-medium">₹{estShipping.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-px bg-[#1B3527]/5 my-1" />
                    <div className="flex justify-between text-sm">
                      <span className="font-serif font-bold">Total Sourcing Cost</span>
                      <span className="font-serif font-black text-[#1B3527]">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || placingOrder}
                    className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Sourcing...</span>
                      </>
                    ) : !user ? (
                      <>
                        <span>Login to Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Submit Sourcing Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Extra Coordinates Box */}
                  <div className="bg-[#FAF8F5] border border-[#1B3527]/5 rounded-2xl p-4 space-y-2.5">
                    <span className="text-[8px] uppercase font-bold tracking-widest text-[#C5A880] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" /> Sourcing Protocols
                    </span>
                    <p className="text-[10px] text-[#4E6254] leading-normal font-light">
                      {user ? (
                        <>
                          Authorized for account: <strong className="font-semibold">{user.phone}</strong>. Sourcing orders are mapped to client accounts for fulfillment tracking.
                        </>
                      ) : (
                        <>
                          Please login using your mobile OTP coordinates to complete this order.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-step"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md mx-auto bg-white border border-[#1B3527]/10 rounded-3xl p-8 text-center shadow-xl space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-500/10 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#C5A880]">
                  Order Placed Successfully
                </span>
                <h2 className="font-serif text-2xl font-bold">Thank You For Sourcing</h2>
                <p className="text-xs text-[#8A968E] max-w-xs mx-auto leading-relaxed font-light">
                  Your batch allocation has been completed. The Sourcing logistics desk will update your tracking status within 6 hours.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#1B3527]/5 rounded-2xl p-4 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1B3527]/5">
                  <span className="text-[#8A968E]">Order Coordinates:</span>
                  <span className="font-mono font-bold text-[#1B3527]">{orderId}</span>
                </div>
                <div className="flex justify-between py-1 pt-2">
                  <span className="text-[#8A968E]">Client Phone:</span>
                  <span className="font-medium text-[#1B3527]">{user?.phone}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/account"
                  className="bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl block transition-all shadow cursor-pointer text-center"
                >
                  View Order Status (My Account)
                </Link>
                <Link
                  href="/products"
                  className="bg-transparent hover:bg-[#1B3527]/5 border border-[#1B3527]/15 text-[#1B3527] font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl block transition-all cursor-pointer text-center"
                >
                  Return to Sourcing Archives
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
