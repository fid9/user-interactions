import express, { NextFunction, Request, Response } from 'express';
import statusCode from 'http-status';
import userRoutes from './routes/user.routes';
import likeRoutes from './routes/like.routes';
import bodyParser from 'body-parser';
import { ErrorType } from '../enums';
import authenticateToken from '../../src/restApp/authentication';

export const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	authenticateToken.unless({
		path: [
			'/user-api/signup',
			'/user-api/login'
		]
	})
);

app.use('/user-api', userRoutes);
app.use('/like-api', likeRoutes);


app.use(
	(req: Request, res: Response, _: NextFunction): Response => {
		return res.status(statusCode.NOT_FOUND).send({
			type: ErrorType.Default,
			message: `${req.url} is not a valid URL route`,
		});
	},
);
