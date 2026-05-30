import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageSquare, Clock, Globe, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-mist animate-in fade-in duration-500">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Contact</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream mb-4">
            Connect with our Sourcing Offices
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            Have questions about our custom OEM wood carvings, saffron certifications, or B2B export shipping dates? We are here to support you.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Layout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 luxury-shadow">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1 block">Quick inquiry</span>
              <h2 className="font-serif text-2xl font-bold text-brand-green">Send Us a Direct Message</h2>
              <p className="text-xs text-text-secondary font-light mt-1">
                Whether you are a retail customer or a global distributor, our support desk will respond within 12 hours.
              </p>
            </div>

            <form action="/api/inquiries" method="POST" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input type="hidden" name="inquiry_type" value="contact" />
              <input type="hidden" name="redirect" value="/contact?submitted=true" />
              
              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="Your full name..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="you@example.com..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="Include your country code..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Company Name (Optional)</label>
                <input
                  type="text"
                  name="company_name"
                  placeholder="Retail boutique, spa, distributor..."
                  className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="flex flex-col sm:col-span-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Your Message / Sourcing Needs</label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="How can we assist you? Please mention products of interest and target delivery schedules..."
                  className="bg-bg-beige/30 text-xs p-4 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Column: Contact Cards & Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Sourcing Offices Details */}
            <div className="bg-bg-cream rounded-3xl p-8 border border-brand-green/10 luxury-shadow flex flex-col gap-6">
              <h3 className="font-serif text-xl font-bold text-brand-green">Sourcing Coordinates</h3>
              <div className="w-8 h-0.5 bg-brand-gold"></div>

              <div className="flex flex-col gap-5 text-sm">
                
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-brand-green">Harvest Farm Office</h5>
                    <p className="text-xs text-text-secondary leading-relaxed font-light mt-0.5">
                      Pampore Organic Farms, Highway 1A, Pulwama, Jammu & Kashmir, 192121
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-brand-green">B2B Phone Desk</h5>
                    <a href="tel:+919876543210" className="text-xs text-text-secondary hover:text-brand-gold mt-0.5 block">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-brand-green">Corporate Sourcing Email</h5>
                    <a href="mailto:info@kashmiriorganic.com" className="text-xs text-text-secondary hover:text-brand-gold mt-0.5 block">
                      info@kashmiriorganic.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-brand-green">Operating Hours</h5>
                    <p className="text-xs text-text-secondary font-light mt-0.5">
                      Monday ~ Saturday: 09:30 AM to 06:00 PM (IST)
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Direct WhatsApp Call */}
            <div className="bg-emerald-600 text-bg-cream rounded-3xl p-6 border border-emerald-500/10 luxury-shadow flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-bg-cream fill-current" />
                <div>
                  <h4 className="font-serif text-lg font-bold">Instant Sourcing Chat</h4>
                  <span className="text-[10px] text-bg-cream/70 uppercase tracking-widest font-semibold">Pre-populated WhatsApp routing</span>
                </div>
              </div>
              <p className="text-xs text-bg-cream/80 leading-relaxed font-light">
                Click here to route immediately to our export directors' WhatsApp mobile. Ideal for quick packaging questions and cargo timeline estimations.
              </p>
              
              <a
                href="https://wa.me/919876543210?text=Hello%20Kashmiri%20Organic%20team%2C%20I%20wish%20to%20make%20a%20B2B%20sourcing%20inquiry..."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full text-center bg-bg-cream hover:bg-brand-gold text-brand-green hover:text-brand-green py-3 rounded-xl text-xs font-bold uppercase tracking-wider block transition-colors duration-300"
              >
                Open WhatsApp Chat
              </a>
            </div>

            {/* Credibility verification */}
            <div className="bg-bg-cream rounded-3xl p-6 border border-brand-green/5 luxury-shadow flex gap-3 items-center">
              <ShieldCheck className="w-10 h-10 text-brand-gold shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-brand-green leading-snug">Geographical Indication Protected</h4>
                <p className="text-[11px] text-text-secondary leading-normal font-light mt-0.5">
                  Our products carry verified GI Tag logs certifying authentic origins in Jammu & Kashmir.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Mountain origin showcase */}
      <section className="h-[350px] relative w-full bg-[url('https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center">
        {/* Soft elegant gradient overlap */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-cream via-transparent to-brand-green/20"></div>
      </section>

    </div>
  );
}
