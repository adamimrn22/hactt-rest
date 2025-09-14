import { z } from 'zod';

export const CreateProjectRoleSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    permissionIds: z.array(z.cuid()).optional(),
});

export const UpdateProjectRoleSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    permissionIds: z.array(z.cuid()).optional(),
});

export const getProjectRoleSchema = z.object({
    params: z.object({
        roleId: z.cuid2('Invalid role ID'),
    }),
});
