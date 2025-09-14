import { z } from 'zod';

export const getAllUsersQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        sortBy: z
            .string()
            .default('createdAt') // Default to 'createdAt' as a string
            .transform((val) => val.split(',').map((item) => item.trim())) // Split the string into an array
            .refine(
                (val) =>
                    val.every((item) =>
                        [
                            'createdAt',
                            'firstName',
                            'lastName',
                            'email',
                        ].includes(item)
                    ),
                {
                    message: 'Invalid sort field',
                }
            ),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
    }),
});

export const createUserSchema = z.object({
    body: z.object({
        email: z.email('Invalid email format'),
        role: z.enum(['USER', 'ADMIN']).default('USER'),
    }),
});

export const updateUserSchema = z.object({
    params: z.object({
        id: z.cuid2('Invalid user ID'),
    }),
    body: z.object({
        email: z.email().optional(),
        role: z.enum(['USER', 'ADMIN']).optional(),
        profile: z
            .object({
                firstName: z.string().min(1).optional(),
                lastName: z.string().min(1).optional(),
                phone: z.e164('Please enter a valid phone number').optional(),
                bio: z.string().optional(),
            })
            .optional(),
    }),
});

export const getUserSchema = z.object({
    params: z.object({
        id: z.cuid2('Invalid user ID'),
    }),
});
