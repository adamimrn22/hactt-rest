import { PrismaClient, Prisma } from '@prisma/client';
import { Repository } from '@/repositories/repository';

export class PermissionRepository extends Repository<any, any> {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async create(data: Prisma.PermissionCreateInput) {
        try {
            return await this.prisma.permission.create({ data });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findById(id: string) {
        try {
            return await this.prisma.permission.findUnique({ where: { id } });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findMany(where?: Prisma.PermissionWhereInput): Promise<any[]> {
        try {
            return await this.prisma.permission.findMany({ where });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async update(id: string, data: Prisma.PermissionUpdateInput) {
        try {
            return await this.prisma.permission.update({ where: { id }, data });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async delete(id: string) {
        try {
            await this.prisma.permission.delete({ where: { id } });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async count(where?: Prisma.PermissionWhereInput): Promise<number> {
        try {
            return await this.prisma.permission.count({ where });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }
}
