import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

// Prisma with Singleton Pattern
class DatabaseService {
    private static instance: PrismaClient;
    private static isConnected = false;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!DatabaseService.instance) {
            const connectionString = process.env.DATABASE_URL;

            if (!connectionString) {
                throw new Error(
                    'DATABASE_URL is not set in the environment variables.'
                );
            }

            const adapter = new PrismaPg({ connectionString });

            DatabaseService.instance = new PrismaClient({
                adapter,
                log: [
                    { emit: 'event', level: 'query' },
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'info' },
                    { emit: 'event', level: 'warn' },
                ],
                errorFormat: 'pretty',
            });

            // Log database queries in development
            if (process.env.NODE_ENV === 'development') {
                DatabaseService.instance.$on('query', (e) => {
                    logger.debug(`Query: ${e.query}`);
                    logger.debug(`Duration: ${e.duration}ms`);
                });
            }

            DatabaseService.instance.$on('error', (e) => {
                logger.error('Database error:', e);
            });

            DatabaseService.instance.$on('info', (e) => {
                logger.info('Database info:', e.message);
            });

            DatabaseService.instance.$on('warn', (e) => {
                logger.warn('Database warning:', e.message);
            });
        }

        return DatabaseService.instance;
    }

    public static async connect(): Promise<void> {
        if (DatabaseService.isConnected) {
            logger.info('Database already connected');
            return;
        }

        try {
            const prisma = DatabaseService.getInstance();
            await prisma.$connect();
            await prisma.$queryRaw`SELECT 1`;
            DatabaseService.isConnected = true;
            logger.info('Database connected successfully');
        } catch (error) {
            logger.error('Failed to connect to database:', error);
            throw new Error('Database connection failed');
        }
    }

    public static async disconnect(): Promise<void> {
        if (!DatabaseService.isConnected) {
            logger.info('Database already disconnected');
            return;
        }

        try {
            const prisma = DatabaseService.getInstance();
            await prisma.$disconnect();
            DatabaseService.isConnected = false;
            logger.info('Database disconnected successfully');
        } catch (error) {
            logger.error('Failed to disconnect from database:', error);
            throw new Error('Database disconnection failed');
        }
    }

    public static async healthCheck(): Promise<boolean> {
        try {
            const prisma = DatabaseService.getInstance();
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            logger.error('Database health check failed:', error);
            return false;
        }
    }

    public static isHealthy(): boolean {
        return DatabaseService.isConnected;
    }

    public static async runMigrations(): Promise<void> {
        try {
            logger.info('Running database migrations...');
            const { execSync } = require('child_process');
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            logger.info('Database migrations completed');
        } catch (error) {
            logger.error('Failed to run migrations:', error);
            throw new Error('Database migration failed');
        }
    }

    public static async seed(): Promise<void> {
        try {
            logger.info('Seeding database...');
            const { execSync } = require('child_process');
            execSync('npx prisma db seed', { stdio: 'inherit' });
            logger.info('Database seeded successfully');
        } catch (error) {
            logger.error('Failed to seed database:', error);
            throw new Error('Database seeding failed');
        }
    }
}

// Export the singleton instance
export const prisma = DatabaseService.getInstance();
export { DatabaseService };

// Connection helper functions
export const connectDatabase = DatabaseService.connect;
export const disconnectDatabase = DatabaseService.disconnect;
export const isDatabaseHealthy = DatabaseService.isHealthy;
export const checkDatabaseHealth = DatabaseService.healthCheck;
