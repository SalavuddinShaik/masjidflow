export interface SignupData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface LoginData {
  phone: string;
  countryCode: string;
}

export interface OtpVerificationData {
  phone: string;
  countryCode: string;
  otp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  whatsappNumber?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  createdAt?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
