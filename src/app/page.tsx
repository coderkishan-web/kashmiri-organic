import React from 'react';
import { executeQuery, Product, Category, Material, Blog, Testimonial, Certification } from '@/lib/db';
import HomeClientWrapper from '@/components/HomeClientWrapper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Kashmiri Organic | Premium Saffron, Honey, Walnut Wood, & Essential Oils',
  description: 'Welcome to Kashmiri Organic. Discover Grade A+ Pampore Saffron, wild Acacia honey, seasoned walnut bowls, and pure botanical oils. Direct from the Kashmir Valley.',
};

export default async function HomePage() {
  // Fetch seed data using raw SQL queries on the server side
  const products = await executeQuery<Product[]>('SELECT * FROM products');
  const categories = await executeQuery<Category[]>('SELECT * FROM categories');
  const materials = await executeQuery<Material[]>('SELECT * FROM materials');
  const blogs = await executeQuery<Blog[]>('SELECT * FROM blogs');
  const testimonials = await executeQuery<Testimonial[]>('SELECT * FROM testimonials');
  const certifications = await executeQuery<Certification[]>('SELECT * FROM certifications');

  return (
    <HomeClientWrapper
      products={products}
      categories={categories}
      materials={materials}
      blogs={blogs}
      testimonials={testimonials}
      certifications={certifications}
    />
  );
}
