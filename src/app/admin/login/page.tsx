'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in via simple fetch
  useEffect(() => {
    fetch('/api/admin/me')
      .then(res => {
        if (res.ok) {
          router.push('/admin');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication rejected.');
      }

      // Successful login
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Connection timeout. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center px-4 py-12 relative">
      {/* Heavy forest green dark overlay */}
      <div className="absolute inset-0 bg-brand-green/95 z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-bg-cream/5 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-brand-gold/20 shadow-2xl flex flex-col gap-6 text-bg-cream">
        
        {/* Brand Logo Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-brand-gold rounded-full flex items-center justify-center text-brand-green font-bold text-xl shadow-lg">
            KO
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold mt-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Administrative Gate
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bg-cream leading-tight">
            Valley Archives Login
          </h2>
        </div>

        {/* Error Alert panel */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/30 text-red-200 text-xs px-4 py-3 rounded-xl flex gap-2.5 items-start">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-gold mb-1.5 pl-1">Admin Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kashmiri.organic"
              className="bg-bg-cream/10 text-xs text-bg-cream placeholder-bg-cream/40 px-4 py-3.5 rounded-xl border border-bg-cream/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold tracking-wider text-brand-gold mb-1.5 pl-1">Secret Keyphrase</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="bg-bg-cream/10 text-xs text-bg-cream placeholder-bg-cream/40 px-4 py-3.5 rounded-xl border border-bg-cream/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl shadow-md transition-transform duration-200 active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Seals...
              </>
            ) : (
              <>
                Access Archives <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Educational Note */}
        <div className="border-t border-bg-beige/10 pt-4 mt-2 text-[10px] text-bg-cream/50 leading-relaxed font-light text-center">
          <p>
            Default developer credentials: <br />
            <strong className="text-brand-gold font-semibold">admin@kashmiri.organic</strong> / <strong className="text-brand-gold font-semibold">kashmiri@organic2026</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
