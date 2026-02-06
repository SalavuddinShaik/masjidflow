import type { Response, NextFunction } from 'express';
import { tokenService } from '../services/token.service.js';
import { UnauthorizedError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../types/index.js';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided', 'NO_TOKEN');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const payload = tokenService.verifyAccessToken(token);

    req.userId = payload.userId;
    next();
  } catch (error) {
    next(error);
  }
}

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = tokenService.verifyAccessToken(token);
      req.userId = payload.userId;
    }

    next();
  } catch {
    // Token is invalid but that's okay for optional auth
    next();
  }
}
