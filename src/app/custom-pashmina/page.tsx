'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Send, Sparkle, BadgeCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface ConfigOption {
  key: string;
  name: string;
  desc: string;
  extra?: string;
  color?: string; // For dye preview
}

const GRADES: ConfigOption[] = [
  { key: 'grade-a', name: 'Grade A (12 - 13.5µm)', desc: 'Extremely rare Changthangi Pashm. Maximum thermal efficiency, ultra-light feel.', extra: 'Spun by senior Srinagar weavers.' },
  { key: 'grade-b', name: 'Grade B (14 - 15.5µm)', desc: 'High-grade Ganderbal Cashmere. Exceptional balance of softness and everyday durability.', extra: 'Spun by village collectives.' },
  { key: 'grade-c', name: 'Grade C (16 - 18µm)', desc: 'Premium Himalayan Highland Wool. Soft, substantial weight, robust weave structure.', extra: 'Spun by pasture herdsmen.' }
];

const WEAVES: ConfigOption[] = [
  { key: 'diamond', name: 'Diamond (Chashm-e-Bulbul)', desc: 'The eye-of-the-nightingale weave, creating beautiful microscopic diamond lattices.' },
  { key: 'twill', name: 'Plain Twill (Saada)', desc: 'Traditional diagonal weave lines. Sleek, fluid drape and flat modern finish.' },
  { key: 'herringbone', name: 'Herringbone', desc: 'Distinct V-shaped weave panels. Adds rich structural texture to plain solid colors.' },
  { key: 'basketweave', name: 'Basketweave', desc: 'Criss-cross checkerboard pattern. Exceptional insulation and breathability.' }
];

const SIZES: ConfigOption[] = [
  { key: 'scarf', name: 'Scarf (70 x 200 cm)', desc: 'Perfect daily luxury accessory for wrapping around neck or shoulders.' },
  { key: 'stole', name: 'Stole (100 x 200 cm)', desc: 'Medium size. Highly versatile wrap matching evening gowns and suits.' },
  { key: 'shawl', name: 'Full Shawl (135 x 270 cm)', desc: 'Traditional grand sizing. Envelops the body completely in royal warmth.' }
];

const DYES: ConfigOption[] = [
  { key: 'undyed', name: 'Undyed Natural (Ivory)', desc: 'The authentic, untouched organic shade of pasture pashm goats.', color: '#F5F5DC' },
  { key: 'indigo', name: 'Organic Indigo (Deep Blue)', desc: 'Fermented natural indigo leaves yielding a royal midnight hue.', color: '#1B365D' },
  { key: 'madder', name: 'Madder Root (Crimson)', desc: 'Boiled Himalayan madder bark creating deep brick-crimson pigments.', color: '#8C2D19' },
  { key: 'marigold', name: 'Marigold Infusion (Amber)', desc: 'Shade-dried marigold blossoms giving a bright warm amber glaze.', color: '#D48C2A' }
];

const EMBROIDERIES: ConfigOption[] = [
  { key: 'saada', name: 'Saada (No Embroidery)', desc: 'Sleek, minimalist plain pashmina focusing entirely on the purity of the weave.' },
  { key: 'border-sozni', name: 'Border Sozni (Hand-needle)', desc: 'Fine hand-needle outline borders. Takes 2 to 4 weeks of single artisan labor.' },
  { key: 'jamawar-jaal', name: 'Jamawar Jaal (Full-surface)', desc: 'Masterpiece surface completely covered in floral needle tapestry. Takes 6-12 months.' }
];

