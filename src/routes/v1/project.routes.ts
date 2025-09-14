import { ProjectController } from '@/controllers/project.controller';
import { validateSchema } from '@/middleware/validation.middleware';
import { createProjectSchema } from '@/validators/project.validator';
import { Router } from 'express';

const router = Router();
const projectController = new ProjectController();

router.get('/', projectController.getAllProjects.bind(projectController));

router.post(
    '/',
    (req, res, next) => {
        console.log('Request Body:', req.body); // Log the body
        next();
    },
    validateSchema(createProjectSchema), // Your validation middleware
    projectController.createProject.bind(projectController)
);

router.get('/:id', projectController.getProjectById.bind(projectController));
router.put('/:id', projectController.updateProject.bind(projectController));
router.delete('/:id', projectController.deleteProject.bind(projectController));

export default router;
