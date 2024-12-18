import { userRouter } from './user-routes.js';
import { ticketRouter } from './ticketmaster.js';

import express from 'express';

const router = express.Router();

router.use('/users', userRouter);
router.use('/ticket',ticketRouter);

export default router;
