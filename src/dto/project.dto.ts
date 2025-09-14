import { UserRole } from '@prisma/client';

export interface CreateProjectDto {
    name: string;
    description: string;
    channelName: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    channelName?: string;
}

export interface getAllProjectsResult {
    data: Project[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export type Project = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface ProjectPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'description';
    sortOrder?: 'asc' | 'desc';
}

export interface ProjectFilters {
    search?: string;
    name?: string;
    description?: string;
}
