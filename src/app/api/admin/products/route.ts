import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, Product } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kashmiri-organic-valley-secret-key-2026';

// Helper to verify admin authority
async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.role !== 'super_admin') return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

// GET all products
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const products = await executeQuery<Product[]>('SELECT * FROM products');
    const benefits = await executeQuery<any[]>('SELECT * FROM benefits');
    const usage_types = await executeQuery<any[]>('SELECT * FROM usage_types');
    return NextResponse.json({ products, benefits, usage_types });
  } catch (err: any) {
    return NextResponse.json({ error: 'Query execution failed.' }, { status: 500 });
  }
}

// POST create product
export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      short_description,
      long_description,
      image_url,
      gallery_urls,
      price,
      discount_price,
      sku,
      stock,
      moq,
      packaging,
      shipping,
      availability,
      certified,
      export_quality,
      category_ids,
      material_ids,
      benefit_ids,
      usage_type_ids,
      sub_category,
      season,
      benefit_custom_descriptions,
      usage_type_custom_descriptions
    } = body;

    if (!name || !slug || !short_description || !long_description || !sku) {
      return NextResponse.json({ error: 'Core fields name, slug, short_desc, long_desc, and sku are required.' }, { status: 400 });
    }

    const sql = `
      INSERT INTO products (name, slug, short_description, long_description, image_url, gallery_urls, price, discount_price, sku, stock, moq, packaging, shipping, availability, certified, export_quality, sub_category, season)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name.trim(),
      slug.trim().toLowerCase(),
      short_description.trim(),
      long_description.trim(),
      image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      gallery_urls || JSON.stringify([]),
      price ? Number(price) : null,
      discount_price ? Number(discount_price) : null,
      sku.trim().toUpperCase(),
      stock ? Number(stock) : 0,
      moq || '1 kg',
      packaging || 'Glass jar',
      shipping || 'Air flight',
      availability || 'retail,bulk,export',
      certified ? 1 : 0,
      export_quality ? 1 : 0,
      sub_category ? sub_category.trim() : '',
      season || 'all'
    ];

    const result = await executeQuery<any>(sql, params);
    const productId = result.insertId;

    if (category_ids && Array.isArray(category_ids)) {
      for (const catId of category_ids) {
        await executeQuery('INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)', [productId, Number(catId)]);
      }
    }

    if (material_ids && Array.isArray(material_ids)) {
      for (const matId of material_ids) {
        await executeQuery('INSERT INTO product_materials (product_id, material_id) VALUES (?, ?)', [productId, Number(matId)]);
      }
    }

    if (benefit_ids && Array.isArray(benefit_ids)) {
      for (const benId of benefit_ids) {
        const desc = benefit_custom_descriptions?.[benId] || '';
        await executeQuery('INSERT INTO product_benefits (product_id, benefit_id, custom_description) VALUES (?, ?, ?)', [productId, Number(benId), desc]);
      }
    }

    if (usage_type_ids && Array.isArray(usage_type_ids)) {
      for (const useId of usage_type_ids) {
        const desc = usage_type_custom_descriptions?.[useId] || '';
        await executeQuery('INSERT INTO product_usage_types (product_id, usage_type_id, custom_description) VALUES (?, ?, ?)', [productId, Number(useId), desc]);
      }
    }

    return NextResponse.json({ success: true, insertId: productId }, { status: 201 });
  } catch (err: any) {
    console.error('Products insertion error:', err);
    return NextResponse.json({ error: 'SQL query failed.' }, { status: 500 });
  }
}

// PUT edit product
export async function PUT(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      short_description,
      long_description,
      image_url,
      gallery_urls,
      price,
      discount_price,
      sku,
      stock,
      moq,
      packaging,
      shipping,
      availability,
      certified,
      export_quality,
      category_ids,
      material_ids,
      benefit_ids,
      usage_type_ids,
      sub_category,
      season,
      benefit_custom_descriptions,
      usage_type_custom_descriptions
    } = body;

    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'Entity ID, name and slug are required to perform update.' }, { status: 400 });
    }

    const sql = `
      UPDATE products 
      SET name = ?, slug = ?, short_description = ?, long_description = ?, image_url = ?, gallery_urls = ?, price = ?, discount_price = ?, sku = ?, stock = ?, moq = ?, packaging = ?, shipping = ?, availability = ?, certified = ?, export_quality = ?, sub_category = ?, season = ?
      WHERE id = ?
    `;
    const params = [
      name.trim(),
      slug.trim().toLowerCase(),
      short_description.trim(),
      long_description.trim(),
      image_url,
      gallery_urls,
      price ? Number(price) : null,
      discount_price ? Number(discount_price) : null,
      sku.trim().toUpperCase(),
      stock ? Number(stock) : 0,
      moq,
      packaging,
      shipping,
      availability,
      certified ? 1 : 0,
      export_quality ? 1 : 0,
      sub_category ? sub_category.trim() : '',
      season || 'all',
      Number(id)
    ];

    await executeQuery(sql, params);

    if (category_ids && Array.isArray(category_ids)) {
      // Clear old entries
      await executeQuery('DELETE FROM product_categories WHERE product_id = ?', [Number(id)]);
      // Insert new ones
      for (const catId of category_ids) {
        await executeQuery('INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)', [Number(id), Number(catId)]);
      }
    }

    if (material_ids && Array.isArray(material_ids)) {
      // Clear old entries
      await executeQuery('DELETE FROM product_materials WHERE product_id = ?', [Number(id)]);
      // Insert new ones
      for (const matId of material_ids) {
        await executeQuery('INSERT INTO product_materials (product_id, material_id) VALUES (?, ?)', [Number(id), Number(matId)]);
      }
    }

    if (benefit_ids && Array.isArray(benefit_ids)) {
      // Clear old entries
      await executeQuery('DELETE FROM product_benefits WHERE product_id = ?', [Number(id)]);
      // Insert new ones
      for (const benId of benefit_ids) {
        const desc = benefit_custom_descriptions?.[benId] || '';
        await executeQuery('INSERT INTO product_benefits (product_id, benefit_id, custom_description) VALUES (?, ?, ?)', [Number(id), Number(benId), desc]);
      }
    }

    if (usage_type_ids && Array.isArray(usage_type_ids)) {
      // Clear old entries
      await executeQuery('DELETE FROM product_usage_types WHERE product_id = ?', [Number(id)]);
      // Insert new ones
      for (const useId of usage_type_ids) {
        const desc = usage_type_custom_descriptions?.[useId] || '';
        await executeQuery('INSERT INTO product_usage_types (product_id, usage_type_id, custom_description) VALUES (?, ?, ?)', [Number(id), Number(useId), desc]);
      }
    }

    return NextResponse.json({ success: true, message: 'Product updated successfully.' });
  } catch (err: any) {
    console.error('Products update error:', err);
    return NextResponse.json({ error: 'SQL query update failed.' }, { status: 500 });
  }
}

// DELETE delete product
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Administrative clearance required.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product target ID is required.' }, { status: 400 });
    }

    const sql = 'DELETE FROM products WHERE id = ?';
    await executeQuery(sql, [Number(id)]);

    return NextResponse.json({ success: true, message: 'Product deleted from catalog.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'SQL query deletion failed.' }, { status: 500 });
  }
}
