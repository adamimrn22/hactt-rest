import { PrismaClient, Prisma } from '@prisma/client';
import { Repository } from './repository';

export class ProjectRolePermissionRepository extends Repository<any, any> {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async create(data: Prisma.ProjectRolePermissionCreateInput) {
        try {
            return await this.prisma.projectRolePermission.create({ data });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findById(id: string) {
        try {
            return await this.prisma.projectRolePermission.findUnique({
                where: { id },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findMany(
        where?: Prisma.ProjectRolePermissionWhereInput
    ): Promise<any[]> {
        try {
            return await this.prisma.projectRolePermission.findMany({ where });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async update(id: string, data: Prisma.ProjectRolePermissionUpdateInput) {
        try {
            return await this.prisma.projectRolePermission.update({
                where: { id },
                data,
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async delete(id: string) {
        try {
            await this.prisma.projectRolePermission.delete({ where: { id } });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async count(
        where?: Prisma.ProjectRolePermissionWhereInput
    ): Promise<number> {
        try {
            return await this.prisma.projectRolePermission.count({ where });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }
}
