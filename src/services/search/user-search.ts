// services/userSearch.ts
import { BaseSearch } from '@/utils/base-search'; // Import BaseSearch class
import { Prisma, User } from '@prisma/client';

export class UserSearch extends BaseSearch<
    User,
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput
> {
    // Implements the filtering logic for users
    protected buildSearchFilters(filters: {
        search?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    }): Prisma.UserWhereInput {
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

        return where;
    }

    // Public method to allow access to the search filters in the service layer
    public getSearchFilters(filters: {
        search?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
    }): Prisma.UserWhereInput {
        return this.buildSearchFilters(filters); // Call the protected method and return the result
    }
}
