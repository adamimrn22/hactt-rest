import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { ErrorResponse } from '@/responses/error-response';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default values
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    const path = req.originalUrl;

    // Log error with stack if available
    logger.error(`[${req.method}] ${path} - ${message}`, {
        stack: err.stack,
        details: err.details,
    });

    // Use your ErrorResponse class for consistent JSON format
    const errorResponse = new ErrorResponse(
        message,
        err.code || 'INTERNAL_SERVER_ERROR',
        err.details,
        path,
        err.stack
    );

    res.status(statusCode).json(errorResponse.toJSON());
};
