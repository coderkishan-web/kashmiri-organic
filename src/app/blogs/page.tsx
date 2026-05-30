import React from 'react';
import Link from 'next/link';
import { executeQuery, Blog } from '@/lib/db';
import { BookOpen, Calendar, User, ArrowRight, Tag, Compass } from 'lucide-react';

interface BlogsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  // Await search params for Next.js 15+/16 compatibility
  const params = await searchParams;
  const activeCategory = params.category || '';

  // Fetch blogs
  const blogs = await executeQuery<Blog[]>('SELECT * FROM blogs');

  // Filter blogs by active category if clicked
  const filteredBlogs = activeCategory
    ? blogs.filter(b => b.category.toLowerCase().replace(' ', '-') === activeCategory)
    : blogs;

  // Blog categories list
  const categoriesList = [
    { name: 'All Chronicles', slug: '' },
    { name: 'Organic Living', slug: 'organic-living' },
    { name: 'Natural Living', slug: 'natural-living' },
  ];

  // Blog image mapping
  const blogImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1508747703725-719ae2c98295?auto=format&fit=crop&w=1200&q=80',
    2: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1200&q=80',
  };

  // Find the featured (newest) blog
  const featuredBlog = blogs.find(b => b.status === 'published');
  const otherBlogs = filteredBlogs.filter(b => b.id !== featuredBlog?.id);

  return (
    <div className="flex flex-col min-h-screen bg-bg-mist">
      
      {/* 1. Page Header */}
      <section className="bg-brand-green text-bg-cream py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="font-serif text-[18vw] font-bold select-none leading-none absolute -bottom-10 right-0">Editorial</span>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-2 block">
            Science & Storytelling
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-bg-cream mb-4">
            Kashmiri Agricultural Diaries
          </h1>
          <p className="text-sm sm:text-base text-bg-cream/80 max-w-2xl font-light leading-relaxed">
            Read about Pampore harvesting journals, the chemistry of pure active saffron crocin, and the traditional seasoning methods of walnut woodcarvers.
          </p>
        </div>
      </section>

      {/* 2. Main CMS Feed */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        
        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-brand-green/5">
          {categoriesList.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.slug ? `/blogs?category=${cat.slug}` : '/blogs'}
              className={`text-xs uppercase font-bold tracking-wider px-4 py-2.5 rounded-full transition-colors ${
                (cat.slug === activeCategory)
                  ? 'bg-brand-green text-bg-cream shadow-sm'
                  : 'bg-bg-cream text-text-secondary border border-brand-green/5 hover:bg-bg-beige/50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Featured Blog Header Card (Only on default view) */}
        {!activeCategory && featuredBlog && (
          <div className="bg-bg-cream rounded-3xl overflow-hidden border border-brand-green/5 luxury-shadow mb-16 grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Image (Left) */}
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-auto overflow-hidden bg-bg-mist">
              <img
                src={blogImages[featuredBlog.id] || featuredBlog.featured_image}
                alt={featuredBlog.title}
                className="absolute inset-0 w-full h-full object-cover hover:scale-102 transition-transform duration-700"
              />
            </div>
            
            {/* Text details (Right) */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                  Featured Chronicle — {featuredBlog.category}
                </span>
                
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green hover:text-brand-gold transition-colors leading-tight">
                  <Link href={`/blogs/${featuredBlog.slug}`}>{featuredBlog.title}</Link>
                </h2>
                
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-light line-clamp-4">
                  {featuredBlog.seo_description}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {featuredBlog.tags.split(',').map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-[10px] bg-bg-mist text-text-secondary px-2.5 py-1 rounded-full border border-brand-green/5">
                      <Tag className="w-2.5 h-2.5 text-brand-gold" /> {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-brand-green/5 pt-6 mt-8 flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-brown" /> <span>{featuredBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-sage" /> <span>{featuredBlog.publish_date}</span>
                  </div>
                </div>
                
                <Link
                  href={`/blogs/${featuredBlog.slug}`}
                  className="font-bold text-brand-green hover:text-brand-gold flex items-center gap-0.5 group"
                >
                  Read Diary <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Other Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(activeCategory ? filteredBlogs : otherBlogs).map((blog) => (
            <article
              key={blog.id}
              className="bg-bg-cream rounded-2xl overflow-hidden border border-brand-green/5 luxury-shadow luxury-shadow-hover flex flex-col justify-between"
            >
              {/* Media Frame */}
              <div className="relative aspect-video overflow-hidden bg-bg-mist border-b border-brand-green/5">
                <img
                  src={blogImages[blog.id] || blog.featured_image}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Content Panel */}
              <div className="p-6 flex flex-col flex-grow justify-between gap-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold block mb-2">
                    {blog.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-brand-green leading-snug hover:text-brand-gold transition-colors line-clamp-2">
                    <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <p className="text-xs text-text-secondary font-light mt-2 line-clamp-3 leading-relaxed">
                    {blog.seo_description}
                  </p>
                </div>
                
                <div className="border-t border-brand-green/5 pt-4 flex items-center justify-between text-[11px] text-text-muted mt-auto">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-sage shrink-0" />
                    <span>{blog.publish_date}</span>
                  </div>
                  
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="font-bold text-brand-green hover:underline flex items-center gap-0.5 group/btn"
                  >
                    Read Story <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state when no blogs match category */}
        {(activeCategory ? filteredBlogs : otherBlogs).length === 0 && (
          <div className="bg-bg-cream rounded-3xl p-12 text-center border border-brand-green/10 luxury-shadow flex flex-col items-center gap-4 py-20">
            <BookOpen className="w-12 h-12 text-brand-gold" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green">No Diaries Found</h3>
            <p className="text-sm text-text-secondary font-light max-w-sm leading-relaxed">
              We currently do not have harvest logs registered under this specific category filter.
            </p>
            <Link
              href="/blogs"
              className="mt-2 bg-brand-green hover:bg-brand-green/90 text-bg-cream px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Clear Filter
            </Link>
          </div>
        )}

      </section>

      {/* 3. Bottom Educational Call */}
      <section className="py-16 bg-brand-green text-bg-cream text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <Compass className="w-10 h-10 text-brand-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bg-cream mb-4">
            Curious about our organic farming methods?
          </h2>
          <p className="text-xs sm:text-sm text-bg-cream/80 font-light leading-relaxed mb-6 max-w-md mx-auto">
            Our teams compile micro-chemical reports, crop cycles, and ecological audits to guarantee total botanical integrity.
          </p>
          <Link
            href="/about"
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-green font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl inline-block"
          >
            Read Our Organic Philosophy
          </Link>
        </div>
      </section>

    </div>
  );
}
