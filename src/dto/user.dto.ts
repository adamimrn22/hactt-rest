export interface UserFilters {
    search?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export interface UserPaginationOptions {
    page?: number;
    limit?: number;
    sortBy?: 'email' | 'firstName' | 'lastName' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface GetAllUsersResult {
    data: UserWithoutPassword[];
    meta: {
        total: number;

        page: number;

        limit: number;

        totalPages: number;
    };
}

export type UserWithoutPassword = Omit<User, 'password'>;

export interface CreateUserDTO {
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface User {
    id: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
    profile?: {
        firstName: string;
        lastName: string;
        phone?: string;
        bio?: string;
    };
}
