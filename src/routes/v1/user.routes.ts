import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { validateSchema } from '@/middleware/validation.middleware';
import {
    createUserSchema,
    getAllUsersQuerySchema,
    getUserSchema,
    updateUserSchema,
} from '@/validators';

const router = Router();
const userController = new UserController();

router.get(
    '/',
    validateSchema(getAllUsersQuerySchema),
    userController.getAllUser.bind(userController)
);

router.post(
    '/',
    validateSchema(createUserSchema),
    userController.createUser.bind(userController)
);

router.get(
    '/:id',
    validateSchema(getUserSchema),
    userController.findUser.bind(userController)
);

router.put(
    '/:id',
    validateSchema(getUserSchema),
    validateSchema(updateUserSchema),
    userController.updateUser.bind(userController)
);

router.delete(
    '/:id',
    validateSchema(getUserSchema),
    userController.deleteUser.bind(userController)
);

export default router;
