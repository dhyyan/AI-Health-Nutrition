export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  isVerified?: boolean;
  verificationOtp?: string | null;
  otpExpiresAt?: Date | null;
  resetPasswordOtp?: string | null;
  resetPasswordExpiresAt?: Date | null;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public id?: string;
  public name: string;
  public email: string;
  public passwordHash: string;
  public role: UserRole;
  public isVerified: boolean;
  public verificationOtp: string | null;
  public otpExpiresAt: Date | null;
  public resetPasswordOtp: string | null;
  public resetPasswordExpiresAt: Date | null;
  public status: UserStatus;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email.toLowerCase().trim();
    this.passwordHash = props.passwordHash;
    this.role = props.role || 'user';
    this.isVerified = props.isVerified || false;
    this.verificationOtp = props.verificationOtp || null;
    this.otpExpiresAt = props.otpExpiresAt || null;
    this.resetPasswordOtp = props.resetPasswordOtp || null;
    this.resetPasswordExpiresAt = props.resetPasswordExpiresAt || null;
    this.status = props.status || 'active';
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
