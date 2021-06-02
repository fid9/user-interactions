import express, { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status';
import bodyParser from 'body-parser';

import { ErrorType } from '../enums';

import authenticateToken from './authentication';
import likeRoutes from './routes/like.routes';
import userRoutes from './routes/user.routes';

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	authenticateToken.unless({
		path: [
			'/user-api/signup',
			'/user-api/login',
		],
	}),
);

app.use('/user-api', userRoutes);
app.use('/like-api', likeRoutes);

app.use(
	(
		req: Request,
		res: Response,
		_: NextFunction,
	): Response => res.status(statusCode.NOT_FOUND).send({
		type: ErrorType.Default,
		message: `${req.url} is not a valid URL route`,
	}),
);
