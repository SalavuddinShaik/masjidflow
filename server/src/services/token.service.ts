import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';
import type { JwtPayload, TokenPair } from '../types/index.js';
import { UnauthorizedError } from '../utils/errors.js';

const prisma = new PrismaClient();

export const tokenService = {
  generateAccessToken(userId: string): string {
    const payload: JwtPayload = { userId, type: 'access' };
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn,
    });
  },

  generateRefreshToken(userId: string): string {
    const payload: JwtPayload = { userId, type: 'refresh' };
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });
  },

  async generateTokenPair(userId: string): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
      if (payload.type !== 'access') {
        throw new UnauthorizedError('Invalid token type');
      }
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expired', 'TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid token', 'INVALID_TOKEN');
      }
      throw error;
    }
  },

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
      if (payload.type !== 'refresh') {
        throw new UnauthorizedError('Invalid token type');
      }
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
      }
      throw error;
    }
  },

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Verify the token
    const payload = this.verifyRefreshToken(refreshToken);

    // Check if token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.isRevoked) {
      throw new UnauthorizedError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token expired', 'REFRESH_TOKEN_EXPIRED');
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Generate new token pair
    return this.generateTokenPair(payload.userId);
  },

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
  },

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  },
};
