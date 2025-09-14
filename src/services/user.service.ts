import { Prisma } from '@prisma/client';
import { CreateUserDTO, UserWithoutPassword as User } from '@/dto/user.dto';
import { Service } from '@/services/service';
import { UserRepository } from '@/repositories/user.repository';
import {
    GetAllUsersResult,
    UserPaginationOptions,
    UserFilters,
} from '@/dto/user.dto';
import { ErrorResponse } from '@/responses';
import { PasswordUtils } from '@/utils/password-utils';
import { EmailQueue } from '@/queue/email-queue';

export class UserService extends Service {
    private userRepository: UserRepository;

    constructor() {
        super();
        this.userRepository = new UserRepository(this.prisma);
    }

    async getAllUsers(
        options: UserPaginationOptions = {},
        filters: UserFilters = {}
    ): Promise<GetAllUsersResult> {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = options;

        const sortByFields =
            typeof sortBy === 'string' ? sortBy.split(',') : sortBy;

        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {};

        if (filters.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                {
                    profile: {
                        firstName: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    profile: {
                        lastName: {
                            contains: filters.search,
                            mode: 'insensitive',
                        },
                    },
                },
            ];
        } else {
            if (filters.email) {
                where.email = { contains: filters.email, mode: 'insensitive' };
            }
            if (filters.firstName || filters.lastName) {
                where.profile = {
                    is: {},
                };
                if (filters.firstName) {
                    where.profile.is.firstName = {
                        contains: filters.firstName,
                        mode: 'insensitive',
                    };
                }
                if (filters.lastName) {
                    where.profile.is.lastName = {
                        contains: filters.lastName,
                        mode: 'insensitive',
                    };
                }
            }
        }

        let orderBy: Prisma.UserOrderByWithRelationInput = {};

        sortByFields.forEach((field) => {
            if (field === 'firstName' || field === 'lastName') {
                orderBy.profile = orderBy.profile || {};
                orderBy.profile[field] = sortOrder;
            } else {
                orderBy[field] = sortOrder;
            }
        });

        try {
            const [users, total] = await Promise.all([
                this.userRepository.findMany(where, {
                    skip,
                    take: limit,
                    orderBy,
                }),
                this.userRepository.count(where),
            ]);

            if (users.length === 0) {
                throw ErrorResponse.notFound(
                    'No users found with the given criteria'
                );
            }

            return {
                data: users,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            this.handleServiceError(error, 'getAllUsers');
        }
    }

    async getUserById(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw ErrorResponse.notFound(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            this.handleServiceError(error, 'getUserById');
        }
    }

    async createUser(data: CreateUserDTO) {
        try {
            const existingUser = await this.userRepository.findByEmail(
                data.email
            );

            if (existingUser) {
                throw ErrorResponse.conflict(
                    `User with email ${data.email} already exists`
                );
            }

            const randomPassword = PasswordUtils.generateRandomPassword(16);

            const userData: Prisma.UserCreateInput = {
                email: data.email,
                role: data.role,
                password: randomPassword,
            };

            const newUser = await this.userRepository.create(userData);

            // Enqueue email job to send welcome email
            const emailQueue = EmailQueue.getInstance();

            await emailQueue.addJob('send-welcome-email', {
                email: newUser.email,
                password: randomPassword,
            });

            return;
        } catch (error) {
            this.handleServiceError(error, 'createUser');
        }
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        try {
            const existingUser = await this.userRepository.findById(id);
            if (!existingUser) {
                throw ErrorResponse.notFound(`User with ID ${id} not found`);
            }
            return await this.userRepository.update(id, data);
        } catch (error) {
            this.handleServiceError(error, 'updateUser');
        }
    }

    async deleteUser(id: string) {
        try {
            const existingUser = await this.userRepository.findById(id);
            if (!existingUser) {
                throw ErrorResponse.notFound(`User with ID ${id} not found`);
            }
            await this.userRepository.delete(id);
        } catch (error) {
            this.handleServiceError(error, 'deleteUser');
        }
    }
}
