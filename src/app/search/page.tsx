import React from 'react';
import Link from 'next/link';
import { executeQuery, Product, Material, Blog } from '@/lib/db';
import { Search, Compass, BookOpen, FileText, Sparkles, HelpCircle, ArrowRight, MapPin } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Await search params for Next.js 15+/16 compatibility
  const params = await searchParams;
  const rawQuery = params.q || '';
  const query = rawQuery.trim().toLowerCase();

  // Fetch all databases
  const products = await executeQuery<Product[]>('SELECT * FROM products');
  const materials = await executeQuery<Material[]>('SELECT * FROM materials');
  const blogs = await executeQuery<Blog[]>('SELECT * FROM blogs');

  // Filter lists based on the query term
  const matchedProducts = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.short_description.toLowerCase().includes(query) ||
          p.long_description.toLowerCase().includes(query)
      )
    : [];

  const matchedMaterials = query
    ? materials.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.overview.toLowerCase().includes(query) ||
          m.benefits.toLowerCase().includes(query)
      )
    : [];

  const matchedBlogs = query
    ? blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.seo_description.toLowerCase().includes(query) ||
          b.content.toLowerCase().includes(query)
      )
    : [];

  const totalResults = matchedProducts.length + matchedMaterials.length + matchedBlogs.length;

  // Photo mappings
  const productImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    2: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    3: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=400&q=80',
    4: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    5: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80',
  };

  const materialImages: Record<string, string> = {
    saffron: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    wood: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=400&q=80',
    walnut: 'https://images.unsplash.com/photo-1589947966779-7a0e5b7b9ab8?auto=format&fit=crop&w=400&q=80',
    herbs: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=400&q=80',
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist animate-in fade-in duration-500">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
              Search Results
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-bg-cream">
              Findings for "{rawQuery}"
            </h1>
            <p className="text-xs sm:text-sm text-bg-cream/70 font-light mt-1">
              Universal lookup found <strong className="text-brand-gold font-bold">{totalResults}</strong> matching entities inside the valley archives.
            </p>
          </div>
          
          <form action="/search" method="GET" className="relative w-full max-w-sm">
            <input
              type="text"
              name="q"
              defaultValue={rawQuery}
              placeholder="Search spices, honey, blogs..."
              className="w-full bg-bg-cream text-text-primary text-xs pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </section>

      {/* 2. Matched Categories Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-12">
        
        {totalResults > 0 ? (
          <>
            {/* A. Matched Products */}
            {matchedProducts.length > 0 && (
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mb-6 pb-2 border-b border-brand-green/5">
                  Organic Catalog Masterpieces ({matchedProducts.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {matchedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-bg-cream rounded-2xl overflow-hidden border border-brand-green/5 luxury-shadow flex flex-col justify-between"
                    >
                      <div className="relative aspect-video overflow-hidden bg-bg-mist">
                        <img
                          src={productImages[prod.id] || prod.image_url}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                        <div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green hover:text-brand-gold transition-colors leading-tight">
                            <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                          </h4>
                          <p className="text-xs text-text-secondary font-light mt-1.5 line-clamp-2">
                            {prod.short_description}
                          </p>
                        </div>
                        
                        <div className="border-t border-brand-green/5 pt-3 mt-auto flex items-center justify-between text-[10px] tracking-wider uppercase font-semibold text-brand-gold">
                          <span>MOQ: {prod.moq}</span>
                          <Link
                            href={`/products/${prod.slug}`}
                            className="text-brand-green hover:underline flex items-center gap-0.5"
                          >
                            Explore <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* B. Matched Raw Materials */}
            {matchedMaterials.length > 0 && (
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mb-6 pb-2 border-b border-brand-green/5">
                  Ancestral Raw Materials ({matchedMaterials.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="bg-bg-cream p-5 rounded-2xl border border-brand-green/5 luxury-shadow flex gap-4 items-center"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-bg-mist border border-brand-green/5">
                        <img
                          src={materialImages[mat.slug] || '/images/material-placeholder.jpg'}
                          alt={mat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold block mb-0.5">
                            Origin: {mat.origin.split(',')[0]}
                          </span>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green hover:text-brand-gold transition-colors">
                            <Link href={`/materials/${mat.slug}`}>{mat.name}</Link>
                          </h4>
                          <p className="text-xs text-text-secondary font-light line-clamp-2 mt-1">
                            {mat.overview}
                          </p>
                        </div>
                        <Link
                          href={`/materials/${mat.slug}`}
                          className="text-[10px] text-brand-brown hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5 mt-2"
                        >
                          Story deep-dive <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* C. Matched Chronicles / Blogs */}
            {matchedBlogs.length > 0 && (
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green mb-6 pb-2 border-b border-brand-green/5">
                  Editorial Diaries & Research ({matchedBlogs.length})
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-bg-cream p-6 rounded-2xl border border-brand-green/5 luxury-shadow flex flex-col justify-between gap-4"
                    >
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand-gold block mb-1">
                          Chronicle — {blog.category}
                        </span>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-brand-green hover:text-brand-gold transition-colors">
                          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                        </h4>
                        <p className="text-xs text-text-secondary font-light mt-1.5 line-clamp-2">
                          {blog.seo_description}
                        </p>
                      </div>
                      
                      <div className="border-t border-brand-green/5 pt-3 mt-auto flex items-center justify-between text-xs text-text-muted">
                        <span>By {blog.author}</span>
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="font-bold text-brand-green hover:underline flex items-center gap-0.5"
                        >
                          Read Story <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty Search results State */
          <div className="bg-bg-cream rounded-3xl p-12 text-center border border-brand-green/10 luxury-shadow flex flex-col items-center gap-4 py-20 max-w-xl mx-auto my-10 w-full">
            <HelpCircle className="w-12 h-12 text-brand-gold" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">No Valley Finding Matches</h3>
            <p className="text-sm text-text-secondary font-light leading-relaxed">
              We couldn't locate any products, organic materials, or agricultural diaries fitting "{rawQuery}". Try refining search words.
            </p>
            <Link
              href="/products"
              className="mt-2 bg-brand-green hover:bg-brand-green/90 text-bg-cream px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Discover Catalog
            </Link>
          </div>
        )}

      </section>

    </div>
  );
}
