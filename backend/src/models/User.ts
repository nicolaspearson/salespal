import * as bcrypt from 'bcrypt';
import {
	IsEmail,
	Length,
	validate,
	ValidationArguments,
	ValidationError
} from 'class-validator';
import { ObjectID } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BadRequestError, HttpError } from '../exceptions';

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       username:
 *         type: string
 *       emailAddress:
 *         type: string
 *       password:
 *         type: string
 */
@Entity()
export default class User {
	@ObjectIdColumn({ name: '_id' })
	private id: ObjectID;

	private userId: string;

	@Column({ name: 'username' })
	@Length(3, 255, {
		message: (args: ValidationArguments) => {
			return User.getGenericValidationLengthMessage(args);
		}
	})
	private username: string;

	@Column({ name: 'email_address' })
	@IsEmail(
		{},
		{
			message: 'Must be a valid email address'
		}
	)
	private emailAddress: string;

	@Column({ name: 'password' })
	@Length(6, 255, {
		message: (args: ValidationArguments) => {
			return User.getGenericValidationLengthMessage(args);
		}
	})
	private password: string;

	public get $id(): ObjectID {
		return this.id;
	}

	public set $id(value: ObjectID) {
		this.id = value;
	}

	public get $userId(): string {
		return this.userId;
	}

	public set $userId(value: string) {
		this.userId = value;
	}

	public get $username(): string {
		return this.username;
	}

	public set $username(value: string) {
		this.username = value;
	}

	public get $emailAddress(): string {
		return this.emailAddress;
	}

	public set $emailAddress(value: string) {
		this.emailAddress = value;
	}

	public get $password(): string {
		return this.password;
	}

	public set $password(value: string) {
		this.password = value;
	}

	public static newUser(obj: {
		id?: ObjectID;
		userId?: string;
		username?: string;
		emailAddress?: string;
		password?: string;
	}) {
		const newUser = new User();
		if (obj.id) {
			newUser.id = obj.id;
		}
		if (obj.userId) {
			newUser.userId = obj.userId;
		}
		if (obj.username) {
			newUser.username = obj.username;
		}
		if (obj.emailAddress) {
			newUser.emailAddress = obj.emailAddress;
		}
		if (obj.password) {
			newUser.password = obj.password;
		}
		return newUser;
	}

	public static cloneUser(obj: User) {
		const newUser = new User();
		if (obj.id) {
			newUser.id = obj.id;
		}
		if (obj.userId) {
			newUser.userId = obj.userId;
		}
		if (obj.username) {
			newUser.username = obj.username;
		}
		if (obj.emailAddress) {
			newUser.emailAddress = obj.emailAddress;
		}
		if (obj.password) {
			newUser.password = obj.password;
		}
		return newUser;
	}

	public static async encryptPassword(password: string): Promise<string> {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);
			return hash;
		} catch (error) {
			return error;
		}
	}

	public async encryptUserPassword(): Promise<string> {
		try {
			this.$password = await User.encryptPassword(this.$password);
			return this.$password;
		} catch (error) {
			return error;
		}
	}

	public async validatePassword(password: string): Promise<boolean> {
		try {
			const isMatch = await bcrypt.compare(password, this.$password);
			return isMatch;
		} catch (error) {
			return error;
		}
	}

	public static validId(id: ObjectID): boolean {
		return ObjectID.isValid(id);
	}

	public async isValid(): Promise<boolean> {
		try {
			const errors: ValidationError[] = await validate(this, {
				validationError: { target: false, value: false }
			});
			if (errors.length > 0) {
				throw new BadRequestError(
					'Validation failed on the provided request',
					errors
				);
			}
			return true;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new BadRequestError('Unable to validate request: ' + error);
		}
	}

	public sanitize(): User {
		delete this.password;
		if (this.id) {
			this.userId = this.id.toHexString();
		}
		delete this.id;
		return this;
	}

	private static getGenericValidationLengthMessage(args: ValidationArguments) {
		return (
			'Too short, minimum length is ' + args.constraints[0] + ' characters'
		);
	}
}
