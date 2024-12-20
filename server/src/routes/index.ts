import express from 'express';
import { userRouter } from './api/user-routes.js';
import { authenticateToken } from '../middleware/auth.js';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';

const router = express.Router();

// Allow public signup
router.post('/api/users', userRouter);

// Authentication and protected routes
router.use('/auth', authRoutes);
router.use('/api', authenticateToken, apiRoutes);

export default router;