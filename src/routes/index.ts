import { Router } from 'express';
import { SuccessResponse } from '../responses';
import { FabricIdentityService } from '@/services/fabric-identity.service';

import v1Routes from './v1';

const router = Router();

// Root API endpoint
router.get('/', (req, res) => {
    const response = new SuccessResponse('API is running', {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            v1: '/api/v1',
            health: '/health',
            docs: '/api/v1/docs',
        },
    });

    res.json(response.toJSON());
});

router.post('/test', async (req, res) => {
    // root folder of fabric samples so smart contract can retrieve the wallet as well
    const walletPath = '../../../wallet';
    const userId = 'hy3ndaq5fhszfme3n617dzp7';
    const projectId = 'megj0g73fnok72psys6wkz4l';
    const jwtSecret = '37f93fe42c78ad9f457ea6eea34c994d';

    const fabricService = new FabricIdentityService();

    // Step 1: Enroll admin (once)
    await fabricService.enrollAdmin(walletPath);

    // Step 2: Register & enroll user (assigns permissions via role)
    await fabricService.registerAndEnrollUser(userId, projectId, walletPath);

    // Step 3: Generate JWT with user permissions (extracted from role in DB or from cert)
    const jwt = await fabricService.generateJWT(userId, walletPath, jwtSecret);

    console.log('JWT for user:', jwt);
});

// API documentation endpoint
router.get('/docs', (req, res) => {
    const response = new SuccessResponse('API Documentation', {
        version: 'v1.0.0',
        baseUrl: '/api/v1',
        endpoints: {
            auth: {
                login: 'POST /api/v1/auth/login',
                register: 'POST /api/v1/auth/register',
                refresh: 'POST /api/v1/auth/refresh',
                logout: 'POST /api/v1/auth/logout',
            },
            users: {
                getProfile: 'GET /api/v1/users/profile',
                updateProfile: 'PUT /api/v1/users/profile',
                getAllUsers: 'GET /api/v1/users',
                getUserById: 'GET /api/v1/users/:id',
                updateUser: 'PUT /api/v1/users/:id',
                deleteUser: 'DELETE /api/v1/users/:id',
            },
        },
    });

    res.json(response.toJSON());
});

// API versioning
router.use('/', v1Routes);

export default router;
