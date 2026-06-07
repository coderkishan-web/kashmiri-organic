'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Mail, ArrowRight, Loader2, Sparkles, ChevronLeft, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerLoginPage() {
  const router = useRouter();
  
  // App flow states
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Simulated OTP preview for local testing
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [timer, setTimer] = useState(0);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setError('Please enter a valid mobile number or email address.');
      return;
    }

    const isEmail = cleanInput.includes('@');
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanInput)) {
        setError('Please enter a valid email address.');
        return;
      }
    } else {
      const phoneDigits = cleanInput.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('/api/customer/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanInput }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep('otp');
        setSuccess('Verification token generated.');
        if (data.otp) {
          setSimulatedOtp(data.otp);
        }
        setTimer(60); // 60 seconds resend cooldown
      } else {
        setError(data.error || 'Failed to request OTP code.');
      }
    } catch (err) {
      setError('Network communication failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const cleanInput = identifier.trim();
      const res = await fetch('/api/customer/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanInput, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Access granted. Authenticated.');
        // Brief delay for nice UI flow
        setTimeout(() => {
          router.push('/account');
        }, 800);
      } else {
        setError(data.error || 'Invalid verification token.');
      }
    } catch (err) {
      setError('Verification connection failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B3527] relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background ambient gold/green gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[#C5A880]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#FAF8F5]/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo brand representation */}
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-full bg-[#C5A880] text-[#1B3527] flex items-center justify-center font-serif text-2xl font-bold shadow-xl mb-4"
          >
            KO
          </motion.div>
          <h1 className="font-serif text-3xl font-bold text-[#FAF8F5] tracking-tight">Kashmiri Organic</h1>
          <p className="text-xs uppercase font-bold text-[#C5A880] tracking-[0.25em] mt-1.5">Customer Sourcing desk</p>
        </div>

        {/* Main Card with Glassmorphism */}
        <div className="bg-[#FAF8F5]/5 border border-[#FAF8F5]/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-60" />

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-950/45 border border-red-500/20 text-red-200 text-xs flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <p className="font-light">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-emerald-950/45 border border-emerald-500/20 text-emerald-200 text-xs flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <p className="font-light">{success}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-[#FAF8F5]">Sign In / Register</h2>
                  <p className="text-xs text-[#FAF8F5]/60 font-light mt-1">
                    Enter your mobile number or email address to receive a secure one-time verification password.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="identifier" className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                      Mobile Number or Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="identifier"
                        placeholder="e.g. name@domain.com or 9876543210"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-[#FAF8F5]/5 text-[#FAF8F5] text-sm placeholder-[#FAF8F5]/30 pl-11 pr-4 py-3.5 rounded-xl border border-[#FAF8F5]/10 focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/15 transition-all duration-300 font-sans"
                        disabled={loading}
                        required
                        autoFocus
                      />
                      {identifier.includes('@') ? (
                        <Mail className="w-4 h-4 text-[#C5A880] absolute left-4 top-1/2 -translate-y-1/2" />
                      ) : (
                        <Phone className="w-4 h-4 text-[#C5A880] absolute left-4 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C5A880] hover:bg-[#C5A880]/90 text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Token...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#FAF8F5]">Verify Account</h2>
                    <p className="text-xs text-[#FAF8F5]/60 font-light mt-1">
                      Verification code transmitted to <strong className="text-[#C5A880]">{identifier}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => { setStep('phone'); setOtp(''); setSimulatedOtp(''); setError(''); }}
                    className="text-[10px] uppercase font-bold text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer py-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {simulatedOtp && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 text-[#C5A880] text-center"
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest block opacity-70">
                      Valley Simulator Code
                    </span>
                    <span 
                      onClick={() => {
                        setOtp(simulatedOtp);
                        setSuccess('OTP Autofilled!');
                      }}
                      className="font-serif text-2xl font-bold block mt-1 tracking-[0.25em] cursor-pointer hover:scale-105 transition-transform"
                      title="Click to autofill"
                    >
                      {simulatedOtp}
                    </span>
                    <span className="text-[9px] block opacity-50 mt-1">Click the code above to autofill</span>
                  </motion.div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="otp" className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#FAF8F5]/5 text-[#FAF8F5] text-lg tracking-[0.4em] text-center placeholder-[#FAF8F5]/30 py-3.5 rounded-xl border border-[#FAF8F5]/10 focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/15 transition-all duration-300 font-serif"
                      disabled={loading}
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C5A880] hover:bg-[#C5A880]/90 text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Account...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm Access</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Resend option */}
                <div className="mt-6 text-center text-xs">
                  {timer > 0 ? (
                    <span className="text-[#FAF8F5]/40 font-light">
                      Resend code in <strong className="text-[#C5A880]/80 font-medium">{timer}s</strong>
                    </span>
                  ) : (
                    <button
                      onClick={handleSendOtp}
                      className="text-[#C5A880] hover:underline font-semibold cursor-pointer"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back to public catalog link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-[#FAF8F5]/40 hover:text-[#FAF8F5] transition-colors flex items-center gap-1 mx-auto cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Return to Kashmir Valley Offerings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
