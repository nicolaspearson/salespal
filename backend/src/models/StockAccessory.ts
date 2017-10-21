import {
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
 *   StockAccessory:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       description:
 *         type: string
 */
@Entity()
export default class StockAccessory {
	@ObjectIdColumn({ name: '_id' })
	private id: ObjectID;

	private stockAccessoryId: string;

	@Column({ name: 'name' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockAccessory.getGenericValidationLengthMessage(args);
		}
	})
	private name: string;

	@Column({ name: 'description' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockAccessory.getGenericValidationLengthMessage(args);
		}
	})
	private description: string;

	public get $id(): ObjectID {
		return this.id;
	}

	public set $id(value: ObjectID) {
		this.id = value;
	}

	public get $stockAccessoryId(): string {
		return this.stockAccessoryId;
	}

	public set $stockAccessoryId(value: string) {
		this.stockAccessoryId = value;
	}

	public get $name(): string {
		return this.name;
	}

	public set $name(value: string) {
		this.name = value;
	}

	public get $description(): string {
		return this.description;
	}

	public set $description(value: string) {
		this.description = value;
	}

	public static newStockAccessory(obj: {
		id?: ObjectID;
		stockAccessoryId?: string;
		name?: string;
		description?: string;
	}) {
		const newStockAccessory = new StockAccessory();
		if (obj.id) {
			newStockAccessory.id = obj.id;
		}
		if (obj.stockAccessoryId) {
			newStockAccessory.stockAccessoryId = obj.stockAccessoryId;
		}
		if (obj.name) {
			newStockAccessory.name = obj.name;
		}
		if (obj.description) {
			newStockAccessory.description = obj.description;
		}
		return newStockAccessory;
	}

	public static cloneStockAccessory(obj: StockAccessory) {
		const newStockAccessory = new StockAccessory();
		if (obj.id) {
			newStockAccessory.id = obj.id;
		}
		if (obj.stockAccessoryId) {
			newStockAccessory.stockAccessoryId = obj.stockAccessoryId;
		}
		if (obj.name) {
			newStockAccessory.name = obj.name;
		}
		if (obj.description) {
			newStockAccessory.description = obj.description;
		}
		return newStockAccessory;
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

	public sanitize(): StockAccessory {
		if (this.id) {
			this.stockAccessoryId = this.id.toHexString();
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
