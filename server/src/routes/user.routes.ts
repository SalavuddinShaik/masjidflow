import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validators/user.validator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/v1/users/me - Get current user
router.get('/me', userController.getMe);

// PUT /api/v1/users/profile - Update profile (BasicInfo)
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

export default router;
