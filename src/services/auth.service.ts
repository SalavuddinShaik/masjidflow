import { api } from './api';
import type { User, SignupData, TokenPair } from '../types/auth.types';

export type { User, SignupData } from '../types/auth.types';

export interface OtpResponse {
  expiresAt: string;
}

export interface VerifyOtpResponse {
  isNewUser: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async sendLoginOtp(phone: string, countryCode: string): Promise<OtpResponse> {
    return api.post<OtpResponse>('/auth/send-otp', { phone, countryCode });
  },

  async signup(data: SignupData): Promise<OtpResponse> {
    return api.post<OtpResponse>('/auth/signup', data);
  },

  async verifyOtp(phone: string, countryCode: string, otp: string): Promise<VerifyOtpResponse> {
    return api.post<VerifyOtpResponse>('/auth/verify-otp', { phone, countryCode, otp });
  },

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    return api.post<TokenPair>('/auth/refresh', { refreshToken });
  },

  async logout(refreshToken: string): Promise<void> {
    return api.post('/auth/logout', { refreshToken });
  },

  async getMe(): Promise<User> {
    return api.get<User>('/users/me');
  },

  async updateProfile(data: Partial<Pick<User, 'name' | 'email' | 'whatsappNumber' | 'address' | 'city' | 'state'>>): Promise<User> {
    return api.put<User>('/users/profile', data);
  },
};
