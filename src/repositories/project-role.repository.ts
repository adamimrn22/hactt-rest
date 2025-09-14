import { PrismaClient, Prisma } from '@prisma/client';
import { Repository } from './repository';
import { ProjectRole } from '@/dto/project-role.dto';

export class ProjectRoleRepository extends Repository<ProjectRole, any> {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    // ---- Standard CRUD methods ----
    async create(data: Prisma.ProjectRoleCreateInput): Promise<any> {
        try {
            return await this.prisma.projectRole.create({ data });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findById(id: string): Promise<any | null> {
        try {
            return await this.prisma.projectRole.findUnique({
                where: { id },
                include: {
                    ProjectRolePermission: { include: { permission: true } },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findMany(
        where?: Prisma.ProjectRoleWhereInput,
        options?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.ProjectRoleOrderByWithRelationInput;
        }
    ): Promise<any[]> {
        try {
            return await this.prisma.projectRole.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: options?.orderBy,
                include: {
                    ProjectRolePermission: { include: { permission: true } },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async update(
        id: string,
        data: Prisma.ProjectRoleUpdateInput
    ): Promise<any> {
        try {
            return await this.prisma.projectRole.update({
                where: { id },
                data,
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.projectRole.delete({ where: { id } });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async count(where?: Prisma.ProjectRoleWhereInput): Promise<number> {
        try {
            return await this.prisma.projectRole.count({ where });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    // ---- Custom Methods ----

    // Create Role with Permissions in one transaction
    async createWithPermissions(data: {
        name: string;
        description?: string;
        permissionIds: string[];
    }): Promise<any> {
        try {
            return await this.prisma.projectRole.create({
                data: {
                    name: data.name,
                    description: data.description,
                    ProjectRolePermission: {
                        create: data.permissionIds.map((pid) => ({
                            permissionId: pid,
                        })),
                    },
                },
                include: {
                    ProjectRolePermission: { include: { permission: true } },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    // Update Role and Permissions dynamically
    async updateWithPermissions(
        id: string,
        data: { name?: string; description?: string; permissionIds?: string[] }
    ): Promise<any> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const updatedRole = await tx.projectRole.update({
                    where: { id },
                    data: {
                        name: data.name,
                        description: data.description,
                    },
                });

                if (data.permissionIds) {
                    await tx.projectRolePermission.deleteMany({
                        where: { roleId: id },
                    });

                    await tx.projectRolePermission.createMany({
                        data: data.permissionIds.map((pid) => ({
                            roleId: id,
                            permissionId: pid,
                        })),
                    });
                }

                return updatedRole;
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findPermissionsByRoleId(roleId: string): Promise<any[]> {
        try {
            const roleWithPermissions =
                await this.prisma.projectRole.findUnique({
                    where: { id: roleId },
                    include: {
                        ProjectRolePermission: {
                            include: {
                                permission: true, // Include full permission details
                            },
                        },
                    },
                });

            if (!roleWithPermissions) return [];

            // Map to return only permission objects
            return roleWithPermissions.ProjectRolePermission.map(
                (rp) => rp.permission
            );
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }
}
