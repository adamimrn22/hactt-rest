export class HttpStatus {
    static getStatusCode(code: string): number {
        switch (code) {
            case 'OK':
                return 200;
            case 'CREATED':
                return 201;
            case 'NOT_FOUND':
                return 404;
            case 'BAD_REQUEST':
                return 400;
            case 'UNAUTHORIZED':
                return 401;
            case 'FORBIDDEN':
                return 403;
            case 'INTERNAL_SERVER_ERROR':
            default:
                return 500;
        }
    }
}
