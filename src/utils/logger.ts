import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, json } = format;

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Development log format (human-readable)
const devFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        (process.env.NODE_ENV || 'development') === 'development'
            ? combine(colorize(), devFormat) // Pretty in dev
            : json() // JSON logs for production
    ),
    transports: [
        // Write error logs to logs/error.log
        new transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
        }),
        // Write all logs to logs/combined.log
        new transports.File({
            filename: path.join(logDir, 'combined.log'),
        }),
        // Console logs only in development
        ...(process.env.NODE_ENV === 'development'
            ? [new transports.Console()]
            : []),
    ],
});

export const logError = (msg: string, error?: unknown) => {
    if (error instanceof Error) {
        logger.error(`${msg}: ${error.message}`, { stack: error.stack });
    } else {
        logger.error(`${msg}: ${JSON.stringify(error)}`);
    }
};
