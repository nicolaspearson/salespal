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
 *   StockItem:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       description:
 *         type: string
 */
@Entity()
export default class StockItem {
	@ObjectIdColumn({ name: '_id' })
	private id: ObjectID;

	private stockItemId: string;

	@Column({ name: 'description' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private description: string;

	public get $id(): ObjectID {
		return this.id;
	}

	public set $id(value: ObjectID) {
		this.id = value;
	}

	public get $stockItemId(): string {
		return this.stockItemId;
	}

	public set $stockItemId(value: string) {
		this.stockItemId = value;
	}

	public get $description(): string {
		return this.description;
	}

	public set $description(value: string) {
		this.description = value;
	}

	public static newStockItem(obj: {
		id?: ObjectID;
		stockItemId?: string;
		description?: string;
	}) {
		const newStockItem = new StockItem();
		if (obj.id) {
			newStockItem.id = obj.id;
		}
		if (obj.stockItemId) {
			newStockItem.stockItemId = obj.stockItemId;
		}
		if (obj.description) {
			newStockItem.description = obj.description;
		}
		return newStockItem;
	}

	public static cloneStockItem(obj: StockItem) {
		const newStockItem = new StockItem();
		if (obj.id) {
			newStockItem.id = obj.id;
		}
		if (obj.stockItemId) {
			newStockItem.stockItemId = obj.stockItemId;
		}
		if (obj.description) {
			newStockItem.description = obj.description;
		}
		return newStockItem;
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

	public sanitize(): StockItem {
		if (this.id) {
			this.stockItemId = this.id.toHexString();
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
