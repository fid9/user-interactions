import { Response, NextFunction } from "express";
import unless from 'express-unless';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomRequest } from "../interfaces/CustomRequest";
import httpStatus from "http-status";
import { JWTResponse } from "../interfaces/JWTResponse";
import { existingUser } from "../../mock-data/user.mocks";

dotenv.config();

const authenticateToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction,
): void => {
    if (process.env.NODE_ENV === 'test') {
        const { authorization } = req.headers;

        if (authorization !== existingUser.username) {
            return res.status(httpStatus.FORBIDDEN).end();
        }
        
        req.username = req.headers.authorization;

        return next();
    }

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

authenticateToken.unless = unless;

export default authenticateToken;
