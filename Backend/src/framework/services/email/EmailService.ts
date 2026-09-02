import { IEmailService } from '../../../domain/interfaces/services/IEmailService';

export class EmailService implements IEmailService {
  async sendOTP(email: string, otp: string, name: string): Promise<boolean> {
    console.log(`\n==================================================`);
    console.log(`🔑 [NUTRI-AI ACCOUNT VERIFICATION OTP]`);
    console.log(`Target Email Account : ${email}`);
    console.log(`Recipient Name       : ${name}`);
    console.log(`Verification Code    : 👉 [ ${otp} ] 👈`);
    console.log(`Expires In          : 10 Minutes`);
    console.log(`==================================================\n`);
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
    return true;
  }
}
