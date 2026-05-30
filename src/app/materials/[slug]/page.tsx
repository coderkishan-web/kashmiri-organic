import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { executeQuery, Material, Product, Blog } from '@/lib/db';
import { ArrowLeft, MapPin, Sparkles, Sprout, ArrowRight, BookOpen, Compass, ClipboardList } from 'lucide-react';

interface MaterialDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  // Await params for Next.js 15+/16 compatibility
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  // Fetch material details
  const materialRows = await executeQuery<Material[]>('SELECT * FROM materials WHERE slug = ?', [slug]);
  const material = materialRows?.[0];

  if (!material) {
    notFound();
  }

  // Parse gallery images
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(material.gallery_urls || '[]');
  } catch (e) {
    gallery = [];
  }

  // Fetch all products and blogs, then filter for relationships (works robustly in both MySQL & JSON fallback modes)
  const allProducts = await executeQuery<Product[]>('SELECT * FROM products');
  const relatedProducts = allProducts.filter(p => p.materials?.some(m => m.slug === slug));

  const allBlogs = await executeQuery<Blog[]>('SELECT * FROM blogs');
  const relatedBlogs = allBlogs.filter(b => {
    try {
      const matIds = JSON.parse(b.related_materials || '[]');
      return matIds.includes(material.id) || b.tags.toLowerCase().includes(material.name.toLowerCase());
    } catch (e) {
      return b.tags.toLowerCase().includes(material.name.toLowerCase());
    }
  });

  // Photo mappings
  const originImages: Record<string, string> = {
    saffron: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
    wood: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=1200&q=80',
    walnut: 'https://images.unsplash.com/photo-1589947966779-7a0e5b7b9ab8?auto=format&fit=crop&w=1200&q=80',
    herbs: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=1200&q=80',
  };

  const productImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    2: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    3: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80',
    4: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    5: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  };

  const blogImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1508747703725-719ae2c98295?auto=format&fit=crop&w=800&q=80',
    2: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=800&q=80',
  };

  const primaryBanner = originImages[material.slug] || '/images/material-detail-banner.jpg';

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* 1. Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <Link
          href="/materials"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Materials
        </Link>
      </div>

      {/* 2. Headline Hero Banner */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Narrative (Left) */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-gold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {material.origin}
              </span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-green leading-tight">
              Kashmiri {material.name}
            </h1>
            
            <div className="w-12 h-0.5 bg-brand-gold"></div>
            
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-light">
              {material.overview}
            </p>
          </div>
          
          {/* Image Showcase (Right) */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full h-full">
            <img
              src={primaryBanner}
              alt={material.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Deep-Dive Origin & Science */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* A. Manufacturing & Refinement Process */}
          <div className="bg-bg-cream p-8 rounded-2xl border border-brand-green/5 luxury-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-brand-gold/15 text-brand-gold rounded-full flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-green">Gathering & Refinement</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
              {material.manufacturing_process}
            </p>
          </div>

          {/* B. Sustainability Profile */}
          <div className="bg-bg-cream p-8 rounded-2xl border border-brand-green/5 luxury-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-brand-sage/20 text-brand-green rounded-full flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-green">Sustainability Promise</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
              {material.sustainability}
            </p>
          </div>

          {/* C. Biological Benefits */}
          <div className="bg-bg-cream p-8 rounded-2xl border border-brand-green/5 luxury-shadow flex flex-col gap-4">
            <div className="w-10 h-10 bg-brand-gold/15 text-brand-brown rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-gold" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-green">Wellness Properties</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
              {material.benefits}
            </p>
          </div>

        </div>
      </section>

      {/* 3.5. Heritage Chronicle & Legacy Narrative */}
      {material.history && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-brand-green/5 animate-fade-in">
          <div className="bg-bg-cream rounded-3xl p-8 sm:p-12 border border-brand-green/10 luxury-shadow flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-7/12 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                Heritage Patrons & Patronage
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-green">
                Historical Patrons & Kashmiri Legacy
              </h2>
              <div className="w-12 h-0.5 bg-brand-gold my-1"></div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light whitespace-pre-line">
                {material.history}
              </p>
            </div>
            
            <div className="md:w-5/12 flex justify-center">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-brand-green/10 shadow-lg relative bg-bg-mist">
                <img
                  src={primaryBanner}
                  alt="Ancient Patrons Chronicle"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3.6. Dynamic Gallery Visual Showcase */}
      {gallery.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-brand-green/5">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1 block">Visual Archive</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Valley Harvesting Gallery
            </h2>
            <p className="text-xs text-text-secondary font-light leading-relaxed mt-2">
              Authentic visual diaries of pristine organic farms, high-altitude plateaus, and ethical sorting processes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((url: string, index: number) => (
              <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-brand-green/10 bg-bg-cream hover:scale-[1.02] transition-transform duration-300 relative group cursor-pointer shadow-md">
                <img
                  src={url}
                  alt={`Harvest Visual ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-[10px] text-bg-cream uppercase font-bold tracking-widest">Enlarge</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Relational Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-brand-green/5">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1 block">Catalog Sourcing</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Products utilizing Kashmiri {material.name}
            </h2>
            <p className="text-xs text-text-secondary font-light leading-relaxed mt-2">
              Browse our luxury finished collections and raw quantities crafted exclusively with this material.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-bg-cream rounded-2xl overflow-hidden border border-brand-green/5 luxury-shadow luxury-shadow-hover flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-bg-mist">
                  <img
                    src={productImages[prod.id] || prod.image_url}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block mb-1">
                      {prod.categories?.[0]?.name || 'Health'}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-brand-green hover:text-brand-gold transition-colors leading-tight">
                      <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                    </h3>
                    <p className="text-xs text-text-secondary font-light line-clamp-2 mt-1 leading-relaxed">
                      {prod.short_description}
                    </p>
                  </div>
                  
                  <div className="border-t border-brand-green/5 pt-4 mt-auto flex items-center justify-between text-xs">
                    <span className="text-text-muted italic">MOQ: {prod.moq}</span>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-brand-green hover:text-brand-gold font-bold uppercase tracking-wider flex items-center gap-0.5 group/btn"
                    >
                      Inquire Spec <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Relational Blogs / Stories section */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-bg-cream border-t border-brand-green/5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-1 block">Editorial Chronicles</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
                Harvest Diaries & Scientific Research
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-bg-mist p-6 sm:p-8 rounded-3xl border border-brand-green/5 luxury-shadow flex flex-col sm:flex-row gap-6"
                >
                  <div className="sm:w-1/3 relative min-h-[120px] sm:min-h-auto rounded-xl overflow-hidden bg-bg-cream">
                    <img
                      src={blogImages[blog.id] || blog.featured_image}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:w-2/3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-brand-gold block mb-1">
                        {blog.category}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-brand-green leading-snug hover:text-brand-gold transition-colors">
                        <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                      </h3>
                      <p className="text-xs text-text-secondary font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {blog.seo_description}
                      </p>
                    </div>
                    
                    <div className="border-t border-brand-green/5 pt-3 mt-4 flex items-center justify-between text-xs text-text-muted">
                      <span>By {blog.author}</span>
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="font-semibold text-brand-green hover:underline flex items-center gap-0.5"
                      >
                        Read Log <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Custom Sourcing Action CTA */}
      <section className="py-20 bg-brand-green text-bg-cream px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Compass className="w-96 h-96 text-bg-cream absolute -top-20 -left-20" />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">Wholesale Sourcing</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-bg-cream mb-4">
            Need Bulk raw {material.name} Sourcing?
          </h2>
          <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed mb-8 max-w-md mx-auto">
            Get direct pricing matrices and seasonal harvest dispatch plans for pure raw materials, fully certified for US, European, and Gulf export codes.
          </p>
          <Link
            href={`/inquiry?inquiry_type=bulk&message=Hello, I would like to make an export inquiry for bulk quantities of pure raw material: "${material.name}".`}
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl inline-flex items-center gap-1.5"
          >
            Request B2B Sourcing Contract
          </Link>
        </div>
      </section>

    </div>
  );
}
