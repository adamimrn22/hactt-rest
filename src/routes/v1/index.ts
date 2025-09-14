import { Router } from 'express';
import userRoutes from '@/routes/v1/user.routes';
import projectRoleRoutes from '@/routes/v1/project-role.routes';
import permissionRoutes from '@/routes/v1/permission.routes';
import projectRolePermissionRoutes from '@/routes/v1/project-role-permission.routes';
import projectRoutes from '@/routes/v1/project.routes';
const router = Router();

// Public routes
// router.use('/auth', authRoutes);

// // Protected routes (require authentication)
// router.use('/users', authMiddleware, userRoutes);

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/project-roles', projectRoleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/project-role-permissions', projectRolePermissionRoutes);

// Health check for v1
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API v1 is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// Catch all undefined routes in v1
router.all('/{*splat}', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
    });
});

export default router;
