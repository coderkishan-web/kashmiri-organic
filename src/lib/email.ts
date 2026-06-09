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
