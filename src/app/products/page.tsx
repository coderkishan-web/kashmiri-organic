import React, { Suspense } from 'react';
import { executeQuery, Product, Category, Material, ProductType, getProductsWithRelations } from '@/lib/db';
import ProductsCatalogWrapper from '@/components/ProductsCatalogWrapper';

// Disable layout shell pre-rendering to run fully dynamic query selections
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Organic Valley Catalog | Kashmiri Organic Products Sourcing',
  description: 'Explore our catalog of authentic high-altitude Kashmiri organic products. Grade A+ Pampore Saffron, wild acacia honey, seasoned walnut bowls, and pure botanical oils.',
};

export default async function ProductsPage() {
  // Fetch data on the server using parameterized SQL database clients
  const allProducts = await getProductsWithRelations();
  const categories = await executeQuery<Category[]>('SELECT * FROM categories');
  const materials = await executeQuery<Material[]>('SELECT * FROM materials');
  const productTypes = await executeQuery<ProductType[]>('SELECT * FROM product_types');

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-mist flex items-center justify-center font-serif text-lg text-brand-green">
        Loading organic catalog...
      </div>
    }>
      <ProductsCatalogWrapper
        initialProducts={allProducts}
        categories={categories}
        materials={materials}
        productTypes={productTypes}
      />
    </Suspense>
  );
}
