import { Response, NextFunction } from "express";

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomRequest } from "../interfaces/CustomRequest";
import httpStatus from "http-status";
import { JWTResponse } from "../interfaces/JWTResponse";

dotenv.config();

export const authenticateToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(httpStatus.UNAUTHORIZED).end();
        }

        jwt.verify(
            token,
            process.env.SECRET_TOKEN,
            (err: any, data: JWTResponse) => {
                if (
                    err
                    || !data.username
                    || data.exp > new Date().getTime()
                ) {
                    return res.status(httpStatus.FORBIDDEN).json(err);
                }

                req.username = data.username;

                return next();
            }
        )
    }

}