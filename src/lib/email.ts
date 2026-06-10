import nodemailer from 'nodemailer';

export interface EmailConfig {
  provider: 'smtp' | 'none';
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
}

export function getEmailConfig(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER || 'none').toLowerCase() as 'smtp' | 'none';
  
  return {
    provider,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || '"Kashmiri Organic" <no-reply@kashmiriorganic.com>',
  };
}

/**
 * Dispatches the verification code to the customer's email.
 * Supports SMTP transport or fallback terminal logs.
 */
export async function sendVerificationEmail(toEmail: string, otp: string): Promise<boolean> {
  const config = getEmailConfig();

  if (config.provider !== 'smtp') {
    console.log('\n============================================================');
    console.log(`[EMAIL SIMULATION] Sending OTP: ${otp} to email: ${toEmail}`);
    console.log('============================================================\n');
    return true;
  }

  if (!config.host || !config.user || !config.pass) {
    console.error('[email] SMTP configured but missing required details (host/user/pass).');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // true for 465, false for other ports (like 587)
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const mailOptions = {
      from: config.from,
      to: toEmail,
      subject: `${otp} is your Kashmiri Organic Verification Code`,
      text: `Your Kashmiri Organic verification code is: ${otp}. This code is valid for 5 minutes. If you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF8F5; color: #1B3527; border: 1px solid rgba(47, 79, 62, 0.1); border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1B3527; font-size: 28px; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">Kashmiri Organic</h1>
            <p style="color: #C5A880; font-size: 10px; text-transform: uppercase; tracking-widest; margin: 5px 0 0 0; font-weight: bold; font-family: sans-serif;">Pure Sourcing Coordinates</p>
          </div>
          
          <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(27, 53, 39, 0.02); border: 1px solid rgba(27, 53, 39, 0.05);">
            <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #1B3527; font-family: sans-serif;">Dear Customer,</p>
            <p style="font-size: 14px; line-height: 1.6; color: #1B3527; font-family: sans-serif;">To complete your authentication and secure your sourcing profile, please enter the following verification code:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 0.15em; color: #1B3527; background-color: #FAF8F5; padding: 12px 30px; border-radius: 8px; border: 1px dashed #C5A880; display: inline-block;">${otp}</span>
            </div>
            
            <p style="font-size: 12px; color: #1B3527/60; line-height: 1.5; font-family: sans-serif; margin-bottom: 0;">This code is valid for 5 minutes. For security, do not share this code with anyone.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #1B3527; opacity: 0.6; font-family: sans-serif;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Kashmiri Organic. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">High-Altitude Botanical and Craft Sourcing</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[email] Verification email successfully sent to ${toEmail}. MessageId: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error('[email] Failed to send verification email via SMTP:', error?.message ?? error);
    return false;
  }
}

/**
 * Dispatches a detailed order confirmation / payment success email to the customer.
 * Displays purchased items list, pricing summary, and shipping coordinates.
 */
export async function sendOrderConfirmationEmail(toEmail: string, order: any): Promise<boolean> {
  const config = getEmailConfig();

  // Safely parse items and shipping address
  let parsedItems: any[] = [];
  try {
    parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
  } catch (e) {
    console.error('[email] Failed parsing order items JSON', e);
  }

  let parsedAddress: any = {};
  try {
    parsedAddress = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : (order.shipping_address || {});
  } catch (e) {
    console.error('[email] Failed parsing shipping address JSON', e);
  }

  const orderId = order.id || 'N/A';
  const userName = order.user_name || parsedAddress.name || 'Valued Customer';
  const totalAmount = Number(order.total_amount || 0);
  const discountAmount = Number(order.discount_amount || 0);
  const couponCode = order.coupon_code || null;
  const shippingFee = 350; // Flat fee matching checkout API

  // Calculate subtotal from items if available
  const subtotal = parsedItems.reduce((sum, item) => sum + (Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1)), 0);

  // Generate HTML table for items
  let itemsHtml = '';
  parsedItems.forEach((item: any) => {
    const name = item.name || 'Kashmiri Sourced Item';
    const qty = item.quantity || 1;
    const price = Number(item.unitPrice || item.price || 0);
    const lineTotal = price * qty;
    itemsHtml += `
      <tr>
        <td style="padding: 12px 0; border-b: 1px solid rgba(27, 53, 39, 0.08); font-family: sans-serif; font-size: 13px; color: #1B3527;">
          <div style="font-weight: 600;">${name}</div>
          <div style="font-size: 11px; color: #8A968E; margin-top: 2px;">Qty: ${qty} &times; ₹${price.toLocaleString('en-IN')}</div>
        </td>
        <td style="padding: 12px 0; border-b: 1px solid rgba(27, 53, 39, 0.08); font-family: sans-serif; font-size: 13px; font-weight: 600; color: #1B3527; text-align: right; vertical-align: bottom;">
          ₹${lineTotal.toLocaleString('en-IN')}
        </td>
      </tr>
    `;
  });

  const emailHtml = `
    <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAF8F5; color: #1B3527; border: 1px solid rgba(47, 79, 62, 0.1); border-radius: 16px;">
      
      <!-- Luxury Brand Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1B3527; font-size: 28px; margin: 0; letter-spacing: 0.05em; text-transform: uppercase;">Kashmiri Organic</h1>
        <p style="color: #C5A880; font-size: 10px; text-transform: uppercase; tracking-widest; margin: 5px 0 0 0; font-weight: bold; font-family: sans-serif;">Pure Sourcing Coordinates</p>
      </div>

      <!-- Main Receipt Card -->
      <div style="background-color: #FFFFFF; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(27, 53, 39, 0.02); border: 1px solid rgba(27, 53, 39, 0.05);">
        
        <div style="text-align: center; margin-bottom: 25px;">
          <div style="display: inline-block; background-color: #E8F5E9; color: #2E7D32; font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; letter-spacing: 0.1em;">
            Payment Confirmed
          </div>
          <h2 style="font-size: 20px; font-weight: bold; color: #1B3527; margin: 15px 0 5px 0;">Thank You For Your Order</h2>
          <p style="font-family: sans-serif; font-size: 12px; color: #8A968E; margin: 0;">We have received your payment and are preparing your shipment.</p>
        </div>

        <div style="border-top: 1px solid rgba(27, 53, 39, 0.1); border-bottom: 1px solid rgba(27, 53, 39, 0.1); padding: 15px 0; margin-bottom: 25px; font-family: sans-serif; font-size: 11px;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #8A968E;">Order ID:</td>
              <td style="text-align: right; font-weight: bold; color: #1B3527; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="color: #8A968E; padding-top: 5px;">Recipient:</td>
              <td style="text-align: right; font-weight: bold; color: #1B3527; padding-top: 5px;">${userName}</td>
            </tr>
            <tr>
              <td style="color: #8A968E; padding-top: 5px;">Payment Method:</td>
              <td style="text-align: right; font-weight: bold; color: #1B3527; padding-top: 5px; text-transform: uppercase;">${order.payment_method || 'stripe_card'}</td>
            </tr>
          </table>
        </div>

        <!-- Line Items -->
        <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em; color: #1B3527; border-bottom: 1px solid rgba(27, 53, 39, 0.1); padding-bottom: 8px;">Items Purchased</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          ${itemsHtml}
        </table>

        <!-- Pricing Summary -->
        <div style="background-color: #FAF8F5; padding: 15px; border-radius: 8px; border: 1px solid rgba(27, 53, 39, 0.03); font-family: sans-serif; font-size: 12px;">
          <table style="width: 100%;">
            <tr>
              <td style="color: #8A968E; padding-bottom: 6px;">Subtotal:</td>
              <td style="text-align: right; color: #1B3527; padding-bottom: 6px;">₹${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${discountAmount > 0 ? `
            <tr>
              <td style="color: #C62828; padding-bottom: 6px; font-weight: bold;">Promo Discount ${couponCode ? `(${couponCode})` : ''}:</td>
              <td style="text-align: right; color: #C62828; padding-bottom: 6px; font-weight: bold;">- ₹${discountAmount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="color: #8A968E; padding-bottom: 6px;">Packaging & Dispatch:</td>
              <td style="text-align: right; color: #1B3527; padding-bottom: 6px;">₹${shippingFee.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="font-size: 14px; font-weight: bold; border-top: 1px solid rgba(27, 53, 39, 0.08);">
              <td style="color: #1B3527; padding-top: 10px;">Total Paid:</td>
              <td style="text-align: right; color: #1B3527; padding-top: 10px; font-size: 16px;">₹${totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Coordinates -->
        <h3 style="font-size: 14px; font-weight: bold; margin: 25px 0 10px 0; text-transform: uppercase; letter-spacing: 0.05em; color: #1B3527; border-bottom: 1px solid rgba(27, 53, 39, 0.1); padding-bottom: 8px;">Shipping Coordinates</h3>
        <div style="font-family: sans-serif; font-size: 12px; color: #1B3527; line-height: 1.6;">
          <div style="font-weight: bold;">${parsedAddress.name || userName}</div>
          <div>${parsedAddress.address || ''}</div>
          <div>${parsedAddress.city || ''} ${parsedAddress.pinCode ? `- ${parsedAddress.pinCode}` : ''}</div>
          <div style="text-transform: uppercase; font-size: 11px; color: #8A968E; font-weight: bold; margin-top: 2px;">${parsedAddress.country || 'India'}</div>
        </div>

      </div>

      <!-- Footer Sign-off -->
      <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #1B3527; opacity: 0.6; font-family: sans-serif; line-height: 1.5;">
        <p style="margin: 0;">Thank you for supporting high-altitude sustainable botanical and craft sourcing.</p>
        <p style="margin: 5px 0 0 0;">&copy; ${new Date().getFullYear()} Kashmiri Organic. All rights reserved.</p>
      </div>

    </div>
  `;

  if (config.provider !== 'smtp') {
    console.log('\n============================================================');
    console.log(`[EMAIL SIMULATION] Sending Order Success Email to: ${toEmail}`);
    console.log(`Order ID:     ${orderId}`);
    console.log(`Total Amount: ₹${totalAmount.toLocaleString('en-IN')}`);
    console.log(`Items Count:  ${parsedItems.length}`);
    console.log('============================================================\n');
    return true;
  }

  if (!config.host || !config.user || !config.pass) {
    console.error('[email] SMTP configured but missing required details (host/user/pass).');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const mailOptions = {
      from: config.from,
      to: toEmail,
      subject: `Order Confirmed: ${orderId} — Kashmiri Organic`,
      text: `Thank you for your order! Your order ${orderId} has been confirmed. Total Paid: ₹${totalAmount.toLocaleString('en-IN')}.`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[email] Order success email successfully sent to ${toEmail}. MessageId: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error('[email] Failed to send order success email via SMTP:', error?.message ?? error);
    return false;
  }
}

