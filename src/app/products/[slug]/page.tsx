import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { executeQuery, Product, getProductBySlug } from '@/lib/db';
import { ArrowLeft, ArrowRight, Check, Sparkles, MessageSquare, Mail, Award, Box, Truck, Download, Calendar, ShieldCheck, Tag } from 'lucide-react';
import ProductImageGallery from '@/components/ProductImageGallery';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Await params for Next.js 15+/16 compatibility
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  // Fetch product using unified helper (ensures relationships are hydrated in MySQL & JSON DB fallback)
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Parse gallery images
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(product.gallery_urls);
  } catch (e) {
    gallery = [product.image_url];
  }

  // Pre-mapped high-res photography to replace fallbacks
  const productImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', // saffron
    2: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', // honey
    3: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80', // bowl
    4: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', // oil
    5: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80', // lavender
  };

  const primaryImage = productImages[product.id] || product.image_url;

  // Build WhatsApp inquiry link
  const waMessage = encodeURIComponent(
    `Hello Kashmiri Organic, I am visiting your platform and wish to make a B2B sourcing inquiry for: "${product.name}" (Slug: ${product.slug}). Could you please send me price logs, certificate evaluations, and available export dates? Thank you.`
  );
  const waUrl = `https://wa.me/919876543210?text=${waMessage}`;

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* 1. Header Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Organic Catalog
        </Link>
      </div>

      {/* 2. Product Presentation Layout */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* A. Product Image Showcase & Specs (Left Column - Dynamic & Sticky Pinned!) */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <ProductImageGallery
              gallery={gallery}
              productName={product.name}
              exportQuality={product.export_quality}
              certified={product.certified}
              productId={product.id}
            />

            {/* Sourcing and Tech Sheets downloads */}
            <div className="bg-bg-cream rounded-2xl p-6 border border-brand-green/10 luxury-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-brand-green flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-gold" /> Technical Specifications Sheet
                </h4>
                <p className="text-xs text-text-secondary mt-0.5 font-light">
                  Includes chemical profile analysis, pesticide log audits, and packing details.
                </p>
              </div>
              <Link
                href={`/inquiry?product_id=${product.id}&subject=Technical Specifications`}
                className="bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors duration-300"
              >
                <Download className="w-3.5 h-3.5" /> PDF Specs
              </Link>
            </div>

          </div>

          {/* B. Product Description and details (Right) */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            
            {/* Overview Box */}
            <div className="flex flex-col gap-4">
              
              {/* Category, Material, Types tags */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">
                  {product.categories?.[0]?.name || 'Health'}
                </span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full"></span>
                <span className="text-xs uppercase font-bold tracking-widest text-brand-brown">
                  {product.materials?.[0]?.name || 'Origin Material'}
                </span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full"></span>
                <span className="text-xs uppercase font-bold tracking-widest text-brand-green">
                  {product.product_types?.[0]?.name || 'Eatable'}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-green leading-tight">
                {product.name}
              </h1>
              
              {/* Altitude Origin statement */}
              <div className="inline-flex items-center gap-2 bg-brand-sage/10 text-brand-green px-3.5 py-1.5 rounded-full text-xs font-semibold max-w-max">
                <Sparkles className="w-4.5 h-4.5 text-brand-gold" /> Origin Altitude: 1,600m ~ Pampore Valley
              </div>
              
              <div className="w-full h-px bg-brand-green/5 my-2"></div>
              
              <p className="text-sm sm:text-base text-text-secondary font-light leading-relaxed">
                {product.long_description}
              </p>
            </div>

            {/* 1. Benefits checklists */}
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-green mb-3">
                Biological Wellness Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-bg-cream rounded-2xl p-5 border border-brand-green/5 luxury-shadow">
                {product.benefits?.map((ben) => (
                  <div key={ben.id} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-brand-sage/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-brand-green" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-brand-green">{ben.name}</h4>
                      <p className="text-[10px] text-text-muted mt-0.5">{ben.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Usage Instructions */}
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-green mb-3">
                Recommended Applications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.usage_types?.map((u) => (
                  <div key={u.id} className="bg-bg-cream/40 p-4 rounded-xl border border-brand-green/5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block mb-1">
                      {u.name}
                    </span>
                    <p className="text-xs text-text-secondary font-light leading-relaxed">
                      {u.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Export Parameters Box */}
            <div className="bg-bg-cream rounded-2xl p-6 border border-brand-green/10 luxury-shadow flex flex-col gap-4">
              <h3 className="font-serif text-lg font-bold text-brand-green flex items-center gap-1.5">
                <Box className="w-5 h-5 text-brand-gold" /> B2B Sourcing Parameters
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Minimum order (MOQ)</span>
                  <span className="text-sm font-bold text-brand-green mt-1 block">{product.moq}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Packaging options</span>
                  <span className="text-xs font-semibold text-text-secondary leading-relaxed mt-1 block">{product.packaging}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">International shipping</span>
                  <span className="text-xs font-semibold text-text-secondary leading-relaxed mt-1 block">{product.shipping}</span>
                </div>
              </div>
            </div>

            {/* 4. Instant Action Triggers */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4 border-t border-brand-green/5">
              <Link
                href={`/inquiry?product_id=${product.id}`}
                className="flex-1 bg-brand-green hover:bg-brand-green/90 text-bg-cream font-bold text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl text-center flex items-center justify-center gap-2 shadow-md transition-transform duration-200 active:scale-95"
              >
                <Mail className="w-4 h-4 text-brand-gold" /> Request Quote Sourcing
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-bg-cream font-bold text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl text-center flex items-center justify-center gap-2 transition-transform duration-200 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Inquiry
              </a>
            </div>

          </div>
          
        </div>
      </section>

      {/* 3. Material Story Detail Banner */}
      {product.materials?.[0] && (
        <section className="py-16 bg-brand-green text-bg-cream px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <span className="font-serif text-[12vw] font-bold select-none leading-none absolute -bottom-10 right-10">Origin</span>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
                The Heritage Material Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-bg-cream mb-4">
                About {product.materials[0].name}
              </h2>
              <p className="text-sm text-bg-cream/80 leading-relaxed font-light mb-6">
                {product.materials[0].overview}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-bg-cream/70 font-light mb-6">
                <div>
                  <strong className="text-brand-gold font-bold">Harvest Origin:</strong> {product.materials[0].origin}
                </div>
                <div>
                  <strong className="text-brand-gold font-bold">Sustainability Promise:</strong> {product.materials[0].sustainability}
                </div>
              </div>
              
              <Link
                href={`/materials/${product.materials[0].slug}`}
                className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1 group/btn"
              >
                Discover Sourcing & Manufacturing <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-brand-gold/30 p-2 overflow-hidden bg-brand-green/20 relative">
                <img
                  src={
                    product.materials[0].slug === 'saffron'
                      ? 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80'
                      : 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={product.materials[0].name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Related Products Section */}
      {product.related_products && product.related_products.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-cream">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-green text-center mb-12">
              Related Pure Selections
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.related_products.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  className="bg-bg-beige/10 rounded-2xl overflow-hidden border border-brand-green/5 luxury-shadow luxury-shadow-hover flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-bg-mist border-b border-brand-green/5">
                    <img
                      src={productImages[rel.id] || rel.image_url}
                      alt={rel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-green mb-1 hover:text-brand-gold transition-colors">
                        <Link href={`/products/${rel.slug}`}>{rel.name}</Link>
                      </h3>
                      <p className="text-xs text-text-secondary font-light line-clamp-2 leading-relaxed">
                        {rel.short_description}
                      </p>
                    </div>
                    
                    <div className="border-t border-brand-green/5 pt-4 mt-6 flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold text-brand-gold">
                      <span>GI Protected</span>
                      <Link
                        href={`/products/${rel.slug}`}
                        className="text-brand-green hover:underline flex items-center gap-0.5 group/btn"
                      >
                        Explore <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Sub-Inquiry Form Container */}
      <section id="sourcing-inquiry" className="py-20 bg-bg-mist px-4 sm:px-6 lg:px-8 border-t border-brand-green/5">
        <div className="max-w-3xl mx-auto bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 luxury-shadow">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1 block">Sourcing Request</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Get an Immediate Quote for this Product
            </h2>
            <p className="text-xs text-text-secondary font-light leading-relaxed mt-2">
              Our B2B logistics team will draft a detailed price schedule and delivery timetable and email it back to you within 12 hours.
            </p>
          </div>
          
          <form action="/api/inquiries" method="POST" className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input type="hidden" name="product_id" value={product.id} />
            <input type="hidden" name="inquiry_type" value="quote" />
            <input type="hidden" name="redirect" value={`/products/${product.slug}?submitted=true`} />
            
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Contact Name</label>
              <input
                type="text"
                required
                name="name"
                placeholder="Your full name..."
                className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Corporate Email</label>
              <input
                type="email"
                required
                name="email"
                placeholder="purchasing@company.com..."
                className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Phone Number (with Country Code)</label>
              <input
                type="tel"
                required
                name="phone"
                placeholder="+1 555-0199..."
                className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Company Name (Optional)</label>
              <input
                type="text"
                name="company_name"
                placeholder="L'Élixir Brands France..."
                className="bg-bg-beige/30 text-xs px-4 py-3 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
              />
            </div>
            
            <div className="flex flex-col sm:col-span-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-brand-green mb-1.5">Sourcing Message / Target Volume</label>
              <textarea
                required
                name="message"
                rows={4}
                defaultValue={`Hello, I would like to request a bulk export quote for "${product.name}" (Grade A). Target initial shipment: 5 kg.`}
                className="bg-bg-beige/30 text-xs p-4 rounded-lg border border-brand-green/10 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold resize-none"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="sm:col-span-2 bg-brand-green hover:bg-brand-gold hover:text-brand-green text-bg-cream font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-md transition-colors"
            >
              Submit Corporate Sourcing inquiry
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
