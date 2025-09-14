import { PrismaClient, Prisma, UserProjectEnrollment } from '@prisma/client';

export class UserProjectEnrollmentRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    // Enroll a user in a project
    async enrollUserInProject(
        projectId: string,
        userId: string,
        roleId: string
    ): Promise<UserProjectEnrollment> {
        try {
            // Check if the user is already enrolled in the project
            const existingEnrollment =
                await this.prisma.userProjectEnrollment.findUnique({
                    where: {
                        userId_projectId: { userId, projectId },
                    },
                });

            if (existingEnrollment) {
                throw new Error('User is already enrolled in this project');
            }

            // Enroll the user
            return await this.prisma.userProjectEnrollment.create({
                data: {
                    projectId,
                    userId,
                    roleId,
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    // Get users enrolled in a project
    async findUsersEnrolledInProject(
        projectId: string
    ): Promise<UserProjectEnrollment[]> {
        try {
            return await this.prisma.userProjectEnrollment.findMany({
                where: { projectId },
                select: {
                    id: true,
                    userId: true,
                    roleId: true,
                    projectId: true,
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
                    role: {
                        select: {
                            id: true,
                            name: true,
                            ProjectRolePermission: {
                                select: {
                                    permission: {
                                        select: {
                                            id: true,
                                            code: true,
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

    // Update a user's role in a project
    async updateUserRoleInProject(
        projectId: string,
        userId: string,
        roleId: string
    ): Promise<UserProjectEnrollment | null> {
        try {
            return await this.prisma.userProjectEnrollment.update({
                where: {
                    userId_projectId: { userId, projectId },
                },
                data: {
                    roleId: roleId,
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    // Remove a user from a project
    async removeUserFromProject(
        projectId: string,
        userId: string
    ): Promise<void> {
        try {
            await this.prisma.userProjectEnrollment.delete({
                where: {
                    userId_projectId: { userId, projectId },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    // Handle errors (you can customize this)
    private handleDatabaseError(error: any): void {
        console.error('Database Error:', error);
        throw new Error('Database operation failed');
    }
}
