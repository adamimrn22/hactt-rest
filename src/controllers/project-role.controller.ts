import { Request, Response } from 'express';
import { Controller } from '@/controllers/controller';
import { ProjectRoleService } from '@/services/project-role.service';
import { ErrorResponse } from '@/responses';
import { HttpStatus } from '@/utils/http-status';

export class ProjectRoleController extends Controller {
    private projectRoleService: ProjectRoleService;

    constructor() {
        super();
        this.projectRoleService = new ProjectRoleService();
    }

    createRole = this.asyncHandler(async (req: Request, res: Response) => {
        const { name, description, permissionIds } = req.body;
        const result = await this.projectRoleService.createRole({
            name,
            description,
            permissionIds,
        });
        return this.handleSuccess(res, result, 'Role created successfully');
    });

    updateRole = this.asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description, permissionIds } = req.body;
        const result = await this.projectRoleService.updateRole(id, {
            name,
            description,
            permissionIds,
        });
        return this.handleSuccess(res, result, 'Role updated successfully');
    });

    getAllRoles = this.asyncHandler(async (req: Request, res: Response) => {
        const {
            page = '1',
            limit = '10',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            name,
            description,
        } = req.query;
        const options = {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            sortBy: sortBy as string,
            sortOrder: sortOrder as 'asc' | 'desc',
        };
        const filters = {
            name: name as string,
            description: description as string,
        };

        try {
            const result = await this.projectRoleService.getAllRoles(
                options,
                filters
            );
            return this.handleSuccess(
                res,
                result,
                'Roles fetched successfully'
            );
        } catch (err) {
            if (err instanceof ErrorResponse) {
                return this.handleError(
                    res,
                    err,
                    HttpStatus.getStatusCode(err.error.code)
                );
            }
            return this.handleError(
                res,
                ErrorResponse.internal('Failed to fetch roles'),
                500
            );
        }
    });

    getRoleById = this.asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.projectRoleService.getRoleById(id);
        return this.handleSuccess(res, result, 'Role fetched successfully');
    });

    getRoleAndPermissionsByRoleId = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const result = await this.projectRoleService.getRoleAndPermissions(
                id
            );
            return this.handleSuccess(
                res,
                result,
                `Role and Permissions fetched successfully for role ID: ${id}`
            );
        }
    );

    deleteRole = this.asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await this.projectRoleService.deleteRole(id);
        return this.handleSuccess(res, result.message);
    });
}
