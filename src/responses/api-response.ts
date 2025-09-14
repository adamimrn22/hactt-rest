export abstract class ApiResponse<T = any> {
    public readonly success: boolean;
    public readonly message: string;
    public readonly timestamp: string;
    public readonly path?: string;

    constructor(success: boolean, message: string, path?: string) {
        this.success = success;
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.path = path;
    }

    abstract toJSON(): object;
}
