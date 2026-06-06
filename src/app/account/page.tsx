'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Phone, Mail, Award, Clock, ShoppingBag, LogOut, Loader2, 
  CheckCircle, Edit3, ArrowRight, ShieldCheck, Sparkles, MapPin 
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

  // Message parsing helpers
  const parseItems = (msg: string) => {
    if (!msg) return 'Direct Sourcing Order';
    const lines = msg.split('\n');
    const itemsLines = lines.filter(l => l.trim().startsWith('- '));
    if (itemsLines.length > 0) {
      return itemsLines.map(l => l.replace('- ', '').trim()).join(', ');
    }
    return 'Direct Sourcing Order';
  };

  const parseTotal = (msg: string) => {
    if (!msg) return 'Custom Quote';
    const lines = msg.split('\n');
    const totalLine = lines.find(l => l.toLowerCase().includes('total sourcing cost'));
    if (totalLine) {
      return totalLine.split(':')?.[1]?.trim() || 'Custom Quote';
    }
    return 'Custom Quote';
  };

  const getFulfillmentOrigin = (prodId: any) => {
    if (prodId === 1 || prodId === '1') return 'Pampore Saffron Fields';
    if (prodId === 2 || prodId === '2') return 'Kupwara Acacia Forest';
    if (prodId === 3 || prodId === '3') return 'Gurez Valley Apiary';
    if (prodId === 4 || prodId === '4') return 'Srinagar Craft Hub';
    return 'Valley Archive Depot';
  };

  const mapStatus = (status: string) => {
    if (status === 'replied') return 'Delivered';
    if (status === 'reviewed') return 'In Transit';
    return 'Placed';
  };

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
          setOrders(data.orders || []);
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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Title Header */}
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

        {/* Left Side: Client profile card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#1B3527] text-[#FAF8F5] p-6 rounded-3xl shadow-xl relative overflow-hidden">
            {/* Background design */}
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

          <div className="bg-[#FAF8F5] border border-[#1B3527]/10 p-6 rounded-3xl flex flex-col gap-4">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880] flex items-center gap-1">
              <Award className="w-4 h-4 text-[#C5A880]" /> Quality Guarantee
            </h4>
            <p className="text-xs text-[#1B3527]/70 leading-relaxed font-light">
              Our products are GI-tagged and verified by the Srinagar Craft Development center. Thank you for supporting rural artisan cooperatives.
            </p>
          </div>
        </div>

        {/* Right Side: Tab panel and actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Notifications */}
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
                        placeholder="e.g. Aditi Sharma"
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
                        placeholder="e.g. client@example.com"
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
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Save Coordinates</span>
                      )}
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

          {/* Sourcing Orders grid */}
          <div className="bg-[#FAF8F5] border border-[#1B3527]/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="w-5 h-5 text-[#C5A880]" />
              <h3 className="font-serif text-xl font-bold text-[#1B3527]">Active Sourcing Orders</h3>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div 
                  key={ord.id}
                  className="bg-[#FAF8F5] border border-[#1B3527]/5 hover:border-[#C5A880]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 shadow-sm"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-sm text-[#1B3527]">KO-ORD-2026-{ord.id}</span>
                      <span className="text-[10px] bg-[#FAF8F5] border border-[#1B3527]/10 px-2 py-0.5 rounded-full text-[#1B3527]/60 font-semibold uppercase">
                        {new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-[#1B3527]/80 font-medium">{parseItems(ord.message)}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[#1B3527]/50 font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Fulfillment Depot: {getFulfillmentOrigin(ord.product_id)}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-[#1B3527]/5 pt-3 sm:pt-0">
                    <span className="font-serif text-[#1B3527] font-bold text-sm">{parseTotal(ord.message)}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      mapStatus(ord.status) === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : mapStatus(ord.status) === 'In Transit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-[#C5A880]/20 text-[#1B3527]'
                    }`}>
                      {mapStatus(ord.status) === 'Delivered' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-800" />
                      ) : (
                        <Clock className="w-3 h-3 text-inherit" />
                      )}
                      {mapStatus(ord.status)}
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
