//Define endpoints to access User Data

import express from 'express';
import { Request, Response } from 'express';
import { User } from '../../models/index.js';

const router = express.Router();

// POST
router.post('/', async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error){
        console.log("Error adding User");
        res.status(500).json({error: 'Internal Server Error'});
    }
});

export {router as userRouter};

