import type { Request } from 'express';
import type { User } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  userId?: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface OtpVerificationResult {
  isNewUser: boolean;
  user: User;
  tokens: TokenPair;
}
