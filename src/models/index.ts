// // Re-export all Prisma types and models
// export * from '@prisma/client';

// // Custom model interfaces and types
// export interface UserWithoutPassword {
//     id: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     role: UserRole;
//     isActive: boolean;
//     emailVerified: boolean;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface UserProfile extends UserWithoutPassword {
//     fullName: string;
//     avatar?: string;
//     bio?: string;
//     lastLoginAt?: Date;
// }

// export interface CreateUserInput {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     role?: UserRole;
// }

// export interface UpdateUserInput {
//     email?: string;
//     firstName?: string;
//     lastName?: string;
//     bio?: string;
//     avatar?: string;
//     isActive?: boolean;
//     emailVerified?: boolean;
// }

// // Pagination interfaces
// export interface PaginationOptions {
//     page?: number;
//     limit?: number;
//     sortBy?: string;
//     sortOrder?: 'asc' | 'desc';
// }

// export interface PaginatedResult<T> {
//     data: T[];
//     pagination: {
//         page: number;
//         limit: number;
//         total: number;
//         totalPages: number;
//         hasNextPage: boolean;
//         hasPreviousPage: boolean;
//     };
// }

// // Search and filter interfaces
// export interface UserFilters {
//     email?: string;
//     firstName?: string;
//     lastName?: string;
//     role?: UserRole;
//     isActive?: boolean;
//     emailVerified?: boolean;
//     createdAfter?: Date;
//     createdBefore?: Date;
// }

// export interface PostFilters {
//     title?: string;
//     authorId?: string;
//     published?: boolean;
//     tagIds?: string[];
//     createdAfter?: Date;
//     createdBefore?: Date;
// }

// export interface CommentFilters {
//     postId?: string;
//     authorId?: string;
//     createdAfter?: Date;
//     createdBefore?: Date;
// }

// // Model enums (these would be defined in your Prisma schema)
// export enum UserRole {
//     USER = 'USER',
//     ADMIN = 'ADMIN',
//     MODERATOR = 'MODERATOR',
// }

// export enum PostStatus {
//     DRAFT = 'DRAFT',
//     PUBLISHED = 'PUBLISHED',
//     ARCHIVED = 'ARCHIVED',
// }

// // Database relation types
// export type UserWithPosts = User & {
//     posts: Post[];
// };

// export type UserWithComments = User & {
//     comments: Comment[];
// };

// export type PostWithAuthorAndTags = Post & {
//     author: User;
//     tags: Tag[];
//     comments: Comment[];
// };

// export type CommentWithPostAndAuthor = Comment & {
//     post: Post;
//     author: User;
// };

// // Utility types for database operations
// export type DatabaseError = {
//     code: string;
//     message: string;
//     meta?: any;
// };

// export type QueryOptions = {
//     include?: any;
//     select?: any;
//     where?: any;
//     orderBy?: any;
//     skip?: number;
//     take?: number;
// };

// // Model validation types
// export interface ModelValidationResult {
//     isValid: boolean;
//     errors: string[];
// }

// // Audit log types
// export interface AuditLog {
//     id: string;
//     userId?: string;
//     action: string;
//     resource: string;
//     resourceId: string;
//     oldValues?: any;
//     newValues?: any;
//     ipAddress?: string;
//     userAgent?: string;
//     createdAt: Date;
// }

// export interface CreateAuditLogInput {
//     userId?: string;
//     action: string;
//     resource: string;
//     resourceId: string;
//     oldValues?: any;
//     newValues?: any;
//     ipAddress?: string;
//     userAgent?: string;
// }

// // File upload types
// export interface FileUpload {
//     id: string;
//     filename: string;
//     originalName: string;
//     mimeType: string;
//     size: number;
//     path: string;
//     url?: string;
//     uploadedBy: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface CreateFileUploadInput {
//     filename: string;
//     originalName: string;
//     mimeType: string;
//     size: number;
//     path: string;
//     url?: string;
//     uploadedBy: string;
// }

// // Session types (if using database sessions)
// export interface Session {
//     id: string;
//     userId: string;
//     token: string;
//     expiresAt: Date;
//     ipAddress?: string;
//     userAgent?: string;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface CreateSessionInput {
//     userId: string;
//     token: string;
//     expiresAt: Date;
//     ipAddress?: string;
//     userAgent?: string;
// }

