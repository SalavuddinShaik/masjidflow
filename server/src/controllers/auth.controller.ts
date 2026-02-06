import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import type {
  SendOtpInput,
  VerifyOtpInput,
  SignupInput,
  RefreshTokenInput,
  LogoutInput,
} from '../validators/auth.validator.js';

export const authController = {
  async sendOtp(req: Request<{}, {}, SendOtpInput>, res: Response, next: NextFunction) {
    try {
      const { phone, countryCode } = req.body;
      const result = await authService.sendLoginOtp(phone, countryCode);
      res.json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async verifyOtp(req: Request<{}, {}, VerifyOtpInput>, res: Response, next: NextFunction) {
    try {
      const { phone, countryCode, otp } = req.body;
      const result = await authService.verifyOtp(phone, countryCode, otp);

      // Set refresh token as HttpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          isNewUser: result.isNewUser,
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            countryCode: result.user.countryCode,
            isPhoneVerified: result.user.isPhoneVerified,
            isProfileComplete: result.user.isProfileComplete,
          },
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken, // Also in body for mobile clients
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async signup(req: Request<{}, {}, SignupInput>, res: Response, next: NextFunction) {
    try {
      const signupData = req.body;
      const result = await authService.sendSignupOtp(signupData);
      res.json({
        success: true,
        message: 'OTP sent to your phone number',
        data: {
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request<{}, {}, RefreshTokenInput>, res: Response, next: NextFunction) {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
        return;
      }

      const tokens = await authService.refreshTokens(refreshToken);

      // Set new refresh token as HttpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request<{}, {}, LogoutInput>, res: Response, next: NextFunction) {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear the cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
