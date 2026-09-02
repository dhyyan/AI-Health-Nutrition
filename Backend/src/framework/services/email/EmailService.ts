import { IEmailService } from '../../../domain/interfaces/services/IEmailService';

export class EmailService implements IEmailService {
  async sendOTP(email: string, otp: string, name: string): Promise<boolean> {
    console.log(`\n==================================================`);
    console.log(`📧 [EMAIL OTP SENT]`);
    console.log(`To: ${name} <${email}>`);
    console.log(`Subject: NutriAI Account Verification OTP`);
    console.log(`Your Verification Code is: 👉 ${otp} 👈 (Expires in 10 minutes)`);
    console.log(`==================================================\n`);
    return true;
  }

  async sendPasswordResetOTP(email: string, otp: string, name: string): Promise<boolean> {
    console.log(`\n==================================================`);
    console.log(`📧 [PASSWORD RESET OTP SENT]`);
    console.log(`To: ${name} <${email}>`);
    console.log(`Subject: NutriAI Password Reset Request`);
    console.log(`Your Password Reset Code is: 👉 ${otp} 👈 (Expires in 10 minutes)`);
    console.log(`==================================================\n`);
    return true;
  }
}
