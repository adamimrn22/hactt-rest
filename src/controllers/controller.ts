import { Request, Response, NextFunction } from 'express';
import { SuccessResponse, ErrorResponse } from '@/responses';

export abstract class Controller {
    protected handleSuccess<T>(
        res: Response,
        data?: T,
        message?: string,
        statusCode = 200
    ): Response {
        const response = new SuccessResponse(message || 'Success', data);
        return res.status(statusCode).json(response.toJSON());
    }

    protected handleError(
        res: Response,
        error: ErrorResponse,
        statusCode = 500
    ): Response {
        return res.status(statusCode).json(error.toJSON());
    }

    protected asyncHandler = (
        fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
    ) => {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    };
}
