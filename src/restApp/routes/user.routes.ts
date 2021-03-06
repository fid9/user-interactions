import express, { NextFunction, Response } from 'express';
import httpStatus from 'http-status';

import UserService from '../../services/user.service';
import { CustomRequest } from '../../interfaces/CustomRequest';
import { ErrorType } from '../../enums';
import { generateToken, validatePassword } from '../../utils';
import { defaultUserValidator } from '../validators/user.validator';

const router = express.Router();

router.put(
	'/signup',
	...defaultUserValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { username, password } = req.body;

		const response = await UserService.create(username, password);

		if (!response.username) {
			if (response.error === ErrorType.UserAlreadyExists) {
				return res.status(httpStatus.BAD_REQUEST).json({
					error: ErrorType.UserAlreadyExists,
				}).end();
			}

			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				error: response.error,
			}).end();
		}

		const token = generateToken(username);

		return res.status(httpStatus.OK).json({ token }).end();
	},
);

router.post(
	'/login',
	...defaultUserValidator,
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { username, password } = req.body;

		const user = await UserService.get(username);

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ErrorType.WrongUsernameOrPassword,
			}).end();
		}

		const isValid = await validatePassword(password, user.password);

		if (!isValid) {
			return res.status(httpStatus.FORBIDDEN).json({
				error: ErrorType.WrongUsernameOrPassword,
			}).end();
		}

		const token = generateToken(username);

		return res.status(httpStatus.OK).json({ token }).end();
	},
);

router.get(
	'/me',
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { username } = req;

		const user = await UserService.get(username);

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ErrorType.UserNotFound,
			}).end();
		}

		return res.status(httpStatus.OK).json({ user }).end();
	},
);

router.post(
	'/me/update-password',
	async (
		req: CustomRequest,
		res: Response,
		_next: NextFunction,
	): Promise<Response | void> => {
		const { username } = req;

		const user = await UserService.get(username);

		if (!user) {
			return res.status(httpStatus.NOT_FOUND).json({
				error: ErrorType.UserNotFound,
			}).end();
		}

		const { currentPassword, newPassword } = req.body;

		const isValid = await validatePassword(currentPassword, user.password);

		if (!isValid) {
			return res.status(httpStatus.FORBIDDEN).json({
				error: ErrorType.WrongUsernameOrPassword,
			}).end();
		}

		await UserService.updatePassword(username, newPassword);

		return res.status(httpStatus.OK).end();
	},
);

export default router;
