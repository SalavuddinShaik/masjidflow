import { PrismaClient } from '@prisma/client';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import type { SignupData } from '../types/index.js';

const prisma = new PrismaClient();

export const userService = {
  async findByPhone(phone: string, countryCode: string) {
    return prisma.user.findFirst({
      where: { phone, countryCode },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async create(data: SignupData) {
    // Check for existing user with same phone or email
    const existingByPhone = await this.findByPhone(data.phone, data.countryCode);
    if (existingByPhone) {
      throw new ConflictError('A user with this phone number already exists');
    }

    const existingByEmail = await this.findByEmail(data.email);
    if (existingByEmail) {
      throw new ConflictError('A user with this email already exists');
    }

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        countryCode: data.countryCode,
        isPhoneVerified: true, // Phone is verified after OTP
      },
    });
  },

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string;
      whatsappNumber?: string;
      address?: string;
      city?: string;
      state?: string;
    }
  ) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check email uniqueness if updating
    if (data.email && data.email !== user.email) {
      const existingByEmail = await this.findByEmail(data.email);
      if (existingByEmail) {
        throw new ConflictError('A user with this email already exists');
      }
    }

    // Determine if profile is complete
    const updatedData = {
      ...data,
      isProfileComplete: !!(
        (data.name || user.name) &&
        (data.email || user.email) &&
        (data.address || user.address) &&
        (data.city || user.city) &&
        (data.state || user.state)
      ),
    };

    return prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });
  },

  async markPhoneVerified(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { isPhoneVerified: true },
    });
  },
};
