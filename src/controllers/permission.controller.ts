import { Request, Response } from 'express';
import { Controller } from '@/controllers/controller';
import { PermissionService } from '@/services/permission.service';

export class PermissionController extends Controller {
    private permissionService: PermissionService;

    constructor() {
        super();
        this.permissionService = new PermissionService();
    }

    createPermission = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { code, description } = req.body;
            const result = await this.permissionService.createPermission({
                code,
                description,
            });
            return this.handleSuccess(
                res,
                result,
                'Permission created successfully'
            );
        }
    );

    getAllPermissions = this.asyncHandler(
        async (req: Request, res: Response) => {
            const {
                page = '1',
                limit = '10',
                sortBy = 'createdAt',
                sortOrder = 'desc',
                code,
            } = req.query;
            const options = {
                page: parseInt(page as string),
                limit: parseInt(limit as string),
                sortBy: sortBy as string,
                sortOrder: sortOrder as 'asc' | 'desc',
            };
            const filters = { code: code as string };

            const result = await this.permissionService.getAllPermissions(
                options,
                filters
            );
            return this.handleSuccess(
                res,
                result,
                'Permissions fetched successfully'
            );
        }
    );

    getPermissionById = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const result = await this.permissionService.getPermissionById(id);
            return this.handleSuccess(
                res,
                result,
                'Permission fetched successfully'
            );
        }
    );

    updatePermission = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const { code, description } = req.body;
            const result = await this.permissionService.updatePermission(id, {
                code,
                description,
            });
            return this.handleSuccess(
                res,
                result,
                'Permission updated successfully'
            );
        }
    );

    deletePermission = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const result = await this.permissionService.deletePermission(id);
            return this.handleSuccess(res, result.message);
        }
    );
}
