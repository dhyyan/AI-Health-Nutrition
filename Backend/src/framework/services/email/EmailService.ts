import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from '../../../domain/interfaces/services/IEmailService';
import { CONFIG } from '../../../shared/constants/config';

export class EmailService implements IEmailService {
  private transporter: Transporter | null = null;

  constructor() {
    if (CONFIG.SMTP_USER && CONFIG.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: CONFIG.SMTP_HOST,
        port: CONFIG.SMTP_PORT,
        secure: CONFIG.SMTP_PORT === 465,
        auth: {
          user: CONFIG.SMTP_USER,
          pass: CONFIG.SMTP_PASS,
        },
      });
    }
  }

  private async sendViaBrevo(toEmail: string, toName: string, subject: string, htmlContent: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': CONFIG.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: CONFIG.SENDER_NAME,
            email: CONFIG.SENDER_EMAIL,
          },
          to: [
            {
              email: toEmail,
              name: toName || toEmail.split('@')[0],
            },
          ],
          subject: subject,
          htmlContent: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`⚠️ Brevo API Error (${response.status}):`, JSON.stringify(errorData));
        return false;
      }

      const resData = await response.json();
      console.log(`✅ Brevo API email successfully sent to ${toEmail} (MessageId: ${resData.messageId || 'OK'})`);
      return true;
    } catch (err: any) {
      console.error(`⚠️ Brevo API HTTP dispatch error:`, err.message || err);
      return false;
    }
  }

  async sendOTP(email: string, otp: string, name: string): Promise<boolean> {
    console.log(`\n==================================================`);
    console.log(`🔑 [NUTRI-AI ACCOUNT VERIFICATION OTP]`);
    console.log(`Target Email Account : ${email}`);
    console.log(`Recipient Name       : ${name}`);
    console.log(`Verification Code    : 👉 [ ${otp} ] 👈`);
    console.log(`Expires In          : 10 Minutes`);
    console.log(`==================================================\n`);

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #059669; font-size: 24px; font-weight: 800; margin: 0;">Nutri<span style="color: #0284c7;">AI</span></h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Personalized Health & Nutrition Assistant</p>
        </div>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; text-align: center;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Email Verification Code</h3>
          <p style="color: #475569; font-size: 14px;">Hello <strong>${name}</strong>, use the verification code below to complete your account registration:</p>
          
          <div style="background-color: #059669; color: #ffffff; font-size: 32px; font-weight: 800; tracking-spacing: 6px; padding: 16px 24px; border-radius: 10px; display: inline-block; margin: 16px 0;">
            ${otp}
          </div>
          
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} NutriAI Health Systems. All rights reserved.
        </div>
      </div>
    `;

    // 1. Try Brevo REST API over HTTPS (Compatible with Render outbound HTTP)
    if (CONFIG.BREVO_API_KEY) {
      console.log(`🚀 Dispatching email via Brevo REST API...`);
      const success = await this.sendViaBrevo(email, name, `${otp} is your NutriAI Verification Code`, htmlContent);
      if (success) return true;
    }

    // 2. Fallback to Nodemailer SMTP if configured
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: CONFIG.SMTP_FROM,
          to: email,
          subject: `${otp} is your NutriAI Verification Code`,
          html: htmlContent,
        });
        console.log(`✅ Nodemailer email successfully dispatched to ${email}`);
        return true;
      } catch (err: any) {
        console.error(`⚠️ Nodemailer dispatch error to ${email}:`, err.message || err);
      }
    }

    if (!CONFIG.BREVO_API_KEY && !this.transporter) {
      console.log(`ℹ️ No BREVO_API_KEY or SMTP credentials set in .env. Code logged to console above for local testing.`);
    }

    return true;
  }

  async sendPasswordResetOTP(email: string, otp: string, name: string): Promise<boolean> {
    console.log(`\n==================================================`);
    console.log(`🔑 [NUTRI-AI PASSWORD RESET OTP]`);
    console.log(`Target Email Account : ${email}`);
    console.log(`Recipient Name       : ${name}`);
    console.log(`Reset Code           : 👉 [ ${otp} ] 👈`);
    console.log(`Expires In          : 10 Minutes`);
    console.log(`==================================================\n`);

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #059669; font-size: 24px; font-weight: 800; margin: 0;">Nutri<span style="color: #0284c7;">AI</span></h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Personalized Health & Nutrition Assistant</p>
        </div>
        
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px; text-align: center;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Password Reset Code</h3>
          <p style="color: #475569; font-size: 14px;">Hello <strong>${name}</strong>, we received a request to reset your password. Use the code below:</p>
          
          <div style="background-color: #7c3aed; color: #ffffff; font-size: 32px; font-weight: 800; tracking-spacing: 6px; padding: 16px 24px; border-radius: 10px; display: inline-block; margin: 16px 0;">
            ${otp}
          </div>
          
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">This code expires in <strong>10 minutes</strong>. If you did not request a password reset, ignore this email.</p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 12px;">
          &copy; ${new Date().getFullYear()} NutriAI Health Systems. All rights reserved.
        </div>
      </div>
    `;

    // 1. Try Brevo REST API over HTTPS (Compatible with Render outbound HTTP)
    if (CONFIG.BREVO_API_KEY) {
      console.log(`🚀 Dispatching email via Brevo REST API...`);
      const success = await this.sendViaBrevo(email, name, `${otp} is your NutriAI Password Reset Code`, htmlContent);
      if (success) return true;
    }

    // 2. Fallback to Nodemailer SMTP if configured
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: CONFIG.SMTP_FROM,
          to: email,
          subject: `${otp} is your NutriAI Password Reset Code`,
          html: htmlContent,
        });
        console.log(`✅ Nodemailer reset password email successfully dispatched to ${email}`);
        return true;
      } catch (err: any) {
        console.error(`⚠️ Nodemailer dispatch error to ${email}:`, err.message || err);
      }
    }

    if (!CONFIG.BREVO_API_KEY && !this.transporter) {
      console.log(`ℹ️ No BREVO_API_KEY or SMTP credentials set in .env. Code logged to console above for local testing.`);
    }

    return true;
  }
}

