import { Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomRequest } from "src/interfaces/CustomRequest";

dotenv.config();

export const authenticateToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
) => {
    if (req.headers.authorization) {
        const header = req.headers.authorization;
        const token = header && header.split(' ')[1];

        if (!token) {
            return res.status(401).end();
        }

        jwt.verify(
            token, 
            process.env.TOKEN_SECRET,
            (
                err: any,
                user: any
            ) => {
                if (err) {
                    return res.status(403).json(err);
                }

                req.user = user;

                return next();
            }
            )
    }

}