import { PrismaClient, Prisma, Project } from '@prisma/client';
import { Repository } from '@/repositories/repository';

export class ProjectRepository extends Repository<Project> {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async create(data: Prisma.ProjectCreateInput): Promise<Project> {
        try {
            return await this.prisma.project.create({
                data,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    channelName: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findById(id: string): Promise<Project | null> {
        try {
            return await this.prisma.project.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    channelName: true,
                    createdAt: true,
                    updatedAt: true,
                    UserProjectEnrollment: {
                        select: {
                            id: true,
                            userId: true,
                            role: true,
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                    profile: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findMany(
        where?: Prisma.ProjectWhereInput,
        options?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.ProjectOrderByWithRelationInput;
        }
    ): Promise<Project[]> {
        try {
            return await this.prisma.project.findMany({
                where,
                skip: options?.skip,
                take: options?.take,
                orderBy: options?.orderBy,
                select: {
                    id: true,
                    name: true,
                    channelName: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async update(
        id: string,
        data: Prisma.ProjectUpdateInput
    ): Promise<Project> {
        try {
            return await this.prisma.project.update({
                where: { id },
                data,
                select: {
                    id: true,
                    name: true,
                    channelName: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.project.delete({
                where: { id },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async count(where?: Prisma.ProjectWhereInput): Promise<number> {
        try {
            return await this.prisma.project.count({
                where,
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }
}