// // Notification types
// export interface Notification {
//     id: string;
//     userId: string;
//     title: string;
//     message: string;
//     type: NotificationType;
//     read: boolean;
//     data?: any;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export enum NotificationType {
//     INFO = 'INFO',
//     SUCCESS = 'SUCCESS',
//     WARNING = 'WARNING',
//     ERROR = 'ERROR',
// }

// export interface CreateNotificationInput {
//     userId: string;
//     title: string;
//     message: string;
//     type: NotificationType;
//     data?: any;
// }

// // Settings types
// export interface UserSettings {
//     id: string;
//     userId: string;
//     emailNotifications: boolean;
//     pushNotifications: boolean;
//     theme: 'light' | 'dark';
//     language: string;
//     timezone: string;
//     privacy: {
//         profileVisible: boolean;
//         emailVisible: boolean;
//     };
//     createdAt: Date;
//     updatedAt: Date;
// }

// export interface UpdateUserSettingsInput {
//     emailNotifications?: boolean;
//     pushNotifications?: boolean;
//     theme?: 'light' | 'dark';
//     language?: string;
//     timezone?: string;
//     privacy?: {
//         profileVisible?: boolean;
//         emailVisible?: boolean;
//     };
// }

// // API response wrapper types
// export interface ApiData<T = any> {
//     id?: string;
//     type: string;
//     attributes: T;
//     relationships?: any;
//     meta?: any;
// }

// export interface ApiError {
//     id?: string;
//     status: string;
//     code: string;
//     title: string;
//     detail: string;
//     source?: {
//         pointer?: string;
//         parameter?: string;
//     };
//     meta?: any;
// }

// // Model helpers
// export class ModelHelper {
//     /**
//      * Remove sensitive fields from user object
//      */
//     static sanitizeUser(user: User): UserWithoutPassword {
//         const { password, ...sanitized } = user;
//         return sanitized as UserWithoutPassword;
//     }

//     /**
//      * Create user profile with computed fields
//      */
//     static createUserProfile(user: User): UserProfile {
//         const sanitized = this.sanitizeUser(user);
//         return {
//             ...sanitized,
//             fullName: `${user.firstName} ${user.lastName}`.trim(),
//         };
//     }

//     /**
//      * Generate pagination metadata
//      */
//     static createPaginationMeta(
//         total: number,
//         page: number,
//         limit: number
//     ): PaginatedResult<any>['pagination'] {
//         const totalPages = Math.ceil(total / limit);
//         return {
//             page,
//             limit,
//             total,
//             totalPages,
//             hasNextPage: page < totalPages,
//             hasPreviousPage: page > 1,
//         };
//     }

//     /**
//      * Convert filters to Prisma where clause
//      */
//     static buildWhereClause(filters: Record<string, any>): any {
//         const where: any = {};

//         Object.entries(filters).forEach(([key, value]) => {
//             if (value !== undefined && value !== null && value !== '') {
//                 // Handle string searches
//                 if (
//                     typeof value === 'string' &&
//                     ['title', 'content', 'name', 'email'].includes(key)
//                 ) {
//                     where[key] = {
//                         contains: value,
//                         mode: 'insensitive',
//                     };
//                 }
//                 // Handle date ranges
//                 else if (key.endsWith('After')) {
//                     const field = key.replace('After', '');
//                     where[field] = { ...where[field], gte: value };
//                 } else if (key.endsWith('Before')) {
//                     const field = key.replace('Before', '');
//                     where[field] = { ...where[field], lte: value };
//                 }
//                 // Handle array filters
//                 else if (Array.isArray(value)) {
//                     where[key] = { in: value };
//                 }
//                 // Handle exact matches
//                 else {
//                     where[key] = value;
//                 }
//             }
//         });

//         return where;
//     }

//     /**
//      * Validate model data
//      */
//     static validateModel(
//         data: any,
//         requiredFields: string[]
//     ): ModelValidationResult {
//         const errors: string[] = [];

//         requiredFields.forEach((field) => {
//             if (!data[field]) {
//                 errors.push(`${field} is required`);
//             }
//         });

//         return {
//             isValid: errors.length === 0,
//             errors,
//         };
//     }
// }

// // Export commonly used Prisma types with aliases
// export type { User, Post, Comment, Tag, Prisma } from '@prisma/client';

// // Export Prisma client instance type
// export type { PrismaClient } from '@prisma/client';
