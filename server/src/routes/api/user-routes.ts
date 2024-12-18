//Define endpoints to access User Data

import express from 'express';
import { Request, Response } from 'express';
import { User } from '../../models/index.js';

const router = express.Router();

// Get /Users
router.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error){
        console.log("Error getting Users");
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// POST /Users
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

