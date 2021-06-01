import request from 'supertest';
import { app } from '../../app';
import { database } from '../../../database/connection';

import UserService from '../../../services/user.service';
import { getUserQuery } from '../../../database/queries/user.query';
import { existingUser, newUser } from '../../../../mock-data/user.mocks';
import { ErrorType } from '../../../enums';

describe('user.routes.ts', (): void => {
    const agent = request.agent(app);

    describe('/ - create user', (): void => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        test(
            'It should succeed on user creation',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const createUser = jest.spyOn(
                    UserService,
                    'create'
                );  

                const response = await agent
                    .put('/user-api/signup')
                    .send({
                        username: newUser.username,
                        password: newUser.password
                    });

                expect(getUser).toBeCalledWith(newUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(createUser).toBeCalledWith(
                    newUser.username,
                    newUser.password
                );

                expect(createUser).toHaveReturned();

                expect(response.status).toBe(200);
            }
        );

        test(
            'It should fail on user creation',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const createUser = jest.spyOn(
                    UserService,
                    'create'
                );  

                const response = await agent
                    .put('/user-api/signup')
                    .send({
                        username: existingUser.username,
                        password: existingUser.password
                    });

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(createUser).toBeCalledWith(
                    existingUser.username,
                    existingUser.password
                );

                expect(response.status).toBe(400);
                expect(response.body.error).toBe(ErrorType.UserAlreadyExists);
            }
        );
    })
})