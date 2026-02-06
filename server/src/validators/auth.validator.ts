import { z } from 'zod';

const phoneRegex = /^\d{10,15}$/;
const countryCodeRegex = /^\+\d{1,4}$/;

export const sendOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Phone number must be 10-15 digits'),
  countryCode: z.string().regex(countryCodeRegex, 'Invalid country code format'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Phone number must be 10-15 digits'),
  countryCode: z.string().regex(countryCodeRegex, 'Invalid country code format'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Phone number must be 10-15 digits'),
  countryCode: z.string().regex(countryCodeRegex, 'Invalid country code format'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
