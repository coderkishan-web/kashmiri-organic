import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { executeQuery, Blog, Product, Material } from '@/lib/db';
import { ArrowLeft, User, Calendar, Tag, ArrowRight, ShieldCheck, Mail, MessageSquare } from 'lucide-react';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  // Await params for Next.js 15+/16 compatibility
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  // Fetch blog detail
  const blogRows = await executeQuery<Blog[]>('SELECT * FROM blogs WHERE slug = ?', [slug]);
  const blog = blogRows?.[0];

  if (!blog) {
    notFound();
  }

  // Hydrate related products
  let productIds: number[] = [];
  try {
    productIds = JSON.parse(blog.related_products || '[]');
  } catch (e) {
    productIds = [];
  }

  let relatedProducts: Product[] = [];
  if (productIds.length > 0) {
    const allProducts = await executeQuery<Product[]>('SELECT * FROM products');
    relatedProducts = allProducts.filter(p => productIds.includes(p.id));
  }

  // Hydrate related materials
  let materialIds: number[] = [];
  try {
    materialIds = JSON.parse(blog.related_materials || '[]');
  } catch (e) {
    materialIds = [];
  }

  let relatedMaterials: Material[] = [];
  if (materialIds.length > 0) {
    const allMaterials = await executeQuery<Material[]>('SELECT * FROM materials');
    relatedMaterials = allMaterials.filter(m => materialIds.includes(m.id));
  }

  // Photographic logs
  const blogImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1200&q=80',
    2: 'https://images.unsplash.com/photo-1546482502-61d0092288d6?auto=format&fit=crop&w=1200&q=80',
  };

  const productImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    2: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    3: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80',
    4: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    5: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  };

  // Basic custom markdown-to-HTML parser function to style rich text beautifully
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="font-serif text-2xl font-bold text-brand-green mt-8 mb-4">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="font-serif text-xl font-bold text-brand-green mt-6 mb-3">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('1. ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const text = trimmed.replace(/^[0-9*-\s]+\.?\s+/, '');
        // simple bold parser inside list
        const boldText = text.split('**');
        return (
          <li key={idx} className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mb-2 ml-4 list-decimal pl-1">
            {boldText.map((t, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-green">{t}</strong> : t)}
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={idx} className="h-4"></div>;
      }
      
      // Simple bold parser for body paragraphs
      const boldParts = trimmed.split('**');
      return (
        <p key={idx} className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light mb-4">
          {boldParts.map((t, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-brand-green">{t}</strong> : t)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* 1. Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-green hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Diaries
        </Link>
      </div>

      {/* 2. Headline Title & Header Info */}
      <section className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-3 block">
          Chronicle — {blog.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-green leading-tight mb-6">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-center gap-6 text-xs text-text-secondary pb-6 border-b border-brand-green/5">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-brand-brown" /> <span>{blog.author || 'Editorial Team'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-brand-sage" /> <span>{blog.publish_date || 'Recent'}</span>
          </div>
        </div>
      </section>

      {/* 3. Full-width Featured Image */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
        <div className="bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow aspect-[21/9] relative">
          <img
            src={blogImages[blog.id] || blog.featured_image}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4. Article content + related sidebars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* A. Editorial Content (Left Column) */}
          <article className="lg:col-span-8 bg-bg-cream p-8 sm:p-12 rounded-3xl border border-brand-green/5 luxury-shadow">
            {renderMarkdown(blog.content)}
          </article>

          {/* B. Relational Sourcing sidebar (Right Column) */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Related Products box */}
            {relatedProducts.length > 0 && (
              <div className="bg-bg-cream rounded-2xl p-6 border border-brand-green/10 luxury-shadow flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-brand-green pb-3 border-b border-brand-green/5">
                  Mentioned Elements
                </h3>
                
                <div className="flex flex-col gap-4">
                  {relatedProducts.map((prod) => (
                    <div key={prod.id} className="flex gap-3 items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-mist shrink-0 border border-brand-green/5">
                        <img
                          src={productImages[prod.id] || prod.image_url}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-brand-green hover:text-brand-gold transition-colors leading-tight">
                          <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                        </h4>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-brand-gold mt-1">
                          MOQ: {prod.moq}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Materials box */}
            {relatedMaterials.length > 0 && (
              <div className="bg-bg-cream rounded-2xl p-6 border border-brand-green/10 luxury-shadow flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-brand-green pb-3 border-b border-brand-green/5">
                  Harvest Origins
                </h3>
                <div className="flex flex-wrap gap-2">
                  {relatedMaterials.map((mat) => (
                    <Link
                      key={mat.id}
                      href={`/materials/${mat.slug}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-green/5 text-brand-green hover:bg-brand-green hover:text-bg-cream border border-brand-green/10 transition-colors"
                    >
                      {mat.name} Story
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Inquiry Box */}
            <div className="bg-brand-green text-bg-cream rounded-2xl p-6 border border-brand-gold/15 luxury-shadow flex flex-col gap-4 relative overflow-hidden">
              <h3 className="font-serif text-lg font-bold text-brand-gold">B2B Sourcing Support</h3>
              <p className="text-xs text-bg-cream/80 leading-relaxed font-light">
                Do you require specialized wholesale quotes or organic certificate document evaluations? Contact our exports office.
              </p>
              
              <div className="grid gap-2 mt-2">
                <Link
                  href="/inquiry"
                  className="w-full text-center bg-brand-gold hover:bg-brand-gold/90 text-brand-green py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider block"
                >
                  Send Inquiry Form
                </Link>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-bg-cream py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Sourcing
                </a>
              </div>
            </div>

          </aside>

        </div>
      </section>

    </div>
  );
}
