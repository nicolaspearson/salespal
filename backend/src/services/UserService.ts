import { ObjectID } from 'mongodb';
import { Inject } from 'typedi';
import {
	BadRequestError,
	HttpError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError
} from '../exceptions';
import Token from '../models/internal/Token';
import User from '../models/User';
import UserRepository from '../repositories/UserRepository';

export default class UserService {
	@Inject() private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		// Override the injected repository
		if (userRepository) {
			this.userRepository = userRepository;
		}
	}

	public async authorize(token: Token): Promise<User> {
		try {
			const userResult: User = await this.findOneByTokenAndVerify(token);
			return userResult;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new UnauthorizedError('Invalid token');
		}
	}

	public async login(username: string, password: string): Promise<Token> {
		try {
			// Fetch the user from the database
			const userResult: User = await this.userRepository.findOneByFilter({
				where: {
					username
				}
			});

			// Validate the input parameters
			const userValidate: User = User.cloneUser(userResult);
			userValidate.$password = password || '';
			await userValidate.isValid();

			// Validate the provided password
			const valid = await userResult.validatePassword(password);
			if (!valid) {
				throw new UnauthorizedError('Invalid password');
			}

			// Create a token
			const newToken: Token = new Token();
			newToken.generateToken(userResult.$id);
			// Return the created token
			return newToken;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findAll(): Promise<User[]> {
		try {
			const users: User[] = await this.userRepository.getAll();
			const sanitizedUsers = users.map((user: User) => {
				user.sanitize();
				return user;
			});
			return sanitizedUsers;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findOneById(id: string | ObjectID): Promise<User> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!User.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const userResult: User = await this.userRepository.findOneById(objectId);
			return userResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findOneByTokenAndVerify(token: Token): Promise<User> {
		try {
			// Decode the token
			const decodedToken: any = await token.verifyToken();
			const userId = decodedToken.id;
			if (!User.validId(userId)) {
				throw new UnauthorizedError('Invalid token');
			}
			// Fetch the user from the database
			const userResult: User = await this.userRepository.findOneById(
				new ObjectID(userId)
			);
			if (!userResult) {
				throw new UnauthorizedError('Invalid token');
			}
			return userResult;
		} catch (error) {
			if (error instanceof HttpError) {
				if (error instanceof NotFoundError) {
					throw new UnauthorizedError('Invalid token');
				}
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async save(user: User): Promise<User> {
		try {
			// Check if the user is valid
			const userIsValid = await user.isValid();
			if (!userIsValid) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Encrypt the users password
			await user.encryptUserPassword();
			// Save the user to the database
			const userResult: User = await this.userRepository.save(user);
			return userResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async update(user: User): Promise<User> {
		try {
			// Check if the user is valid
			const userIsValid = await user.isValid();
			if (!userIsValid || !User.validId(user.$id)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Encrypt the users password
			await user.encryptUserPassword();
			// Update the user on the database
			const userResult: User = await this.userRepository.updateOneById(
				user.$id,
				user
			);
			return userResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async delete(id: string | ObjectID): Promise<User> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!User.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const userResult: User = await this.userRepository.deleteOneWithId(
				objectId
			);
			userResult.$id = objectId;
			return userResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	// This method will create a default test account if it does not exist
	public async createTestAccount(): Promise<User | undefined> {
		try {
			const users: User[] = await this.findAll();
			if (users.length < 1) {
				const user: User = User.newUser({
					username: 'Tester',
					password: 'hello123',
					emailAddress: 'tester@test.com'
				});
				return await this.save(user);
			}
		} catch (error) {
			throw error;
		}
		return;
	}
}
