import { Request, Response } from 'express';
import { Controller } from '@/controllers/controller';
import { ProjectRolePermissionService } from '@/services/project-role-permission.service';

export class ProjectRolePermissionController extends Controller {
    private projectRolePermissionService: ProjectRolePermissionService;

    constructor() {
        super();
        this.projectRolePermissionService = new ProjectRolePermissionService();
    }

    createRolePermission = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { roleId, permissionId } = req.body;
            const result =
                await this.projectRolePermissionService.createRolePermission({
                    role: roleId,
                    permission: permissionId,
                });
            return this.handleSuccess(
                res,
                result,
                'RolePermission created successfully'
            );
        }
    );

    getAllRolePermissions = this.asyncHandler(
        async (req: Request, res: Response) => {
            const result =
                await this.projectRolePermissionService.getAllRolePermissions();
            return this.handleSuccess(
                res,
                result,
                'RolePermissions fetched successfully'
            );
        }
    );

    getRolePermissionById = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const result =
                await this.projectRolePermissionService.getRolePermissionById(
                    id
                );
            return this.handleSuccess(
                res,
                result,
                'RolePermission fetched successfully'
            );
        }
    );

    deleteRolePermission = this.asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            const result =
                await this.projectRolePermissionService.deleteRolePermission(
                    id
                );
            return this.handleSuccess(res, result.message);
        }
    );
}
