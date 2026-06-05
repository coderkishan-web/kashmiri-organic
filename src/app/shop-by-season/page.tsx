import React, { Suspense } from 'react';
import { executeQuery, Product } from '@/lib/db';
import ShopBySeasonClient from '@/components/ShopBySeasonClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop by Season | Kashmiri Organic Terroir Cycles',
  description: 'Nature has its time. Savor each limited harvest at its absolute peak - Pampore Saffron, Forest Honey, and seasoned Walnut crafts.',
};

export default async function ShopBySeasonPage() {
  const products = await executeQuery<Product[]>('SELECT * FROM products');
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-serif text-lg text-[#1B3527]">
        Loading seasonal archive...
      </div>
    }>
      <ShopBySeasonClient initialProducts={products} />
    </Suspense>
  );
}
