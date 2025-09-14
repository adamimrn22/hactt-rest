import { PrismaClient, User, Prisma, UserProfile } from '@prisma/client';
import { Repository } from '@/repositories/repository';
import { UserWithoutPassword } from '@/dto/user.dto';

export class UserRepository extends Repository<User, UserWithoutPassword> {
    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        try {
            return await this.prisma.user.create({
                data,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    password: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findById(id: string): Promise<UserWithoutPassword | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findByEmail(email: string): Promise<UserWithoutPassword | null> {
        try {
            return await this.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async findMany(
        where?: Prisma.UserWhereInput,
        options?: {
            skip?: number;
            take?: number;
            orderBy?: Prisma.UserOrderByWithRelationInput;
        }
    ): Promise<UserWithoutPassword[]> {
        try {
            // Ensure orderBy is an array
            const orderBy = options?.orderBy
                ? Array.isArray(options.orderBy)
                    ? options.orderBy
                    : [options.orderBy]
                : [];

            const adjustedOrderBy: Prisma.UserOrderByWithRelationInput[] =
                orderBy.map((order) => {
                    if (order.profile?.firstName) {
                        return {
                            profile: { firstName: order.profile.firstName },
                        };
                    }
                    if (order.profile?.lastName) {
                        return {
                            profile: { lastName: order.profile.lastName },
                        };
                    }

                    return order;
                });

            return await this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
                skip: options?.skip,
                take: options?.take,
                orderBy: adjustedOrderBy,
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async update(
        id: string,
        data: Prisma.UserUpdateInput
    ): Promise<UserWithoutPassword> {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: {
                    ...data,
                    profile: {
                        update: {
                            firstName: (
                                data.profile as Prisma.UserProfileUpdateInput
                            )?.firstName,
                            lastName: (
                                data.profile as Prisma.UserProfileUpdateInput
                            )?.lastName,
                            phone: (
                                data.profile as Prisma.UserProfileUpdateInput
                            )?.phone,
                        },
                    },
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    profile: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                        },
                    },
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async updateProfile(
        id: string,
        profileData:
            | Prisma.UserProfileUpdateInput
            | Prisma.UserProfileCreateInput
    ): Promise<UserProfile> {
        try {
            return await this.prisma.userProfile.upsert({
                where: { userId: id },
                update: profileData as Prisma.UserProfileUpdateInput,
                create: {
                    id,
                    ...(profileData as Prisma.UserProfileCreateInput),
                },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async count(where?: Prisma.UserWhereInput): Promise<number> {
        try {
            return await this.prisma.user.count({ where });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async existsByEmail(email: string): Promise<boolean> {
        try {
            const count = await this.prisma.user.count({
                where: { email },
            });
            return count > 0;
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        try {
            await this.prisma.user.update({
                where: { id },
                data: { password: hashedPassword },
            });
        } catch (error) {
            this.handleDatabaseError(error);
        }
    }
}
