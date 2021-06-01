import request from 'supertest';
import { app } from '../../app';
import { database } from '../../../database/connection';

import UserService from '../../../services/user.service';
// import LikeService from '../../../services/like.service';
// import { ErrorType } from '../../../enums';
import { existingUser } from '../../../../mock-data/user.mocks';
import { getUserQuery } from '../../../database/queries/user.query';

describe('like.routes.ts', (): void => {
    const agent = request.agent(app);

    describe('/ - get most liked', (): void => {
        test(
            'It should succeed on get most liked',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .get('/like-api/most-liked')
                    .set('authorization', existingUser.username);

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(response.body.likes).toHaveLength(3);
                expect(response.body.likes[0].count).toBeGreaterThan(
                    response.body.likes[1].count
                );

                expect(response.status).toBe(200);
            })
    });
    describe('/ - get user likes', (): void => { });
    describe('/ - like user', (): void => { });
    describe('/ - unlike user', (): void => { });
})