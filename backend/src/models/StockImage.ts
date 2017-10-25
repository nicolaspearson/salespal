import { IsNotEmpty, validate, ValidationError } from 'class-validator';
import { ObjectID } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BadRequestError, HttpError } from '../exceptions';

/**
 * @swagger
 * definitions:
 *   StockImage:
 *     type: object
 *     properties:
 *       stockImageId:
 *         type: string
 *       name:
 *         type: string
 *       image:
 *         type: object
 */
@Entity()
export default class StockImage {
	@ObjectIdColumn({ name: '_id' })
	private id: ObjectID;

	private stockImageId: string;

	private name: string;

	@Column({ name: 'image', type: 'binary' })
	@IsNotEmpty()
	private image: any;

	public get $id(): ObjectID {
		return this.id;
	}

	public set $id(value: ObjectID) {
		this.id = value;
	}

	public get $stockImageId(): string {
		return this.stockImageId;
	}

	public set $stockImageId(value: string) {
		this.stockImageId = value;
	}

	public get $name(): string {
		return this.name;
	}

	public set $name(value: string) {
		this.name = value;
	}

	public get $image(): any {
		return this.image;
	}

	public set $image(value: any) {
		this.image = value;
	}

	public static newStockImage(obj: {
		id?: ObjectID;
		stockImageId?: string;
		name?: string;
		image?: any;
	}) {
		const newStockImage = new StockImage();
		if (obj.id) {
			newStockImage.id = obj.id;
		}
		if (obj.stockImageId) {
			newStockImage.stockImageId = obj.stockImageId;
		}
		if (obj.name) {
			newStockImage.name = obj.name;
		}
		if (obj.image) {
			newStockImage.image = obj.image;
		}
		return newStockImage;
	}

	public static cloneStockImage(obj: StockImage) {
		const newStockImage = new StockImage();
		if (obj.id) {
			newStockImage.id = obj.id;
		}
		if (obj.stockImageId) {
			newStockImage.stockImageId = obj.stockImageId;
		}
		if (obj.name) {
			newStockImage.name = obj.name;
		}
		if (obj.image) {
			newStockImage.image = obj.image;
		}
		return newStockImage;
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

	public sanitize(): StockImage {
		if (this.id) {
			this.stockImageId = this.id.toHexString();
		}
		delete this.id;
		if (this.image && this.image.data) {
			let newImage;
			if (this.image.data.buffer) {
				newImage = new Buffer(this.image.data.buffer).toString('base64');
			} else {
				newImage = new Buffer(this.image.data).toString('base64');
			}
			this.image = newImage;
		}
		return this;
	}
}
