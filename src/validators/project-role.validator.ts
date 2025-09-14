import z from 'zod';

export const CreateProjectRoleSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    permissionIds: z
        .array(z.string())
        .nonempty('At least one permission is required'),
});

// Update ProjectRole
export const UpdateProjectRoleSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    permissionIds: z.array(z.string()).optional(),
});

// GetAll ProjectRole query params
export const GetAllProjectRoleQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['createdAt', 'name', 'description']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    name: z.string().optional(),
    description: z.string().optional(),
});
