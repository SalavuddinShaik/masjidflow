import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  sendOtpSchema,
  verifyOtpSchema,
  signupSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validators/auth.validator.js';

const router = Router();

// POST /api/v1/auth/send-otp - Send OTP for login
router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);

// POST /api/v1/auth/verify-otp - Verify OTP and get tokens
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);

// POST /api/v1/auth/signup - Register and send OTP
router.post('/signup', validate(signupSchema), authController.signup);

// POST /api/v1/auth/refresh - Refresh access token
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// POST /api/v1/auth/logout - Revoke refresh token
router.post('/logout', validate(logoutSchema), authController.logout);

export default router;
