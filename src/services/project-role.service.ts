import { Prisma } from '@prisma/client';
import { Service } from '@/services/service';
import { ProjectRoleRepository } from '@/repositories/project-role.repository';
import { ErrorResponse } from '@/responses';

export class ProjectRoleService extends Service {
    private projectRoleRepository: ProjectRoleRepository;

    constructor() {
        super();
        this.projectRoleRepository = new ProjectRoleRepository(this.prisma);
    }

    // Create role with permissions
    async createRole(data: {
        name: string;
        description?: string;
        permissionIds: string[];
    }) {
        try {
            return await this.projectRoleRepository.createWithPermissions(data);
        } catch (error) {
            this.handleServiceError(error, 'ProjectRoleService.createRole');
        }
    }

    // Update role and permissions
    async updateRole(
        id: string,
        data: { name?: string; description?: string; permissionIds?: string[] }
    ) {
        try {
            return await this.projectRoleRepository.updateWithPermissions(
                id,
                data
            );
        } catch (error) {
            this.handleServiceError(error, 'ProjectRoleService.updateRole');
        }
    }

    // Get all roles with filters, pagination, sorting
    async getAllRoles(
        options: {
            page: number;
            limit: number;
            sortBy: string;
            sortOrder: 'asc' | 'desc';
        },
        filters: {
            name?: string;
            description?: string;
        }
    ) {
        try {
            const where: Prisma.ProjectRoleWhereInput = {};

            if (filters.name)
                where.name = { contains: filters.name, mode: 'insensitive' };
            if (filters.description)
                where.description = {
                    contains: filters.description,
                    mode: 'insensitive',
                };

            const skip = (options.page - 1) * options.limit;
            const take = options.limit;

            const [data, total] = await this.prisma.$transaction(
                async (prisma) => {
                    const roles = await this.projectRoleRepository.findMany(
                        where,
                        {
                            skip,
                            take,
                            orderBy: { [options.sortBy]: options.sortOrder },
                        }
                    );
                    const count = await this.projectRoleRepository.count(where);
                    return [roles, count];
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
            this.handleServiceError(error, 'ProjectRoleService.getAllRoles');
        }
    }

    // Get single role by ID
    async getRoleById(id: string) {
        try {
            return await this.projectRoleRepository.findById(id);
        } catch (error) {
            this.handleServiceError(error, 'ProjectRoleService.getRoleById');
        }
    }

    async getRoleAndPermissions(id: string) {
        try {
            return await this.projectRoleRepository.findPermissionsByRoleId(id);
        } catch (error) {
            this.handleServiceError(
                error,
                'ProjectRoleService.getRoleAndPermissions'
            );
        }
    }

    // Delete role
    async deleteRole(id: string) {
        try {
            await this.projectRoleRepository.delete(id);
            return { message: 'Role deleted successfully' };
        } catch (error) {
            this.handleServiceError(error, 'ProjectRoleService.deleteRole');
        }
    }
}
