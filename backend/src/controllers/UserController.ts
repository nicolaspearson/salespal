import * as config from 'config';
import { ObjectID } from 'mongodb';
import {
	Authorized,
	Body,
	BodyParam,
	Delete,
	Get,
	HeaderParam,
	JsonController,
	Param,
	Post,
	Put
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { BadRequestError, UnauthorizedError } from '../exceptions';
import Token from '../models/internal/Token';
import User from '../models/User';
import UserService from '../services/UserService';

/**
 * @swagger
 * tags:
 *   name: user
 *   description: User
 */
@Service()
@JsonController()
export default class UserController {
	@Inject() private userService: UserService;

	constructor(userService: UserService) {
		// Override the injected service
		if (userService) {
			this.userService = userService;
		}
	}

	/**
	 * @swagger
	 * /users/{id}:
	 *   get:
	 *     summary: Find a specific user
	 *     description: Retrieves a specific user from the database
	 *     operationId: findUserById
	 *     tags: [user]
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: Authorization
	 *         in: header
	 *         description: jwt access token
	 *         required: true
	 *         type: string
	 *       - name: id
	 *         in: path
	 *         description: id of the user
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The found user
	 *         schema:
	 *           $ref: '#/definitions/User'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       401:
	 *         $ref: '#/responses/Unauthorized'
	 *       403:
	 *         $ref: '#/responses/Forbidden'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 *       405:
	 *         $ref: '#/responses/MethodNotAllowed'
	 *       406:
	 *         $ref: '#/responses/NotAcceptable'
	 *       500:
	 *         $ref: '#/responses/InternalServerError'
	 *       504:
	 *         $ref: '#/responses/GatewayTimeout'
	 *       default:
	 *         $ref: '#/responses/DefaultError'
	 */
	@Get('/users/:id')
	@Authorized()
	public async findUserById(@Param('id') id: string): Promise<User> {
		return await this.userService.findOneById(id);
	}

	/**
	 * @swagger
	 * /users:
	 *   post:
	 *     summary: Save a new user
	 *     description: Saves a new user to the database
	 *     operationId: saveUser
	 *     tags: [user]
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: x-access-token
	 *         in: header
	 *         description: api access token
	 *         required: true
	 *         type: string
	 *       - name: user
	 *         in: body
	 *         description: the user
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/User'
	 *     responses:
	 *       200:
	 *         description: The saved user
	 *         schema:
	 *           $ref: '#/definitions/User'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       401:
	 *         $ref: '#/responses/Unauthorized'
	 *       403:
	 *         $ref: '#/responses/Forbidden'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 *       405:
	 *         $ref: '#/responses/MethodNotAllowed'
	 *       406:
	 *         $ref: '#/responses/NotAcceptable'
	 *       500:
	 *         $ref: '#/responses/InternalServerError'
	 *       504:
	 *         $ref: '#/responses/GatewayTimeout'
	 *       default:
	 *         $ref: '#/responses/DefaultError'
	 */
	@Post('/users')
	public async saveUser(
		@HeaderParam('x-access-token') accessToken: string,
		@Body({ validate: false })
		user: User
	): Promise<User> {
		if (
			!accessToken ||
			!(accessToken === config.get('server.auth.accessToken'))
		) {
			throw new UnauthorizedError('Invalid API token');
		}
		if (user.$id) {
			user.$id = new ObjectID(user.$id);
		} else if (user.$userId) {
			user.$id = new ObjectID(user.$userId);
		}
		return await this.userService.save(user);
	}

	/**
	 * @swagger
	 * /users/{id}:
	 *   put:
	 *     summary: Updates a specific user
	 *     description: Updates a specific user on the database
	 *     operationId: updateUser
	 *     tags: [user]
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: Authorization
	 *         in: header
	 *         description: jwt access token
	 *         required: true
	 *         type: string
	 *       - name: id
	 *         in: path
	 *         description: id of the user
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The updated user
	 *         schema:
	 *           $ref: '#/definitions/User'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       401:
	 *         $ref: '#/responses/Unauthorized'
	 *       403:
	 *         $ref: '#/responses/Forbidden'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 *       405:
	 *         $ref: '#/responses/MethodNotAllowed'
	 *       406:
	 *         $ref: '#/responses/NotAcceptable'
	 *       500:
	 *         $ref: '#/responses/InternalServerError'
	 *       504:
	 *         $ref: '#/responses/GatewayTimeout'
	 *       default:
	 *         $ref: '#/responses/DefaultError'
	 */
	@Put('/users/:id')
	@Authorized()
	public async updateUser(
		@Param('id') id: string,
		@Body({ validate: false })
		user: User
	): Promise<User> {
		if (
			!user ||
			(String(id) !== String(user.$id) && String(id) !== String(user.$userId))
		) {
			throw new BadRequestError(
				'An id mismatch error occurred. The id supplied in the url parameter does not match the supplied object'
			);
		}
		user.$id = new ObjectID(id);
		return await this.userService.update(user);
	}

	/**
	 * @swagger
	 * /users/{id}:
	 *   delete:
	 *     summary: Deletes a specific user
	 *     description: Removes a specific user from the database
	 *     operationId: deleteUser
	 *     tags: [user]
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: Authorization
	 *         in: header
	 *         description: jwt access token
	 *         required: true
	 *         type: string
	 *       - name: id
	 *         in: path
	 *         description: id of the user
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The deleted user
	 *         schema:
	 *           $ref: '#/definitions/User'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       401:
	 *         $ref: '#/responses/Unauthorized'
	 *       403:
	 *         $ref: '#/responses/Forbidden'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 *       405:
	 *         $ref: '#/responses/MethodNotAllowed'
	 *       406:
	 *         $ref: '#/responses/NotAcceptable'
	 *       500:
	 *         $ref: '#/responses/InternalServerError'
	 *       504:
	 *         $ref: '#/responses/GatewayTimeout'
	 *       default:
	 *         $ref: '#/responses/DefaultError'
	 */
	@Delete('/users/:id')
	@Authorized()
	public async deleteUser(@Param('id') id: string): Promise<User> {
		return await this.userService.delete(id);
	}

	/**
	 * @swagger
	 * /users/login:
	 *   post:
	 *     summary: Authenticates a specific user
	 *     description: Authenticates the provided user on the database
	 *     operationId: loginUser
	 *     tags: [user]
	 *     consumes:
	 *       - application/json
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: x-access-token
	 *         in: header
	 *         description: api access token
	 *         required: true
	 *         type: string
	 *       - name: loginRequest
	 *         in: body
	 *         description: The users login credentials
	 *         required: true
	 *         schema:
	 *           type: object
	 *           properties:
	 *             username:
	 *               description: username of the user
	 *               type: string
	 *             password:
	 *               type: string
	 *               description: password of the user
	 *     responses:
	 *       200:
	 *         description: The users token
	 *         schema:
	 *           $ref: '#/definitions/Token'
	 *       400:
	 *         $ref: '#/responses/BadRequest'
	 *       401:
	 *         $ref: '#/responses/Unauthorized'
	 *       403:
	 *         $ref: '#/responses/Forbidden'
	 *       404:
	 *         $ref: '#/responses/NotFound'
	 *       405:
	 *         $ref: '#/responses/MethodNotAllowed'
	 *       406:
	 *         $ref: '#/responses/NotAcceptable'
	 *       500:
	 *         $ref: '#/responses/InternalServerError'
	 *       504:
	 *         $ref: '#/responses/GatewayTimeout'
	 *       default:
	 *         $ref: '#/responses/DefaultError'
	 */
	@Post('/users/login')
	public async loginUser(
		@HeaderParam('x-access-token') accessToken: string,
		@BodyParam('username') username: string,
		@BodyParam('password') password: string
	): Promise<Token> {
		if (
			!accessToken ||
			!(accessToken === config.get('server.auth.accessToken'))
		) {
			throw new UnauthorizedError('Invalid API token');
		}
		return await this.userService.login(username, password);
	}
}
