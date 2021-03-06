import request from 'supertest';

import { app } from '../../app';
import { database } from '../../../database/connection';
import UserService from '../../../services/user.service';
import LikeService from '../../../services/like.service';
import { existingUser } from '../../../../mock-data/user.mocks';
import { getUserQuery } from '../../../database/queries/user.query';
import { userWithLikes } from '../../../../mock-data/like.mocks';

describe('like.routes.ts', (): void => {
	const agent = request.agent(app);

	beforeAll((done) => {
		done();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

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
					response.body.likes[1].count,
				);

				expect(response.status).toBe(200);
			},
		);
	});

	describe('/ - get user likes', (): void => {
		test(
			'It should succeed on get user likes',
			async (): Promise<void> => {
				const getUser = jest.spyOn(
					UserService,
					'get',
				);

				const getLikes = jest.spyOn(
					LikeService,
					'get',
				);

				const spyOnQuery = jest.spyOn(database, 'query');

				const response = await agent
					.get(`/like-api/user/${userWithLikes.username}`)
					.set('authorization', existingUser.username);

				expect(getUser).toBeCalledWith(existingUser.username);

				expect(spyOnQuery).toBeCalledWith(
					getUserQuery,
					expect.any(Object),
				);

				expect(getLikes).toBeCalledWith(userWithLikes.username);

				expect(response.body.likesCount).toBe(1);

				expect(response.status).toBe(200);
			},
		);
	});

	describe('/ - like user', (): void => {
		test(
			'It should succeed on like user',
			async (): Promise<void> => {
				const getUser = jest.spyOn(
					UserService,
					'get',
				);

				const createLike = jest.spyOn(
					LikeService,
					'create',
				);
				const spyOnQuery = jest.spyOn(database, 'query');

				const response = await agent
					.post(`/like-api/user/${userWithLikes.username}/like`)
					.set('authorization', existingUser.username);

				expect(getUser).toBeCalledWith(existingUser.username);

				expect(spyOnQuery).toBeCalledWith(
					getUserQuery,
					expect.any(Object),
				);

				expect(createLike).toBeCalledWith(
					existingUser.username,
					userWithLikes.username,
				);

				expect(response.status).toBe(200);
			},
		);
	});

	describe('/ - unlike user', (): void => {
		test(
			'It should succeed on unlike user',
			async (): Promise<void> => {
				const getUser = jest.spyOn(
					UserService,
					'get',
				);

				const deleteLike = jest.spyOn(
					LikeService,
					'delete',
				);
				const spyOnQuery = jest.spyOn(database, 'query');

				const response = await agent
					.delete(`/like-api/user/${userWithLikes.username}/unlike`)
					.set('authorization', existingUser.username);

				expect(getUser).toBeCalledWith(existingUser.username);

				expect(spyOnQuery).toBeCalledWith(
					getUserQuery,
					expect.any(Object),
				);

				expect(deleteLike).toBeCalledWith(
					existingUser.username,
					userWithLikes.username,
				);

				expect(response.status).toBe(200);
			},
		);
	});
});
