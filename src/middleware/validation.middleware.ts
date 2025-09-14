import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ErrorResponse } from '@/responses';

export const validateSchema = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorResponse = ErrorResponse.badRequest(
                    'Validation failed',
                    error.issues
                );
                return res.status(400).json(errorResponse.toJSON());
            }
            next(error);
        }
    };
};
