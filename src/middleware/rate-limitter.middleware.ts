import rateLimit from 'express-rate-limit';
import { ErrorResponse } from '@/responses';

export const createRateLimiter = (windowMs: number, max: number) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            ...ErrorResponse.badRequest('Too many requests').toJSON(),
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

export const globalRateLimit = createRateLimiter(15 * 60 * 1000, 100); // 15 minutes, 100 requests
export const authRateLimit = createRateLimiter(15 * 60 * 1000, 5); // 15 minutes, 5 requests
