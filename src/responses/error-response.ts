import { ApiResponse } from './api-response';

export class ErrorResponse extends ApiResponse {
    public readonly error: {
        code: string;
        details?: any;
        stack?: string;
    };

    constructor(
        message: string,
        code: string,
        details?: any,
        path?: string,
        stack?: string
    ) {
        super(false, message, path);
        this.error = {
            code,
            details,
            ...(process.env.NODE_ENV === 'development' && { stack }),
        };
    }

    toJSON(): object {
        return {
            success: this.success,
            message: this.message,
            error: this.error,
            timestamp: this.timestamp,
            path: this.path,
        };
    }

    // Factory methods for common errors
    static badRequest(
        message = 'Bad Request',
        details?: any,
        path?: string,
        stack?: string
    ): ErrorResponse {
        return new ErrorResponse(message, 'BAD_REQUEST', details, path, stack);
    }

    static unauthorized(
        message = 'Unauthorized',
        details?: any,
        path?: string,
        stack?: string
    ): ErrorResponse {
        return new ErrorResponse(message, 'UNAUTHORIZED', details, path, stack);
    }

    static forbidden(
        message = 'Forbidden',
        details?: any,
        path?: string,
        stack?: string
    ): ErrorResponse {
        return new ErrorResponse(message, 'FORBIDDEN', details, path, stack);
    }

    static notFound(
        message = 'Resource not found',
        details?: any,
        path?: string,
        stack?: string
    ): ErrorResponse {
        return new ErrorResponse(message, 'NOT_FOUND', details, path, stack);
    }

    static conflict(
        message = 'Conflict',
        details?: any,
        path?: string,
        stack?: string
    ): ErrorResponse {
        return new ErrorResponse(message, 'CONFLICT', details, path, stack);
    }

    static internal(
        message = 'Internal server error',
        details?: any,
        path?: string,
        stack?: string
    ): ErrorResponse {
        return new ErrorResponse(
            message,
            'INTERNAL_SERVER_ERROR',
            details,
            path,
            stack
        );
    }
}
