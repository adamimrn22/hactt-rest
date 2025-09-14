import { ProjectRoleController } from '@/controllers/project-role.controller';
import { validateSchema } from '@/middleware/validation.middleware';
import { CreateProjectRoleSchema, UpdateProjectRoleSchema } from '@/validators';
import { Router } from 'express';

const router = Router();
const projectRoleController = new ProjectRoleController();

router.get('/', projectRoleController.getAllRoles.bind(projectRoleController));
router.get(
    '/:id',
    projectRoleController.getRoleById.bind(projectRoleController)
);

router.get(
    '/:id/permissions',
    projectRoleController.getRoleAndPermissionsByRoleId.bind(
        projectRoleController
    )
);

router.post(
    '/',
    validateSchema(CreateProjectRoleSchema),
    projectRoleController.createRole.bind(projectRoleController)
);
router.patch(
    '/:id',
    validateSchema(UpdateProjectRoleSchema),
    projectRoleController.updateRole.bind(projectRoleController)
);
router.delete(
    '/:id',
    projectRoleController.deleteRole.bind(projectRoleController)
);

export default router;
