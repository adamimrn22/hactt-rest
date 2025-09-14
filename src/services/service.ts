import { PrismaClient } from '@prisma/client';
import { prisma } from '../config/database';
import { ErrorResponse } from '@/responses';

export abstract class Service {
    protected prisma: PrismaClient;

    constructor() {
        this.prisma = prisma;
    }

    protected async executeInTransaction<T>(
        operations: (
            prisma: Omit<
                PrismaClient,
                '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
            >
        ) => Promise<T>
    ): Promise<T> {
        return await this.prisma.$transaction(async (prisma) => {
            return await operations(prisma);
        });
    }

    protected handleServiceError(error: any, context: string): never {
        console.error(`Service error in ${context}:`, error);

        // If the error is already an ErrorResponse, we re-throw it
        if (error instanceof ErrorResponse) {
            throw error;
        }

        // Otherwise, convert it to an internal error response with the details :D
        throw ErrorResponse.internal(
            `Service failure in ${context}`,
            error,
            undefined,
            error instanceof Error ? error.stack : undefined
        );
    }
}
