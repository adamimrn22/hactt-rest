import { PermissionController } from '@/controllers/permission.controller';
import { validateSchema } from '@/middleware/validation.middleware';
import {
    CreatePermissionSchema,
    UpdatePermissionSchema,
} from '@/validators/permission.validator';
import { Router } from 'express';

const router = Router();
const permissionController = new PermissionController();

router.get(
    '/',
    permissionController.getAllPermissions.bind(permissionController)
);
router.get(
    '/:id',
    permissionController.getPermissionById.bind(permissionController)
);
router.post(
    '/',
    validateSchema(CreatePermissionSchema),
    permissionController.createPermission.bind(permissionController)
);
router.patch(
    '/:id',
    validateSchema(UpdatePermissionSchema),
    permissionController.updatePermission.bind(permissionController)
);

router.delete(
    '/:id',
    permissionController.deletePermission.bind(permissionController)
);

export default router;
