import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// T stand for type, R stand for return type
export abstract class Repository<T = any, R = T> {
    protected prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    abstract create(data: any): Promise<R>;
    abstract findById(id: string | number): Promise<R | null>;
    abstract findMany(where?: any, options?: any): Promise<R[]>;
    abstract update(id: string | number, data: any): Promise<R>;
    abstract delete(id: string | number): Promise<void>;
    abstract count(where?: any): Promise<number>;

    protected handleDatabaseError(error: any): never {
        // Log full error details for debugging (internal logs)
        if (error instanceof PrismaClientKnownRequestError) {
            // Prisma-specific error details
            console.error('Prisma error code:', error.code); // Error code
            console.error('Prisma error message:', error.message); // Error message
            console.error('Prisma error meta:', error.meta); // Additional error metadata

            // Log the full stack trace in development
            if (process.env.NODE_ENV === 'development' && error.stack) {
                console.error('Stack trace:', error.stack);
            }
        } else {
            // General error logging
            console.error('Unknown error type:', error);
        }

        // Throw a more informative error (for internal debugging)
        throw new Error(
            'Database operation failed: ' + (error || 'Unknown error')
        );
    }
}
