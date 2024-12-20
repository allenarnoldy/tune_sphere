//ALL Imports

import {Router,type Request,type Response} from 'express';
import {User} from '../models/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

//read config
dotenv.config();

export const login = async (req: Request, res: Response) => {
    const {user_name, password} = req.body;

    if (!user_name || !password) {
        return res.status(400).json({ message: "Both user_name and password are required" });
    }

    const user = await User.findOne({
        where: { "user_name": user_name },
    });

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed - This user does not exist in the system' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ message: 'Authentication failed - User password does not match' });
    }

    //Fetch SecretKey from env file to produce the JWT Token
    const secretKey = process.env.JWT_SECRET_KEY || '';

    const token = jwt.sign({ user_name }, secretKey, { expiresIn: '1h' });

    return res.json({ token });
};

const router = Router();


// POST /login
router.post ('/', login )

router.post('auth/signup', async (req, res) => {
    const { user_name, email, password, name, dob, gender, share_info } = req.body;
    try {
      const newUser = await User.create({ user_name, email, password, name, dob, gender, share_info });
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

export default router;



