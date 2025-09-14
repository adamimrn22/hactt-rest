import z from 'zod';

export const CreatePermissionSchema = z.object({
    code: z.string().min(1, 'Code is required'),
    description: z.string().optional(),
});

// Update Permission
export const UpdatePermissionSchema = z.object({
    code: z.string().optional(),
    description: z.string().optional(),
});

// GetAll Permission query params
export const GetAllPermissionQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['createdAt', 'code']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    code: z.string().optional(),
});
