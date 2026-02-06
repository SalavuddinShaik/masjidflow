import bcrypt from 'bcrypt';
import { PrismaClient, OtpPurpose } from '@prisma/client';
import { config } from '../config/index.js';
import { smsService } from './sms.service.js';
import { BadRequestError, TooManyRequestsError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import type { SignupData } from '../types/index.js';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

function generateOtp(): string {
  const digits = config.otp.length;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export const otpService = {
  async sendOtp(
    phone: string,
    countryCode: string,
    purpose: OtpPurpose = OtpPurpose.LOGIN,
    signupData?: SignupData,
    userId?: string
  ): Promise<{ success: boolean; expiresAt: Date }> {
    // Check for recent OTP requests (cooldown)
    const recentRequest = await prisma.otpRequest.findFirst({
      where: {
        phone,
        countryCode,
        isUsed: false,
        createdAt: {
          gte: new Date(Date.now() - config.otp.resendCooldownSeconds * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentRequest) {
      const waitTime = Math.ceil(
        (config.otp.resendCooldownSeconds * 1000 -
          (Date.now() - recentRequest.createdAt.getTime())) /
          1000
      );
      throw new TooManyRequestsError(
        `Please wait ${waitTime} seconds before requesting another OTP`
      );
    }

    // Generate OTP
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + config.otp.expiresInMinutes * 60 * 1000);

    // Mark any existing unused OTPs as used
    await prisma.otpRequest.updateMany({
      where: {
        phone,
        countryCode,
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // Create new OTP request
    await prisma.otpRequest.create({
      data: {
        phone,
        countryCode,
        otpHash,
        purpose,
        signupData: signupData ? JSON.parse(JSON.stringify(signupData)) : null,
        expiresAt,
        userId,
      },
    });

    // Send OTP via SMS
    const sent = await smsService.sendOtp(phone, countryCode, otp);
    if (!sent) {
      throw new BadRequestError('Failed to send OTP. Please try again.');
    }

    // Log OTP in development for testing
    if (config.env === 'development') {
      logger.info(`OTP for ${countryCode}${phone}: ${otp}`);
    }

    return { success: true, expiresAt };
  },

  async verifyOtp(
    phone: string,
    countryCode: string,
    otp: string
  ): Promise<{ valid: boolean; purpose: OtpPurpose; signupData: SignupData | null; userId: string | null }> {
    // Find the latest unused OTP for this phone
    const otpRequest = await prisma.otpRequest.findFirst({
      where: {
        phone,
        countryCode,
        isUsed: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRequest) {
      throw new BadRequestError('No valid OTP found. Please request a new one.', 'OTP_NOT_FOUND');
    }

    // Check max attempts
    if (otpRequest.attempts >= config.otp.maxAttempts) {
      await prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: { isUsed: true },
      });
      throw new TooManyRequestsError('Maximum OTP attempts exceeded. Please request a new code.');
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpRequest.otpHash);

    if (!isValid) {
      await prisma.otpRequest.update({
        where: { id: otpRequest.id },
        data: { attempts: otpRequest.attempts + 1 },
      });
      const remainingAttempts = config.otp.maxAttempts - otpRequest.attempts - 1;
      throw new BadRequestError(
        `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
        'INVALID_OTP'
      );
    }

    // Mark OTP as used
    await prisma.otpRequest.update({
      where: { id: otpRequest.id },
      data: { isUsed: true },
    });

    return {
      valid: true,
      purpose: otpRequest.purpose,
      signupData: otpRequest.signupData as SignupData | null,
      userId: otpRequest.userId,
    };
  },
};
