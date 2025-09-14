import { ProjectRolePermissionController } from '@/controllers/project-role-permission.controller';
import { ProjectRoleController } from '@/controllers/project-role.controller';
import { validateSchema } from '@/middleware/validation.middleware';
import { CreateProjectRoleSchema, UpdateProjectRoleSchema } from '@/validators';
import { Router } from 'express';

const router = Router();

const projectRolePermissionController = new ProjectRolePermissionController();

router.get(
    '/',
    projectRolePermissionController.getAllRolePermissions.bind(
        projectRolePermissionController
    )
);

router.get(
    '/:id',
    projectRolePermissionController.getRolePermissionById.bind(
        projectRolePermissionController
    )
);

router.post(
    '/',
    projectRolePermissionController.createRolePermission.bind(
        projectRolePermissionController
    )
);
router.delete(
    '/:id',
    projectRolePermissionController.deleteRolePermission.bind(
        projectRolePermissionController
    )
);

export default router;
