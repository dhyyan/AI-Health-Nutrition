export interface IEmailService {
  sendOTP(email: string, otp: string, name: string): Promise<boolean>;
  sendPasswordResetOTP(email: string, otp: string, name: string): Promise<boolean>;
}
