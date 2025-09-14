import { UserRole } from '@prisma/client';

export interface CreateProjectRoleDto {
    userId: string;
    projectId: string;
    role: UserRole;
}

export type ProjectRole = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};
