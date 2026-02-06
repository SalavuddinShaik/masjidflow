import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').optional(),
  email: z.string().email('Invalid email address').optional(),
  whatsappNumber: z.string().max(20).optional().nullable(),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  city: z.string().max(100, 'City name is too long').optional().nullable(),
  state: z.string().max(100, 'State name is too long').optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
