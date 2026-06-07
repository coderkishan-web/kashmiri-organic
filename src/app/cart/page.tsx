'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Plus, Minus, ShoppingBag, Loader2, CheckCircle, 
  ArrowRight, ShieldCheck, ArrowLeft, ShoppingCart, MapPin, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  
  // Cart & Session states
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Checkout process states
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [orderId, setOrderId] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Shipping Form State
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    address: '',
    pinCode: '',
    city: '',
    country: 'India'
  });

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
          setShippingDetails(prev => ({ 
            ...prev, 
            name: data.user.name || '',
            email: data.user.email || '',
            address: data.user.address || prev.address,
            city: data.user.city || prev.city,
            pinCode: data.user.pinCode || prev.pinCode,
            country: data.user.country || prev.country
          }));
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

  const handleClearCart = () => {
    saveCart([]);
  };

  // Calculate Totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const estShipping = subtotal > 0 ? 350 : 0; // Flat packaging / transport fee
  const total = subtotal + estShipping;

  const proceedToShipping = () => {
    if (!user) {
      router.push('/account/login?redirect=/cart');
      return;
    }
    setCheckoutStep('shipping');
  };

  const proceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    
    // Simulate payment gateway delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total_amount: total,
          shipping_address: shippingDetails,
          payment_method: 'Credit Card / UPI',
          user: user
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderId(data.order.id);
        setCheckoutStep('success');
        saveCart([]); // Clear cart
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
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#1B3527]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[45vw] h-[45vw] rounded-full bg-[#C5A880]/4 blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CART */}
          {checkoutStep === 'cart' && (
            <motion.div
              key="cart-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
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
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F1EDE6] border border-[#1B3527]/10 shrink-0">
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
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

                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#1B3527]/5 pt-3 sm:pt-0">
                          <div className="flex items-center bg-[#F1EDE6]/50 border border-[#1B3527]/10 rounded-lg p-1">
                            <button onClick={() => handleQuantityChange(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-[#1B3527] hover:text-[#C5A880] cursor-pointer">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-[#1B3527] hover:text-[#C5A880] cursor-pointer">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <span className="font-serif text-sm font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-[#8A968E] hover:text-red-700 cursor-pointer">
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
                    <Link href="/products" className="mt-2 bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300">
                      Browse Catalog
                    </Link>
                  </div>
                )}
              </div>

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
                      <span className="font-serif font-black text-[#1B3527]">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button
                    onClick={proceedToShipping}
                    disabled={cartItems.length === 0}
                    className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!user ? <span>Login to Checkout</span> : <span>Proceed to Shipping</span>}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SHIPPING DETAILS */}
          {checkoutStep === 'shipping' && (
            <motion.div
              key="shipping-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <button 
                onClick={() => setCheckoutStep('cart')}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8A968E] hover:text-[#C5A880] mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Cart
              </button>

              <div className="bg-white border border-[#1B3527]/10 rounded-3xl p-8 shadow-md">
                <div className="flex items-center gap-3 border-b border-[#1B3527]/10 pb-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#F1EDE6] flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C5A880]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold">Shipping Coordinates</h2>
                    <span className="text-[10px] text-[#8A968E] uppercase tracking-widest">Where should we deliver?</span>
                  </div>
                </div>

                <form onSubmit={proceedToPayment} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#1B3527] mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#FAF8F5] border border-[#1B3527]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                      value={shippingDetails.name}
                      onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})}
                      placeholder="Recipient's Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#1B3527] mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-[#FAF8F5] border border-[#1B3527]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                      value={shippingDetails.email}
                      onChange={(e) => setShippingDetails({...shippingDetails, email: e.target.value})}
                      placeholder="Email for order updates"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-[#1B3527] mb-1.5 uppercase tracking-wider">Street Address</label>
                    <textarea
                      required
                      className="w-full bg-[#FAF8F5] border border-[#1B3527]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors min-h-[100px]"
                      value={shippingDetails.address}
                      onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                      placeholder="House No, Building, Street Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#1B3527] mb-1.5 uppercase tracking-wider">Pin Code</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-[#FAF8F5] border border-[#1B3527]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                        value={shippingDetails.pinCode}
                        onChange={(e) => setShippingDetails({...shippingDetails, pinCode: e.target.value})}
                        placeholder="Postal Code"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B3527] mb-1.5 uppercase tracking-wider">City</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-[#FAF8F5] border border-[#1B3527]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                        value={shippingDetails.city}
                        onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                        placeholder="City / District"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1B3527] mb-1.5 uppercase tracking-wider">Country</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-[#FAF8F5] border border-[#1B3527]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                      value={shippingDetails.country}
                      onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#1B3527]/10">
                    <button
                      type="submit"
                      className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.97]"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 3: MOCK PAYMENT */}
          {checkoutStep === 'payment' && (
            <motion.div
              key="payment-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-md mx-auto bg-white border border-[#1B3527]/10 rounded-3xl p-8 shadow-xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-[#F1EDE6] flex items-center justify-center mx-auto mb-4 border border-[#1B3527]/5">
                  <CreditCard className="w-8 h-8 text-[#C5A880]" />
                </div>
                <h2 className="font-serif text-2xl font-bold">Secure Payment</h2>
                <p className="text-xs text-[#8A968E] mt-1">Total to pay: <span className="font-bold text-[#1B3527]">₹{total.toLocaleString('en-IN')}</span></p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#1B3527]/5 rounded-2xl p-4 mb-6">
                <p className="text-[10px] text-center text-[#4E6254] mb-4">
                  For demonstration purposes, this is a simulated payment gateway. Clicking "Pay Now" will mock a successful transaction.
                </p>
                
                <div className="space-y-3">
                  <div className="h-10 bg-white border border-[#1B3527]/10 rounded-lg flex items-center px-4 text-xs font-mono text-[#8A968E]">
                    **** **** **** 4242
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-white border border-[#1B3527]/10 rounded-lg flex items-center px-4 text-xs font-mono text-[#8A968E]">MM / YY</div>
                    <div className="h-10 bg-white border border-[#1B3527]/10 rounded-lg flex items-center px-4 text-xs font-mono text-[#8A968E]">CVC</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {placingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay ₹{total.toLocaleString('en-IN')} Now</span>
                )}
              </button>

              <button 
                onClick={() => setCheckoutStep('shipping')}
                className="w-full mt-4 text-xs font-bold uppercase tracking-wider text-[#8A968E] hover:text-[#1B3527] transition-colors"
                disabled={placingOrder}
              >
                Cancel & Go Back
              </button>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {checkoutStep === 'success' && (
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
                  Payment Successful
                </span>
                <h2 className="font-serif text-2xl font-bold">Thank You For Your Order</h2>
                <p className="text-xs text-[#8A968E] max-w-xs mx-auto leading-relaxed font-light">
                  A confirmation SMS and email have been sent to your registered coordinates.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#1B3527]/5 rounded-2xl p-4 text-xs text-left">
                <div className="flex justify-between py-1.5 border-b border-[#1B3527]/5">
                  <span className="text-[#8A968E]">Order ID:</span>
                  <span className="font-mono font-bold text-[#1B3527]">{orderId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1B3527]/5">
                  <span className="text-[#8A968E]">Client:</span>
                  <span className="font-medium text-[#1B3527]">{shippingDetails.name}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8A968E]">Total Paid:</span>
                  <span className="font-bold text-[#1B3527]">₹{total.toLocaleString('en-IN')}</span>
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
                  Return to Store
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
