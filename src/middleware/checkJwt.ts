import {Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
const dotenv = require('dotenv');
dotenv.config();

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // unauthorized
            req.user = decoded.username;
            next()
        }
    )
    
}