import request from 'supertest';
import { app } from '../../app';
import { database } from '../../../database/connection';

import UserService from '../../../services/user.service';
import * as Utils from '../../../utils';
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
                        password: newUser.rawPassword
                    });

                expect(getUser).toBeCalledWith(newUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(createUser).toBeCalledWith(
                    newUser.username,
                    newUser.rawPassword
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
                        password: existingUser.rawPassword
                    });

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(createUser).toBeCalledWith(
                    existingUser.username,
                    existingUser.rawPassword
                );

                expect(response.status).toBe(400);
                expect(response.body.error).toBe(ErrorType.UserAlreadyExists);
            }
        );

        test(
            'It should succeed on user login',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .post('/user-api/login')
                    .send({
                        username: existingUser.username,
                        password: existingUser.rawPassword
                    });

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                await expect(
                    Utils.validatePassword(
                        existingUser.rawPassword, 
                        existingUser.password
                )).resolves.toEqual(true);

                expect(response.status).toBe(200);
            }
        );

        test(
            'It should fail on user login',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .post('/user-api/login')
                    .send({
                        username: existingUser.username,
                        password: newUser.rawPassword
                    });

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                await expect(
                    Utils.validatePassword(
                        newUser.rawPassword, 
                        existingUser.password
                )).resolves.toEqual(false);

                expect(response.status).toBe(403);
                expect(response.body).toStrictEqual({
                    error: ErrorType.WrongUsernameOrPassword
                });
            }
        );

        test(
            'It should succeed on get current user',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .get('/user-api/me')
                    .set('authorization', existingUser.username);

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(response.status).toBe(200);
                expect(response.body).toStrictEqual({ user: existingUser});
            }
        );

        test(
            'It should fail on get current user',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .get('/user-api/me')
                    .set('authorization', newUser.username);

                expect(getUser).toBeCalledWith(newUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                expect(response.status).toBe(404);
                expect(response.body).toStrictEqual(
                    { error: ErrorType.UserNotFound}
                );
            }
        );

        test(
            'It should succeed on update password',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const updatePassword = jest.spyOn(
                    UserService,
                    'updatePassword'
                )

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .post('/user-api/me/update-password')
                    .send({
                        currentPassword: existingUser.rawPassword,
                        newPassword: '12345678'
                    })
                    .set('authorization', existingUser.username);

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                await expect(
                    Utils.validatePassword(
                        existingUser.rawPassword, 
                        existingUser.password
                )).resolves.toEqual(true);

                expect(updatePassword).toBeCalledWith(
                    existingUser.username,
                    '12345678'
                );

                expect(response.status).toBe(200);
            }
        );

        test(
            'It should fail on update password',
            async (): Promise<void> => {
                const getUser = jest.spyOn(
                    UserService,
                    'get',
                );

                const updatePassword = jest.spyOn(
                    UserService,
                    'updatePassword'
                )

                const spyOnQuery = jest.spyOn(database, 'query');

                const response = await agent
                    .post('/user-api/me/update-password')
                    .send({
                        currentPassword: newUser.rawPassword,
                        newPassword: '12345678'
                    })
                    .set('authorization', existingUser.username);

                expect(getUser).toBeCalledWith(existingUser.username);

                expect(spyOnQuery).toBeCalledWith(
                    getUserQuery,
                    expect.any(Object),
                );

                await expect(
                    Utils.validatePassword(
                        newUser.rawPassword, 
                        existingUser.password
                )).resolves.toEqual(false);

                expect(updatePassword).toHaveBeenCalledTimes(0);

                expect(response.status).toBe(403);
                expect(response.body).toStrictEqual(
                    { error: ErrorType.WrongUsernameOrPassword }
                );
            }
        );
    })
})