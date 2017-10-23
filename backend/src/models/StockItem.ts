import {
	IsInt,
	Length,
	Max,
	Min,
	validate,
	ValidationArguments,
	ValidationError
} from 'class-validator';
import * as moment from 'moment-timezone';
import { ObjectID } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BadRequestError, HttpError } from '../exceptions';
import StockAccessory from './StockAccessory';
import StockImage from './StockImage';

/**
 * @swagger
 * definitions:
 *   StockItem:
 *     type: object
 *     properties:
 *       stockItemId:
 *         type: string
 *       registrationNumber:
 *         type: string
 *       make:
 *         type: string
 *       model:
 *         type: string
 *       modelYear:
 *         type: number
 *       odometer:
 *         type: number
 *       colour:
 *         type: string
 *       vin:
 *         type: string
 *       retailPrice:
 *         type: string
 *       costPrice:
 *         type: string
 *       accessories:
 *         type: array
 *         items:
 *           type: string
 *       images:
 *         type: array
 *         items:
 *           type: string
 *       createdAt:
 *         type: string
 *       updatedAt:
 *         type: string
 */
@Entity()
export default class StockItem {
	@ObjectIdColumn({ name: '_id' })
	private id: ObjectID;

	private stockItemId: string;

	@Column({ name: 'registration_number' })
	@Length(4, 255, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private registrationNumber: string;

	@Column({ name: 'make' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private make: string;

	@Column({ name: 'model' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private model: string;

	@Column({ name: 'model_year', type: 'integer' })
	@IsInt()
	@Min(1950)
	@Max(2100)
	private modelYear: number;

	@Column({ name: 'odometer', type: 'integer' })
	@IsInt()
	@Min(0)
	@Max(10000000)
	private odometer: number;

	@Column({ name: 'colour' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private colour: string;

	@Column({ name: 'vin' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private vin: string;

	@Column({ name: 'retail_price' })
	@Length(1, 50, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private retailPrice: string;

	@Column({ name: 'cost_price' })
	@Length(1, 50, {
		message: (args: ValidationArguments) => {
			return StockItem.getGenericValidationLengthMessage(args);
		}
	})
	private costPrice: string;

	@Column({ name: 'accessories' })
	private accessories: string[];

	@Column({ name: 'images' })
	private images: string[];

	@Column({ name: 'created_at' })
	private createdAt: Date | string;

	@Column({ name: 'updated_at', type: 'date' })
	private updatedAt: Date | string;

	private stockAccessories: StockAccessory[];

	private stockImages: StockImage[];

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

	public get $registrationNumber(): string {
		return this.registrationNumber;
	}

	public set $registrationNumber(value: string) {
		this.registrationNumber = value;
	}

	public get $make(): string {
		return this.make;
	}

	public set $make(value: string) {
		this.make = value;
	}

	public get $model(): string {
		return this.model;
	}

	public set $model(value: string) {
		this.model = value;
	}

	public get $modelYear(): number {
		return this.modelYear;
	}

	public set $modelYear(value: number) {
		this.modelYear = value;
	}

	public get $odometer(): number {
		return this.odometer;
	}

	public set $odometer(value: number) {
		this.odometer = value;
	}

	public get $colour(): string {
		return this.colour;
	}

	public set $colour(value: string) {
		this.colour = value;
	}

	public get $vin(): string {
		return this.vin;
	}

	public set $vin(value: string) {
		this.vin = value;
	}

	public get $retailPrice(): string {
		return this.retailPrice;
	}

	public set $retailPrice(value: string) {
		this.retailPrice = value;
	}

	public get $costPrice(): string {
		return this.costPrice;
	}

	public set $costPrice(value: string) {
		this.costPrice = value;
	}

	public get $accessories(): string[] {
		return this.accessories;
	}

	public set $accessories(value: string[]) {
		this.accessories = value;
	}

	public get $images(): string[] {
		return this.images;
	}

	public set $images(value: string[]) {
		this.images = value;
	}

	public get $createdAt(): Date | string {
		return this.createdAt;
	}

	public set $createdAt(value: Date | string) {
		this.createdAt = value;
	}

	public get $updatedAt(): Date | string {
		return this.updatedAt;
	}

	public set $updatedAt(value: Date | string) {
		this.updatedAt = value;
	}

	public get $stockAccessories(): StockAccessory[] {
		return this.stockAccessories;
	}

	public set $stockAccessories(value: StockAccessory[]) {
		this.stockAccessories = value;
	}

	public get $stockImages(): StockImage[] {
		return this.stockImages;
	}

	public set $stockImages(value: StockImage[]) {
		this.stockImages = value;
	}

	public static newStockItem(obj: {
		id?: ObjectID;
		stockItemId?: string;
		registrationNumber?: string;
		make?: string;
		model?: string;
		modelYear?: number;
		odometer?: number;
		colour?: string;
		vin?: string;
		retailPrice?: string;
		costPrice?: string;
		accessories?: string[];
		images?: string[];
		createdAt?: Date | string;
		updatedAt?: Date | string;
	}) {
		const newStockItem = new StockItem();
		if (obj.id) {
			newStockItem.id = obj.id;
		}
		if (obj.stockItemId) {
			newStockItem.stockItemId = obj.stockItemId;
		}
		if (obj.registrationNumber) {
			newStockItem.registrationNumber = obj.registrationNumber;
		}
		if (obj.make) {
			newStockItem.make = obj.make;
		}
		if (obj.model) {
			newStockItem.model = obj.model;
		}
		if (obj.modelYear) {
			newStockItem.modelYear = obj.modelYear;
		}
		if (obj.odometer) {
			newStockItem.odometer = obj.odometer;
		}
		if (obj.colour) {
			newStockItem.colour = obj.colour;
		}
		if (obj.vin) {
			newStockItem.vin = obj.vin;
		}
		if (obj.retailPrice) {
			newStockItem.retailPrice = obj.retailPrice;
		}
		if (obj.costPrice) {
			newStockItem.costPrice = obj.costPrice;
		}
		if (obj.accessories) {
			newStockItem.accessories = obj.accessories;
		}
		if (obj.images) {
			newStockItem.images = obj.images;
		}
		if (obj.createdAt) {
			newStockItem.createdAt = obj.createdAt;
		}
		if (obj.updatedAt) {
			newStockItem.updatedAt = obj.updatedAt;
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
		if (obj.registrationNumber) {
			newStockItem.registrationNumber = obj.registrationNumber;
		}
		if (obj.make) {
			newStockItem.make = obj.make;
		}
		if (obj.model) {
			newStockItem.model = obj.model;
		}
		if (obj.modelYear) {
			newStockItem.modelYear = obj.modelYear;
		}
		if (obj.odometer) {
			newStockItem.odometer = obj.odometer;
		}
		if (obj.colour) {
			newStockItem.colour = obj.colour;
		}
		if (obj.vin) {
			newStockItem.vin = obj.vin;
		}
		if (obj.retailPrice) {
			newStockItem.retailPrice = obj.retailPrice;
		}
		if (obj.costPrice) {
			newStockItem.costPrice = obj.costPrice;
		}
		if (obj.accessories) {
			newStockItem.accessories = obj.accessories;
		}
		if (obj.images) {
			newStockItem.images = obj.images;
		}
		if (obj.createdAt) {
			newStockItem.createdAt = obj.createdAt;
		}
		if (obj.updatedAt) {
			newStockItem.updatedAt = obj.updatedAt;
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
		if (this.createdAt) {
			const localCreatedAt = moment(this.createdAt)
				.tz(moment.tz.guess())
				.format('YYYY-MM-DD HH:mm:ssZ');
			this.createdAt = localCreatedAt;
		}
		if (this.updatedAt) {
			const localUpdatedAt = moment(this.updatedAt)
				.tz(moment.tz.guess())
				.format('YYYY-MM-DD HH:mm:ssZ');
			this.updatedAt = localUpdatedAt;
		}
		return this;
	}

	private static getGenericValidationLengthMessage(args: ValidationArguments) {
		return (
			'Too short, minimum length is ' + args.constraints[0] + ' characters'
		);
	}
}
