'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, Mail, Award, Clock, ShoppingBag, LogOut, Loader2, 
  CheckCircle, Edit3, ShieldCheck, MapPin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerAccountPage() {
  const router = useRouter();
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Action status
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Real orders state
  const [orders, setOrders] = useState<any[]>([]);

  // 1. Authenticate customer and load profile details on load
  useEffect(() => {
    fetch('/api/customer/profile')
      .then((res) => {
        if (!res.ok) {
          router.push('/account/login');
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.success) {
          setUser(data.user);
          setName(data.user.name || '');
          setEmail(data.user.email || '');

          // Fetch real orders
          if (data.user.phone) {
            fetch(`/api/customer/orders/list?phone=${data.user.phone}`)
              .then((res) => res.json())
              .then((orderData) => {
                if (orderData.orders) {
                  setOrders(orderData.orders);
                }
              })
              .catch(err => console.error('Failed fetching orders', err));
          }
        } else {
          router.push('/account/login');
        }
      })
      .catch(() => {
        router.push('/account/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  // 2. Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setActionLoading(true);

    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setIsEditing(false);
        setSuccess('Profile coordinates updated successfully.');
      } else {
        setError(data.error || 'Failed to update profile details.');
      }
    } catch (err) {
      setError('Communication error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    await fetch('/api/customer/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const parseItems = (itemsStr: string) => {
    try {
      const items = JSON.parse(itemsStr);
      return items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ');
    } catch {
      return 'Order Items';
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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        <div className="col-span-12 border-b border-[#1B3527]/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" /> Sourcing Client Account
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B3527] tracking-tight mt-1">
              Welcome Back, {user?.name || 'Valued Client'}
            </h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-950/5 hover:bg-red-950/10 text-red-900 border border-red-900/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-95 w-fit"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1B3527] text-[#FAF8F5] p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-4 translate-y-4">
              <User className="w-48 h-48" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#C5A880] text-[#1B3527] flex items-center justify-center font-serif text-xl font-bold shadow-md">
                {(user?.name?.[0] || 'C').toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#FAF8F5] leading-tight">
                  {user?.name || 'Profile Incomplete'}
                </h3>
                <span className="text-[9px] uppercase font-bold text-[#C5A880] tracking-widest block mt-0.5">
                  Verified customer
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-[#FAF8F5]/10 my-4" />

            <div className="space-y-4 text-xs font-light">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <div>
                  <span className="text-[#FAF8F5]/40 block text-[9px] uppercase font-bold tracking-wider">Mobile Number</span>
                  <span className="font-medium text-[#FAF8F5]">{user?.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A880]" />
                <div>
                  <span className="text-[#FAF8F5]/40 block text-[9px] uppercase font-bold tracking-wider">Email Coordinates</span>
                  <span className="font-medium text-[#FAF8F5]">{user?.email || 'Not Configured'}</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#C5A880] hover:bg-[#C5A880]/90 text-[#1B3527] font-bold text-xs uppercase tracking-wider py-3 rounded-xl mt-6 flex items-center justify-center gap-1.5 cursor-pointer shadow transition-all active:scale-[0.97]"
              >
                <Edit3 className="w-3.5 h-3.5" /> Modify Coordinates
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-500/10 text-red-800 text-xs font-light">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-500/10 text-emerald-800 text-xs font-light">
              {success}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FAF8F5] border border-[#1B3527]/10 rounded-3xl p-6 sm:p-8"
              >
                <h3 className="font-serif text-xl font-bold text-[#1B3527] mb-6">Update Profile Coordinates</h3>
                
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="edit-name" className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#FAF8F5] text-[#1B3527] text-sm px-4 py-3 rounded-xl border border-[#1B3527]/15 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                        disabled={actionLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="edit-email" className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="edit-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#FAF8F5] text-[#1B3527] text-sm px-4 py-3 rounded-xl border border-[#1B3527]/15 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                        disabled={actionLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#1B3527]/5">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-[#1B3527] hover:bg-[#1B3527]/90 text-[#FAF8F5] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-[0.98]"
                    >
                      {actionLoading ? <span>Updating...</span> : <span>Save Coordinates</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setName(user?.name || ''); setEmail(user?.email || ''); }}
                      className="bg-transparent hover:bg-[#1B3527]/5 text-[#1B3527] font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-xl border border-[#1B3527]/15 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="bg-[#FAF8F5] border border-[#1B3527]/10 rounded-3xl p-6 sm:p-8 flex flex-col h-full max-h-[600px]">
            <div className="flex items-center gap-2 mb-6 shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
              <h3 className="font-serif text-xl font-bold text-[#1B3527]">Sourcing Order History</h3>
            </div>

            {/* Scrollable container, hide scrollbar. 
                Height of one order item is roughly ~120px. 
                4 orders = ~480px + gap. We'll set a max-height that roughly fits 4 orders. */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {orders.map((ord) => (
                <div 
                  key={ord.id}
                  className="bg-white border border-[#1B3527]/5 hover:border-[#C5A880]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 shadow-sm"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-sm text-[#1B3527]">{ord.id}</span>
                      <span className="text-[10px] bg-[#FAF8F5] border border-[#1B3527]/10 px-2 py-0.5 rounded-full text-[#1B3527]/60 font-semibold uppercase">
                        {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#1B3527]/80 font-medium line-clamp-2">
                      {parseItems(ord.items)}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-[#1B3527]/50 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{(() => {
                        try {
                          return JSON.parse(ord.shipping_address).city;
                        } catch {
                          return 'Destination address provided';
                        }
                      })()}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-[#1B3527]/5 pt-3 sm:pt-0 shrink-0">
                    <span className="font-serif text-[#1B3527] font-bold text-sm">₹{ord.total_amount?.toLocaleString('en-IN') || '0'}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      ord.status === 'delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : ord.status === 'shipped' || ord.status === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-[#C5A880]/20 text-[#1B3527]'
                    }`}>
                      {ord.status === 'delivered' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <Clock className="w-3 h-3 text-inherit" />
                      )}
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12 text-[#1B3527]/40 flex flex-col items-center gap-2">
                  <ShoppingBag className="w-8 h-8 text-[#C5A880]/40" />
                  <p className="text-xs">No active sourcing orders have been registered on your account coordinates yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
