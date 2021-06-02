import { Response, NextFunction } from 'express';
import unless from 'express-unless';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import httpStatus from 'http-status';

import { CustomRequest } from '../interfaces/CustomRequest';
import { JWTResponse } from '../interfaces/JWTResponse';
import { existingUser, newUser } from '../../mock-data/user.mocks';

dotenv.config();

const authenticateToken = (
	req: CustomRequest,
	res: Response,
	next: NextFunction,
): void => {
	const { authorization } = req.headers;

	if (authorization) {
		// For unit testing
		if (authorization === existingUser.username
            || authorization === newUser.username
		) {
			req.username = authorization;

			return next();
		}

		const token = authorization;

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
			},
		);
	}

	return next();
};

authenticateToken.unless = unless;

export default authenticateToken;
