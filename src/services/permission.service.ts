import { Prisma } from '@prisma/client';
import { Service } from '@/services/service';
import { PermissionRepository } from '@/repositories/permission.repository';
import { ErrorResponse } from '@/responses';

export class PermissionService extends Service {
    private permissionRepository: PermissionRepository;

    constructor() {
        super();
        this.permissionRepository = new PermissionRepository(this.prisma);
    }

    async createPermission(data: Prisma.PermissionCreateInput) {
        try {
            return await this.permissionRepository.create(data);
        } catch (error) {
            this.handleServiceError(
                error,
                'PermissionService.createPermission'
            );
        }
    }

    async getAllPermissions(
        options: {
            page: number;
            limit: number;
            sortBy: string;
            sortOrder: 'asc' | 'desc';
        },
        filters: { code?: string }
    ) {
        try {
            const where: Prisma.PermissionWhereInput = {};
            if (filters.code)
                where.code = { contains: filters.code, mode: 'insensitive' };

            const skip = (options.page - 1) * options.limit;
            const take = options.limit;

            const [data, total] = await this.prisma.$transaction(
                async (prisma) => {
                    const data = await this.permissionRepository.findMany(
                        where
                    );
                    const total = await this.permissionRepository.count(where);
                    return [data, total];
                }
            );

            return {
                data,
                meta: {
                    total,
                    page: options.page,
                    limit: options.limit,
                    totalPages: Math.ceil(total / options.limit),
                },
            };
        } catch (error) {
            this.handleServiceError(
                error,
                'PermissionService.getAllPermissions'
            );
        }
    }

    async getPermissionById(id: string) {
        try {
            return await this.permissionRepository.findById(id);
        } catch (error) {
            this.handleServiceError(
                error,
                'PermissionService.getPermissionById'
            );
        }
    }

    async updatePermission(id: string, data: Prisma.PermissionUpdateInput) {
        try {
            return await this.permissionRepository.update(id, data);
        } catch (error) {
            this.handleServiceError(
                error,
                'PermissionService.updatePermission'
            );
        }
    }

    async deletePermission(id: string) {
        try {
            await this.permissionRepository.delete(id);
            return { message: 'Permission deleted successfully' };
        } catch (error) {
            this.handleServiceError(
                error,
                'PermissionService.deletePermission'
            );
        }
    }
}
