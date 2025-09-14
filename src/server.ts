import 'dotenv/config';
import { createApp } from './app';
import { PrismaClient } from '@prisma/client';
import { logError, logger } from '@/utils/logger';

const prisma = new PrismaClient();
const PORT = process.env.PORT;

async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('Database connected successfully');

        // Create and start Express app
        const app = createApp();

        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(
                `Environment: ${process.env.NODE_ENV || 'development'}`
            );
            logger.info(`API Documentation: http://localhost:${PORT}/api/v1`);
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Received SIGINT, shutting down gracefully...');
            await prisma.$disconnect();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info('Received SIGTERM, shutting down gracefully...');
            await prisma.$disconnect();
            process.exit(0);
        });
    } catch (error) {
        logError('Failed to start server', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

startServer();
