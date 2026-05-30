import React from 'react';
import { executeQuery, Product, Category, Material, ProductType } from '@/lib/db';
import ProductsCatalogWrapper from '@/components/ProductsCatalogWrapper';

// Disable layout shell pre-rendering to run fully dynamic query selections
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Organic Valley Catalog | Kashmiri Organic Products Sourcing',
  description: 'Explore our catalog of authentic high-altitude Kashmiri organic products. Grade A+ Pampore Saffron, wild acacia honey, seasoned walnut bowls, and pure botanical oils.',
};

export default async function ProductsPage() {
  // Fetch data on the server using parameterized SQL database clients
  const products = await executeQuery<Product[]>('SELECT * FROM products');
  const categories = await executeQuery<Category[]>('SELECT * FROM categories');
  const materials = await executeQuery<Material[]>('SELECT * FROM materials');
  const productTypes = await executeQuery<ProductType[]>('SELECT * FROM product_types');

  return (
    <ProductsCatalogWrapper
      initialProducts={products}
      categories={categories}
      materials={materials}
      productTypes={productTypes}
    />
  );
}
