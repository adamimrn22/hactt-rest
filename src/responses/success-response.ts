import { ApiResponse } from './api-response';

export class SuccessResponse<T = any> extends ApiResponse<T> {
    public readonly data?: T;
    public readonly meta?: any;

    constructor(message: string, data?: T, meta?: any, path?: string) {
        super(true, message, path);
        this.data = data;
        this.meta = meta;
    }

    toJSON(): object {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
            meta: this.meta,
            timestamp: this.timestamp,
            path: this.path,
        };
    }

    static ok<T>(data?: T, message = 'Success'): SuccessResponse<T> {
        return new SuccessResponse(message, data);
    }

    static created<T>(
        data?: T,
        message = 'Created successfully'
    ): SuccessResponse<T> {
        return new SuccessResponse(message, data);
    }
}
