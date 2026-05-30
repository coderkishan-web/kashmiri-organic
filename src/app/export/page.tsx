import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Sprout, Globe, CheckCircle2, FileText, BadgeCheck, Phone, Mail, Award, MessageSquare } from 'lucide-react';

export default function ExportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Exports</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            Enterprise Wholesale
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream mb-4">
            B2B Sourcing & International Export
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            We partner with boutique cosmetics brands, premium spice packagers, and organic retailers globally. Let us manage phytosanitary certification, lab audits, and worldwide cargo customs.
          </p>
        </div>
      </section>

      {/* 2. Export Specifications & Packaging Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sourcing terms & Logistics */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            
            {/* Sourcing terms card */}
            <div className="bg-bg-cream rounded-3xl p-8 border border-brand-green/5 luxury-shadow flex flex-col gap-6">
              <h2 className="font-serif text-2xl font-bold text-brand-green">Wholesale Sourcing Parameters</h2>
              <div className="w-12 h-0.5 bg-brand-gold"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold">Minimum Order Quantities (MOQ)</h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mt-1">
                    Mongra Saffron: 1 kg <br />
                    Himalayan Honey: 500 kg <br />
                    Walnut Kernel Oils: 50 litres <br />
                    Handcrafted Woodware: 20 pieces
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold">Packaging Formats</h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mt-1">
                    Saffron: Vacuum-sealed tins & custom gift boxes.<br />
                    Honey: Food-grade drums & custom label jars.<br />
                    Oil: UV dropper bottles & bulk HDPE containers.<br />
                    Woodware: Wrapped in felt sheets inside crates.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold">Shipping Options</h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mt-1">
                    Air Cargo dispatch to global ports via DHL/FedEx. Sea freight containers available for heavy honey shipments. Delivered Duty Unpaid (DDU) / CIF.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold">Custom Branding (OEM)</h4>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mt-1">
                    We offer comprehensive private label services. Custom laser engraving is available for our seasoned walnut woodcraft items.
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Logistics Visualizer */}
            <div className="bg-bg-cream rounded-3xl p-8 border border-brand-green/5 luxury-shadow">
              <h2 className="font-serif text-2xl font-bold text-brand-green mb-6">Standard Export Pathway</h2>
              
              <div className="relative border-l border-brand-gold/25 pl-6 ml-4 space-y-8">
                
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-brand-gold border-4 border-bg-cream flex items-center justify-center"></span>
                  <h4 className="text-sm font-bold text-brand-green">1. Submit Sourcing Inquiry</h4>
                  <p className="text-xs text-text-secondary font-light mt-0.5 leading-relaxed">
                    Provide your target volumes, packaging requirements, and timeline. Our team replies within 12 hours with seasonal price parameters.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-brand-green border-4 border-bg-cream flex items-center justify-center"></span>
                  <h4 className="text-sm font-bold text-brand-green">2. Sampling & Chemical Analysis</h4>
                  <p className="text-xs text-text-secondary font-light mt-0.5 leading-relaxed">
                    We dispatch laboratory saffron threads or oils to your QC office. Complete ISO-3632 crop analysis certificate sheets are provided.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-brand-green border-4 border-bg-cream flex items-center justify-center"></span>
                  <h4 className="text-sm font-bold text-brand-green">3. Purchase Order & LC Agreement</h4>
                  <p className="text-xs text-text-secondary font-light mt-0.5 leading-relaxed">
                    Finalization of prices, contract values, private labeling formats, and secure Letter of Credit (LC) / Bank Wire transfers.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-brand-green border-4 border-bg-cream flex items-center justify-center"></span>
                  <h4 className="text-sm font-bold text-brand-green">4. Customs & Phytosanitary Logging</h4>
                  <p className="text-xs text-text-secondary font-light mt-0.5 leading-relaxed">
                    We secure necessary Geographical Indication origin stamps, export quarantine permissions, and fumigation certificates for shipment.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-brand-gold border-4 border-bg-cream flex items-center justify-center"></span>
                  <h4 className="text-sm font-bold text-brand-green">5. Air Freight Dispatch</h4>
                  <p className="text-xs text-text-secondary font-light mt-0.5 leading-relaxed">
                    Goods are safely sealed in heavy cardboard boxes / pallets and cleared at Srinagar/Delhi airport for immediate global flight boarding.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Distributor Sourcing Form */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Form Box */}
            <div className="bg-bg-cream rounded-3xl p-8 border border-brand-green/10 luxury-shadow">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1 block">Distributor Portal</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">Submit Wholesale Request</h3>
                <p className="text-xs text-text-secondary font-light leading-relaxed mt-1">
                  Secure direct crop agreements or requesting container packaging formats.
                </p>
              </div>

              <form action="/api/inquiries" method="POST" className="grid gap-5">
                <input type="hidden" name="inquiry_type" value="bulk" />
                <input type="hidden" name="redirect" value="/export?submitted=true" />
                
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1">Purchasing Agent Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="Your full name..."
                    className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="sourcing@firm.com..."
                    className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1">Corporate Phone</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="+44 20 7946 0958..."
                    className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1">Company Registered Name</label>
                  <input
                    type="text"
                    required
                    name="company_name"
                    placeholder="Himalayan Wellness LLC..."
                    className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1">Sourcing Elements of Interest</label>
                  <select
                    name="message"
                    required
                    className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  >
                    <option value="Inquiry: Kashmiri Grade-A Saffron Bulk contract (1kg+)">Pampore Grade-A Saffron (1kg+)</option>
                    <option value="Inquiry: Himalayan Forest Honey Sourcing (500kg+)">Raw High-Altitude Honey (500kg+)</option>
                    <option value="Inquiry: Handcarved Walnut Woodware OEM production">Walnut Woodwork Artistry (OEM)</option>
                    <option value="Inquiry: Cold Pressed Oils Sourcing (100L+)">Cold-Pressed Botanical Oils (100L+)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1">Additional specifications / Target Destination</label>
                  <textarea
                    required
                    name="additional_message"
                    rows={4}
                    placeholder="Provide ports of destination, required certifications (e.g. EU compliant, USDA), and private packaging details..."
                    className="bg-bg-beige/30 text-xs p-4 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-colors"
                >
                  Submit Export Sourcing inquiry
                </button>
              </form>
            </div>
            
            {/* Quick Contacts Call */}
            <div className="bg-brand-green text-bg-cream rounded-3xl p-6 border border-brand-gold/15 luxury-shadow flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold text-brand-gold">Direct Communication</h3>
              <p className="text-xs text-bg-cream/80 leading-relaxed font-light">
                For urgent high-level corporate sourcing contracts, please call our managing director or send a secure email directly.
              </p>
              
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
                  <MessageSquare className="w-4 h-4 text-emerald-500 fill-current" /> WhatsApp Sourcing Office
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
