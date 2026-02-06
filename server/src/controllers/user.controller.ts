import type { Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { NotFoundError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { UpdateProfileInput } from '../validators/user.validator.js';

export const userController = {
  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const user = await userService.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          whatsappNumber: user.whatsappNumber,
          address: user.address,
          city: user.city,
          state: user.state,
          isPhoneVerified: user.isPhoneVerified,
          isProfileComplete: user.isProfileComplete,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(
    req: AuthenticatedRequest & { body: UpdateProfileInput },
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId!;
      const updateData = req.body;

      const user = await userService.updateProfile(userId, updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          countryCode: user.countryCode,
          whatsappNumber: user.whatsappNumber,
          address: user.address,
          city: user.city,
          state: user.state,
          isPhoneVerified: user.isPhoneVerified,
          isProfileComplete: user.isProfileComplete,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
