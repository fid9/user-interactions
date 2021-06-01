import express, { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import UserService from '../../services/user.service';
import { CustomRequest } from '../../interfaces/CustomRequest';
import { ErrorType } from '../../enums';
import LikeService from '../../services/like.service';

const router = express.Router();

router.get(
    '/most-liked',
    async (
        req: CustomRequest,
        res: Response,
        _next: NextFunction,
    ): Promise<Response | void> => {
        const { username } = req;

        const user = await UserService.get(username);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                error: ErrorType.UserNotFound
            }).end();
        }

        const likes = await LikeService.getAll();

        return res.status(httpStatus.OK).json({ likes }).end();
    }
)

router.get(
    '/user/:id',
    async (
        req: CustomRequest,
        res: Response,
        _next: NextFunction,
    ): Promise<Response | void> => {
        const { username } = req;
        const { id } = req.params;

        const user = await UserService.get(username);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                error: ErrorType.UserNotFound
            }).end();
        }

        const likes = await LikeService.get(id);

        return res.status(httpStatus.OK).json({
            likes,
            likesCount: likes.length
        }).end();
    }
)

router.post(
    '/user/:id/like',
    async (
        req: CustomRequest,
        res: Response,
        _next: NextFunction,
    ): Promise<Response | void> => {
        const { username } = req;
        const { id } = req.params;

        const user = await UserService.get(username);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                error: ErrorType.UserNotFound
            }).end();
        }

        await LikeService.create(username, id);

        return res.status(httpStatus.OK).end();
    }
)

router.delete(
    '/user/:id/unlike',
    async (
        req: CustomRequest,
        res: Response,
        _next: NextFunction,
    ): Promise<Response | void> => {
        const { username } = req;
        const { id } = req.params;

        const user = await UserService.get(username);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({
                error: ErrorType.UserNotFound
            }).end();
        }

        await LikeService.delete(username, id);

        return res.status(httpStatus.OK).end();
    }
)

export default router;