import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    let name = '';
    let email = '';
    let phone = '';
    let companyName = '';
    let inquiryType = 'contact';
    let message = '';
    let productId: number | null = null;
    let redirectUrl = '';

    // Check if content-type is form data (classic HTML form submissions)
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      name = formData.get('name') as string || '';
      email = formData.get('email') as string || '';
      phone = formData.get('phone') as string || '';
      companyName = formData.get('company_name') as string || '';
      inquiryType = formData.get('inquiry_type') as string || 'contact';
      message = formData.get('message') as string || '';
      
      const prodIdStr = formData.get('product_id');
      productId = prodIdStr ? Number(prodIdStr) : null;
      
      redirectUrl = formData.get('redirect') as string || '';
      
      // Fallback message capture if additional fields exist
      const additionalMsg = formData.get('additional_message') as string;
      if (additionalMsg) {
        message += `\n\n[Additional specifications / Sourcing details]:\n${additionalMsg}`;
      }
    } else {
      // JSON payload
      const body = await req.json();
      name = body.name || '';
      email = body.email || '';
      phone = body.phone || '';
      companyName = body.companyName || '';
      inquiryType = body.inquiryType || 'contact';
      message = body.message || '';
      productId = body.productId ? Number(body.productId) : null;
      redirectUrl = body.redirect || '';
    }

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Fields [name, email, phone, message] are strictly required.' },
        { status: 400 }
      );
    }

    // Execute raw SQL query insertion
    const sql = `
      INSERT INTO inquiries (name, email, phone, company_name, inquiry_type, message, product_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      name.trim(),
      email.trim(),
      phone.trim(),
      companyName.trim(),
      inquiryType,
      message.trim(),
      productId
    ];

    await executeQuery(sql, params);

    // If redirected by classic form, redirect back with success parameters
    if (redirectUrl) {
      const url = new URL(redirectUrl, req.url);
      url.searchParams.set('submitted', 'true');
      return NextResponse.redirect(url.toString(), 303);
    }

    return NextResponse.json(
      { success: true, message: 'Your organic sourcing inquiry has been successfully logged.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Inquiry logging failed:', error);
    return NextResponse.json(
      { error: 'Database transaction failed. Please retry.' },
      { status: 500 }
    );
  }
}

// Handle CORS or Preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