export default function CustomPashminaPage() {
  // Configuration State
  const [selectedGrade, setSelectedGrade] = useState(GRADES[0]);
  const [selectedWeave, setSelectedWeave] = useState(WEAVES[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedDye, setSelectedDye] = useState(DYES[0]);
  const [selectedEmbroidery, setSelectedEmbroidery] = useState(EMBROIDERIES[0]);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [instructions, setInstructions] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    if (!name || !email || !phone) {
      setSubmitError('Please fill out Name, Email, and Phone fields.');
      setSubmitting(false);
      return;
    }

    // Compile configurations into message payload
    const compiledMessage = `
[CUSTOM PASHMINA CONFIGURATION]
----------------------------------------------
* Grade: ${selectedGrade.name}
* Weave: ${selectedWeave.name}
* Size: ${selectedSize.name}
* Dye Style: ${selectedDye.name}
* Embroidery Style: ${selectedEmbroidery.name}
* Requested Quantity: ${quantity} units

* Client Specifications & Instructions:
"${instructions || 'None provided.'}"
----------------------------------------------
Sourced directly from Kashmiri Organic Handloom Guilds.
`;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          companyName,
          inquiryType: 'pashmina',
          message: compiledMessage
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setCompanyName('');
        setInstructions('');
      } else {
        const data = await res.json();
        setSubmitError(data.error || 'Failed to submit configuration.');
      }
    } catch (err) {
      setSubmitError('Network failure. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-cream text-text-primary pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-[0.25em] pl-1 block">B2B Commissioning Desk</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-green tracking-tight leading-tight">
            Interactive Pashmina Builder
          </h1>
          <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
            Customize every aspect of your Geographical Indication (GI) tagged Kashmiri Pashmina. Select the wool grade, weave structure, size, dye color, and embroidery detail to receive a personalized B2B wholesale quotation.
          </p>
        </div>

        {/* Builder Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Configuration controls */}
          <div className="lg:col-span-7 space-y-8 bg-bg-beige/25 p-6 sm:p-8 rounded-3xl border border-brand-green/10">
            
            {/* Option 1: Grade */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green flex items-center gap-1.5 pl-1">
                <Sparkle className="w-3.5 h-3.5 text-brand-gold" /> Step 1: Wool Grade Selection
              </label>
              <div className="grid grid-cols-1 gap-3">
                {GRADES.map((grade) => (
                  <button
                    key={grade.key}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`text-left p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                      selectedGrade.key === grade.key
                        ? 'bg-brand-green text-bg-cream border-brand-green shadow-lg'
                        : 'bg-bg-cream/60 hover:bg-bg-cream border-brand-green/10'
                    }`}
                  >
                    <span className="text-xs font-bold block">{grade.name}</span>
                    <span className={`text-[11px] block mt-1 leading-relaxed ${selectedGrade.key === grade.key ? 'text-bg-cream/90' : 'text-text-muted'}`}>
                      {grade.desc}
                    </span>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider block mt-2 ${selectedGrade.key === grade.key ? 'text-brand-gold' : 'text-brand-green'}`}>
                      {grade.extra}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 2: Weave */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green flex items-center gap-1.5 pl-1">
                <Sparkle className="w-3.5 h-3.5 text-brand-gold" /> Step 2: Loom Weave Lattice
              </label>
              <div className="grid grid-cols-2 gap-3">
                {WEAVES.map((weave) => (
                  <button
                    key={weave.key}
                    type="button"
                    onClick={() => setSelectedWeave(weave)}
                    className={`text-left p-4 rounded-xl cursor-pointer border transition-all duration-300 flex flex-col justify-between h-28 ${
                      selectedWeave.key === weave.key
                        ? 'bg-brand-green text-bg-cream border-brand-green shadow'
                        : 'bg-bg-cream/60 hover:bg-bg-cream border-brand-green/10'
                    }`}
                  >
                    <span className="text-xs font-bold block">{weave.name}</span>
                    <span className={`text-[10px] leading-tight mt-1 font-light ${selectedWeave.key === weave.key ? 'text-bg-cream/80' : 'text-text-muted'}`}>
                      {weave.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Size */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green flex items-center gap-1.5 pl-1">
                <Sparkle className="w-3.5 h-3.5 text-brand-gold" /> Step 3: Dimension Sizing
              </label>
              <div className="grid grid-cols-3 gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size.key}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`text-left p-4 rounded-xl cursor-pointer border transition-all duration-300 flex flex-col justify-between h-32 ${
                      selectedSize.key === size.key
                        ? 'bg-brand-green text-bg-cream border-brand-green shadow'
                        : 'bg-bg-cream/60 hover:bg-bg-cream border-brand-green/10'
                    }`}
                  >
                    <span className="text-xs font-bold block leading-tight">{size.name}</span>
                    <span className={`text-[9px] leading-tight mt-2 font-light ${selectedSize.key === size.key ? 'text-bg-cream/80' : 'text-text-muted'}`}>
                      {size.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 4: Organic Dyes */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green flex items-center gap-1.5 pl-1">
                <Sparkle className="w-3.5 h-3.5 text-brand-gold" /> Step 4: Botanical Pigments (Dye)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DYES.map((dye) => (
                  <button
                    key={dye.key}
                    type="button"
                    onClick={() => setSelectedDye(dye)}
                    className={`text-left p-4 rounded-xl cursor-pointer border transition-all duration-300 flex items-start gap-3 ${
                      selectedDye.key === dye.key
                        ? 'bg-brand-green text-bg-cream border-brand-green shadow'
                        : 'bg-bg-cream/60 hover:bg-bg-cream border-brand-green/10'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-full border border-brand-green/15 shrink-0 block mt-0.5" 
                      style={{ backgroundColor: dye.color }}
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold block">{dye.name}</span>
                      <span className={`text-[10px] leading-tight mt-1 block font-light ${selectedDye.key === dye.key ? 'text-bg-cream/80' : 'text-text-muted'}`}>
                        {dye.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Option 5: Hand Needle Embroidery */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green flex items-center gap-1.5 pl-1">
                <Sparkle className="w-3.5 h-3.5 text-brand-gold" /> Step 5: Artisan Needlework
              </label>
              <div className="grid grid-cols-1 gap-3">
                {EMBROIDERIES.map((emb) => (
                  <button
                    key={emb.key}
                    type="button"
                    onClick={() => setSelectedEmbroidery(emb)}
                    className={`text-left p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                      selectedEmbroidery.key === emb.key
                        ? 'bg-brand-green text-bg-cream border-brand-green shadow'
                        : 'bg-bg-cream/60 hover:bg-bg-cream border-brand-green/10'
                    }`}
                  >
                    <span className="text-xs font-bold block">{emb.name}</span>
                    <span className={`text-[10px] block mt-1 font-light leading-relaxed ${selectedEmbroidery.key === emb.key ? 'text-bg-cream/85' : 'text-text-muted'}`}>
                      {emb.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Simulated Live Preview & Submission Form */}
          <div className="lg:col-span-5 space-y-8 sticky top-24">
            
            {/* Live Visual Preview Frame */}
            <div className="bg-bg-beige/40 border border-brand-green/10 rounded-3xl p-6 space-y-6">
              <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block">Loom Draft Preview</span>
              
              {/* Simulated Fabric swatch */}
              <div 
                className="h-48 rounded-2xl relative shadow-inner overflow-hidden flex items-center justify-center border border-black/15 transition-all duration-500"
                style={{ backgroundColor: selectedDye.color }}
              >
                {/* Diagonal weave texture simulated overlay */}
                <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000),linear-gradient(45deg,#000_25%,transparent_25%,transparent_75%,#000_75%,#000)] [background-size:24px_24px] [background-position:0_0,12px_12px]" />
                
                <span className="relative z-10 font-serif italic text-sm font-semibold tracking-wider mix-blend-difference text-white uppercase opacity-40">
                  {selectedWeave.name.split(' ')[0]} Weave swatch
                </span>
              </div>

              {/* Specs Summary List */}
              <div className="space-y-2 border-t border-brand-green/10 pt-4">
                <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider block">Selected Specifications</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-light">
                  <div>
                    <span className="text-[10px] text-text-muted block">Loom Wool Grade</span>
                    <span className="font-semibold text-brand-green">{selectedGrade.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Weave Pattern</span>
                    <span className="font-semibold text-brand-green">{selectedWeave.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Dye Sourcing</span>
                    <span className="font-semibold text-brand-green">{selectedDye.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Embroidery Needle</span>
                    <span className="font-semibold text-brand-green">{selectedEmbroidery.name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* B2B Sourcing Request Form */}
            <div className="bg-bg-beige/25 border border-brand-green/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-gold shrink-0" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-green">Sourcing Inquiry Form</h3>
                  <p className="text-[10px] text-brand-gold uppercase tracking-wider">Enterprise Quotation Request</p>
                </div>
              </div>

              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-6 rounded-2xl text-center space-y-4"
                >
                  <BadgeCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-base font-bold">Inquiry Logged</h4>
                  <p className="text-xs font-light leading-relaxed">
                    Thank you! Your custom Pashmina configuration has been successfully submitted to our Srinagar handloom desk. A sourcing officer will verify looms availability and email a custom B2B quote within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-bold uppercase tracking-wider text-brand-green hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto pt-2"
                  >
                    Configure Another Piece <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green pl-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-bg-cream/80 p-2.5 rounded-lg border border-brand-green/10 text-xs focus:outline-none focus:border-brand-gold text-text-primary"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green pl-1">Business Email</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className="bg-bg-cream/80 p-2.5 rounded-lg border border-brand-green/10 text-xs focus:outline-none focus:border-brand-gold text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green pl-1">WhatsApp / Phone</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="bg-bg-cream/80 p-2.5 rounded-lg border border-brand-green/10 text-xs focus:outline-none focus:border-brand-gold text-text-primary"
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green pl-1">Company (Optional)</label>
                      <input 
                        type="text" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Luxury Textiles Ltd"
                        className="bg-bg-cream/80 p-2.5 rounded-lg border border-brand-green/10 text-xs focus:outline-none focus:border-brand-gold text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green pl-1">Target Quantity (Units)</label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="bg-bg-cream/80 p-2.5 rounded-lg border border-brand-green/10 text-xs focus:outline-none focus:border-brand-gold text-text-primary cursor-pointer"
                    >
                      <option value="5">5 units (Minimal Sample Run)</option>
                      <option value="10">10 units (Standard Boutique)</option>
                      <option value="25">25 units (Mid-size Store)</option>
                      <option value="50">50 units (Bulk Export Run)</option>
                      <option value="100+">100+ units (Custom Industrial Order)</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green pl-1">Special Weaving Instructions</label>
                    <textarea 
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Specify custom fringe styles, specific pantone matching, or monogram needle initials here..."
                      rows={3}
                      className="bg-bg-cream/80 p-2.5 rounded-lg border border-brand-green/10 text-xs focus:outline-none focus:border-brand-gold text-text-primary resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-[11px] p-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-green hover:bg-brand-gold text-bg-cream hover:text-brand-green font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Submitting configurations...' : 'Submit Sourcing Request'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
