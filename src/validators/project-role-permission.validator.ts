import z from 'zod';

export const CreateRolePermissionSchema = z.object({
    roleId: z.string().min(1, 'RoleId is required'),
    permissionId: z.string().min(1, 'PermissionId is required'),
});

// GetAll RolePermission query params
export const GetAllRolePermissionQuerySchema = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});
