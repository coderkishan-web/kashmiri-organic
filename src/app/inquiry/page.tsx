import React from 'react';
import Link from 'next/link';
import { executeQuery, Product } from '@/lib/db';
import { Mail, MessageSquare, Phone, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface InquiryPageProps {
  searchParams: Promise<{
    product_id?: string;
    inquiry_type?: string;
    message?: string;
    submitted?: string;
  }>;
}

export default async function InquiryPage({ searchParams }: InquiryPageProps) {
  // Await search params for Next.js 15+/16 compatibility
  const params = await searchParams;
  const preSelectedProductId = params.product_id ? Number(params.product_id) : null;
  const preSelectedInquiryType = params.inquiry_type || 'quote';
  const preSelectedMessage = params.message || '';
  const isSubmitted = params.submitted === 'true';

  // Fetch products list for the dynamic dropdown
  const products = await executeQuery<Product[]>('SELECT * FROM products');

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-[70vh] items-center justify-center bg-bg-mist px-4">
        <div className="bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 max-w-xl text-center luxury-shadow flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-brand-gold/15 text-brand-gold rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-brand-green">Inquiry Received</h1>
          <div className="w-12 h-0.5 bg-brand-gold mx-auto"></div>
          
          <p className="text-sm text-text-secondary leading-relaxed font-light">
            Thank you for contacting Kashmiri Organic. Your corporate sourcing specifications have been safely logged into our valley database. A B2B export manager will review your crop requirements and email a complete commercial schedule within 12 hours.
          </p>
          
          <div className="bg-bg-mist p-4 rounded-xl border border-brand-green/5 text-xs text-text-muted text-left w-full">
            <h5 className="font-bold text-brand-green mb-1">What happens next?</h5>
            <ol className="list-decimal pl-4 space-y-1 font-light">
              <li>Automatic dispatch receipt sent to your corporate email.</li>
              <li>Verification of raw stock parameters (e.g. Saffron crocin level audits).</li>
              <li>Phytosanitary and logistics customs quote generated.</li>
            </ol>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              href="/products"
              className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
            >
              Continue Discovery
            </Link>
            <Link
              href="/"
              className="border border-brand-green text-brand-green hover:bg-bg-beige/40 text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Inquire</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            B2B / Wholesale Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream mb-4">
            Organic Sourcing & Quote Request
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            Please outline your crop requirements or woodworking commissions below. Our trade office compiles certified logistics quotations for global air cargo.
          </p>
        </div>
      </section>

      {/* 2. Main Sourcing Form Layout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Box (Left) */}
          <div className="lg:col-span-8 bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 luxury-shadow">
            <h2 className="font-serif text-2xl font-bold text-brand-green mb-6">Sourcing Specifications</h2>
            
            <form action="/api/inquiries" method="POST" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input type="hidden" name="redirect" value="/inquiry" />
              
              {/* Contact Agent */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Your Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Full name..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Corporate Email */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Corporate Email *</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="purchasing@company.com..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+1 555-0199..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Company Registered Name</label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Wellness distribution house..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              {/* Inquiry Type */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Inquiry Sourcing Style *</label>
                <select
                  name="inquiry_type"
                  defaultValue={preSelectedInquiryType}
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                >
                  <option value="quote">Request Bulk Quote</option>
                  <option value="bulk">Seasonal Harvest Sourcing Contract</option>
                  <option value="whatsapp">OEM Wooden Box Branding</option>
                  <option value="contact">General Agricultural inquiry</option>
                </select>
              </div>

              {/* Product Target Dropdown */}
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Target Organic product</label>
                <select
                  name="product_id"
                  defaultValue={preSelectedProductId || ''}
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-text-primary"
                >
                  <option value="">General Valley Sourcing (No specific product)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col sm:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Sourcing Message / Target Volume Specifications *</label>
                <textarea
                  required
                  name="message"
                  rows={6}
                  defaultValue={preSelectedMessage}
                  placeholder="Outline your target shipment volumes, packing requests, country ports, and certification compliance requirements..."
                  className="bg-bg-beige/30 text-xs p-4 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold resize-none text-text-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-colors"
              >
                Submit Sourcing Specifications
              </button>
            </form>
          </div>

          {/* Sourcing Side Assistance (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Quick Sourcing assistance */}
            <div className="bg-bg-cream rounded-3xl p-8 border border-brand-green/10 luxury-shadow flex flex-col gap-5">
              <h3 className="font-serif text-lg font-bold text-brand-green">Sourcing Support</h3>
              <div className="w-8 h-0.5 bg-brand-gold"></div>

              <div className="flex flex-col gap-4 text-xs font-light">
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <span>ISO Saffron Parameter Sheets dispatched for QA approval.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <span>Phytosanitary customs clearance handles by our export desk.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                  <span>Ambient-sealed and heavy-ply air pallet packing formats.</span>
                </div>
              </div>
            </div>

            {/* Direct Contact desk */}
            <div className="bg-brand-green text-bg-cream rounded-3xl p-8 border border-brand-gold/15 luxury-shadow flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold text-brand-gold">Direct Sourcing Line</h3>
              
              <div className="grid gap-3 pt-2 text-xs">
                <a href="tel:+919876543210" className="flex items-center gap-2 text-bg-cream hover:text-brand-gold transition-colors">
                  <Phone className="w-4 h-4 text-brand-gold" /> +91 98765 43210
                </a>
                <a href="mailto:exports@kashmiriorganic.com" className="flex items-center gap-2 text-bg-cream hover:text-brand-gold transition-colors">
                  <Mail className="w-4 h-4 text-brand-gold" /> exports@kashmiriorganic.com
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-bg-cream hover:text-brand-gold transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500 fill-current" /> WhatsApp Sourcing
                </a>
              </div>
            </div>

            {/* GI Tag Seal */}
            <div className="bg-bg-cream rounded-3xl p-6 border border-brand-green/5 luxury-shadow flex gap-3 items-center">
              <ShieldCheck className="w-10 h-10 text-brand-gold shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-green leading-snug">Geographical Origin Certified</h4>
                <p className="text-[10px] text-text-secondary leading-normal font-light mt-0.5">
                  100% of our Mongra saffron crocus flowers are harvested solely inside J&K.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
