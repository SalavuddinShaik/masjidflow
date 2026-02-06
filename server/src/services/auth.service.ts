import { OtpPurpose } from '@prisma/client';
import { otpService } from './otp.service.js';
import { userService } from './user.service.js';
import { tokenService } from './token.service.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import type { SignupData, OtpVerificationResult, TokenPair } from '../types/index.js';

export const authService = {
  async sendLoginOtp(phone: string, countryCode: string) {
    // Check if user exists
    const user = await userService.findByPhone(phone, countryCode);
    if (!user) {
      throw new NotFoundError(
        'No account found with this phone number. Please sign up first.',
        'USER_NOT_FOUND'
      );
    }

    return otpService.sendOtp(phone, countryCode, OtpPurpose.LOGIN, undefined, user.id);
  },

  async sendSignupOtp(signupData: SignupData) {
    // Check if user already exists
    const existingByPhone = await userService.findByPhone(signupData.phone, signupData.countryCode);
    if (existingByPhone) {
      throw new BadRequestError('An account with this phone number already exists. Please login.');
    }

    const existingByEmail = await userService.findByEmail(signupData.email);
    if (existingByEmail) {
      throw new BadRequestError('An account with this email already exists.');
    }

    return otpService.sendOtp(
      signupData.phone,
      signupData.countryCode,
      OtpPurpose.SIGNUP,
      signupData
    );
  },

  async verifyOtp(
    phone: string,
    countryCode: string,
    otp: string
  ): Promise<OtpVerificationResult> {
    const { purpose, signupData, userId } = await otpService.verifyOtp(phone, countryCode, otp);

    let user;
    let isNewUser = false;

    if (purpose === OtpPurpose.SIGNUP && signupData) {
      // Create new user from signup data
      user = await userService.create(signupData);
      isNewUser = true;
    } else if (purpose === OtpPurpose.LOGIN && userId) {
      // Get existing user
      user = await userService.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      // Mark phone as verified if not already
      if (!user.isPhoneVerified) {
        user = await userService.markPhoneVerified(user.id);
      }
    } else {
      // Fallback: try to find user by phone
      user = await userService.findByPhone(phone, countryCode);
      if (!user) {
        throw new BadRequestError('Unable to complete verification. Please try signing up again.');
      }
    }

    // Generate tokens
    const tokens = await tokenService.generateTokenPair(user.id);

    return {
      isNewUser,
      user,
      tokens,
    };
  },

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    return tokenService.refreshTokens(refreshToken);
  },

  async logout(refreshToken: string): Promise<void> {
    await tokenService.revokeRefreshToken(refreshToken);
  },

  async logoutAll(userId: string): Promise<void> {
    await tokenService.revokeAllUserTokens(userId);
  },
};
