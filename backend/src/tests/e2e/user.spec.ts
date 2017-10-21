import { expect } from 'chai';
import * as config from 'config';
import { Server } from 'http';
import 'mocha';
import { ObjectID } from 'mongodb';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { agent } from 'supertest';
import { Container } from 'typedi';
import { useContainer as ormUseContainer } from 'typeorm';
import { Application, IApplicationOptions } from '../../app/Application';
import Token from '../../models/internal/Token';
import User from '../../models/User';
import UserTestBuilder from '../utils/UserTestBuilder';

describe('End to End: User Actions', () => {
	let app: Server;

	const basePath = config.get('server.api.basePath');

	let firstUserId: ObjectID = new ObjectID(Math.random() * 10);
	const firstUserUsername = 'Tester';
	const firstUserPassword = 'hello123';
	const firstUserEmailAddress = 'tester@test.com';

	let secondUserId: ObjectID = new ObjectID(Math.random() * 10);
	const secondUserUsername = 'Tester2';
	const secondUserEmailAddress = 'tester2@test.com';
	const secondUserPassword = 'hello321';
	const secondUserNewEmailAddress = 'testee@test.com';

	let token: Token;

	before(async () => {
		if (Application.getApp() && Application.getServer()) {
			app = Application.getServer();
		} else {
			routingUseContainer(Container);
			ormUseContainer(Container);
			const application: Application = Container.get(Application);
			app = await application.setupApplication({
				useKoaLogger: false
			} as IApplicationOptions);
		}
	});

	// POST first User
	describe('POST /users', () => {
		it('should add a new user', async () => {
			const response = await agent(app)
				.post(`${basePath}/users`)
				.set('x-access-token', config.get('server.auth.accessToken'))
				.accept('json')
				.send(
					UserTestBuilder.newUser()
						.withUsername(firstUserUsername)
						.withEmailAddress(firstUserEmailAddress)
						.withPassword(firstUserPassword)
						.build()
				)
				.expect(200);

			const user: User = User.newUser(response.body.data);
			firstUserId = new ObjectID(user.$userId);
			expect(user.$userId.length).is.equals(24);
		});
	});

	// GET Token
	describe('POST /users/login', () => {
		it('returns a token by logging in', async () => {
			const response = await agent(app)
				.post(`${basePath}/users/login`)
				.set('x-access-token', config.get('server.auth.accessToken'))
				.accept('json')
				.send({
					username: firstUserUsername,
					password: firstUserPassword
				})
				.expect(200);
			token = new Token(response.body.data.token);
			expect(token).to.have.property('token');
		});
	});

	// GET First User By Id
	describe('GET /users/:id', () => {
		it('should return a specific user', async () => {
			const response = await agent(app)
				.get(`${basePath}/users/${firstUserId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.expect(200);

			const user: User = User.newUser(response.body.data);
			expect(user.$userId).to.equal(firstUserId.toHexString());
			expect(user.$username).to.equal(firstUserUsername);
			expect(user.$emailAddress).to.equal(firstUserEmailAddress);
		});

		it("should return a 404 when the user with the specified id doesn't exist", async () => {
			const newId: ObjectID = new ObjectID(Math.random() * 10);
			await agent(app)
				.get(`/users/${newId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.accept('json')
				.expect(404);
		});
	});

	// POST Second User
	describe('POST /users', () => {
		it('should add a new user', async () => {
			const response = await agent(app)
				.post(`${basePath}/users`)
				.set('x-access-token', config.get('server.auth.accessToken'))
				.accept('json')
				.send(
					UserTestBuilder.newUser()
						.withUsername(secondUserUsername)
						.withEmailAddress(secondUserEmailAddress)
						.withPassword(secondUserPassword)
						.build()
				)
				.expect(200);

			const user: User = User.newUser(response.body.data);
			secondUserId = new ObjectID(user.$userId);
			expect(user.$userId.length).is.equals(24);
		});
	});

	// GET Second User By Id
	describe('GET /users/:id', () => {
		it('should return a specific user', async () => {
			const response = await agent(app)
				.get(`${basePath}/users/${secondUserId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.expect(200);

			const user: User = User.newUser(response.body.data);
			expect(user.$userId).to.equal(secondUserId.toHexString());
			expect(user.$username).to.equal(secondUserUsername);
			expect(user.$emailAddress).to.equal(secondUserEmailAddress);
		});

		it("should return a 404 when the user with the specified id doesn't exist", async () => {
			const newId: ObjectID = new ObjectID(Math.random() * 10);
			await agent(app)
				.get(`${basePath}/users/${newId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.expect(404);
		});
	});

	// PUT By Id
	describe('PUT /users/:id', () => {
		it('should update the user with the given Id', async () => {
			const response = await agent(app)
				.put(`${basePath}/users/${secondUserId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.send(
					UserTestBuilder.newUser()
						.withId(secondUserId)
						.withUsername(secondUserUsername)
						.withEmailAddress(secondUserNewEmailAddress)
						.withPassword(secondUserPassword)
						.build()
				)
				.expect(200);

			const user: User = User.newUser(response.body.data);
			expect(user.$userId).to.equal(secondUserId.toHexString());
			expect(user.$username).to.equal(secondUserUsername);
			expect(user.$emailAddress).to.equal(secondUserNewEmailAddress);
		});

		it('should return 404 if the user does not exist', async () => {
			const newId: ObjectID = new ObjectID(Math.random() * 10);
			await agent(app)
				.put(`${basePath}/users/${newId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.send(
					UserTestBuilder.newUser()
						.withId(newId)
						.withUsername(secondUserUsername)
						.withEmailAddress(secondUserEmailAddress)
						.withPassword(secondUserPassword)
						.build()
				)
				.expect(404);
		});

		it('should return 400 if the id of the request object does not match the url id', async () => {
			await agent(app)
				.put(`${basePath}/users/10`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.send(
					UserTestBuilder.newUser()
						.withId(new ObjectID(Math.random() * 10))
						.withUsername(secondUserUsername)
						.withEmailAddress(secondUserEmailAddress)
						.withPassword(secondUserPassword)
						.build()
				)
				.expect(400);
		});
	});

	// DELETE By Id
	describe('DELETE /users/:id', () => {
		it('should delete the user with the given id', async () => {
			await agent(app)
				.delete(`${basePath}/users/${secondUserId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.expect(200);
		});

		it('should return a 404 if the user does not exist (anymore)', async () => {
			await agent(app)
				.delete(`${basePath}/users/${secondUserId.toHexString()}`)
				.set({ Authorization: `Bearer ${token.$token}` })
				.set('x-access-token', `Bearer ${config.get('server.auth.testToken')}`)
				.accept('json')
				.expect(404);
		});
	});
});
