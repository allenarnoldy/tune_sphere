import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/:query', async (req: Request, res: Response) => {
const query = req.params.query;


    try {
        
        const TM_API_KEY = process.env.TICKET_MASTER_API_KEY;
        const TM_URL = process.env.TICKET_MASTER_URL;

        const response = await fetch(
            `${TM_URL}?keyword=${query}&apikey=${TM_API_KEY
            }`
        );
        console.log('Response:', response);
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Invalid API response, please check the network tab');
        }
        console.log('Data:', data);
        return res.status(200).json(data._embedded.events);
    } catch (err) {
        console.log('an error occurred', err);
        return res.status(500).json(err)
    }
})

export {router as ticketRouter};
