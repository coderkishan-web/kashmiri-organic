import React from 'react';
import { executeQuery, Product } from '@/lib/db';
import ShopBySeasonClient from '@/components/ShopBySeasonClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop by Season | Kashmiri Organic Terroir Cycles',
  description: 'Nature has its time. Savor each limited harvest at its absolute peak - Pampore Saffron, Forest Honey, and seasoned Walnut crafts.',
};

export default async function ShopBySeasonPage() {
  const products = await executeQuery<Product[]>('SELECT * FROM products');
  return <ShopBySeasonClient initialProducts={products} />;
}
