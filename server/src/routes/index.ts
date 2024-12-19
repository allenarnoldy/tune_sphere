import apiRouter  from './api/index.js';
import express from 'express';


const router = express.Router();

// Prefix all routes defined in the api directory with `/api`
router.use('/api',apiRouter);
//router.use('/auth',apiRouter);

export default router;