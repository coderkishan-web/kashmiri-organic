'use client';

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, CreditCard, Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  orderId: string;
  totalAmount: number;
}

export default function StripePaymentForm({ orderId, totalAmount }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/success?order=${orderId}`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message ?? 'An error occurred during payment processing.');
    } else {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-[#1B3527]/8 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#1B3527]/8 pb-4 mb-4">
          <CreditCard className="w-5 h-5 text-[#C5A880]" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#C5A880]">
            Secure Card Payment
          </span>
        </div>

        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-center font-medium">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-[#1B3527] hover:bg-[#C5A880] text-[#FAF8F5] hover:text-[#1B3527] font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Secure Payment...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Pay ₹{totalAmount.toLocaleString('en-IN')} Now
            </>
          )}
        </button>

        <p className="text-[10px] text-[#8A968E] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
          Payments are secured and encrypted via Stripe.
        </p>
      </div>
    </form>
  );
}
