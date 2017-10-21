import {
	Length,
	validate,
	ValidationArguments,
	ValidationError
} from 'class-validator';
import { ObjectID } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { BadRequestError, HttpError } from '../../exceptions';

/**
 * @swagger
 * definitions:
 *   Template:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       description:
 *         type: string
 */
@Entity()
export default class Template {
	@ObjectIdColumn({ name: 'id' })
	private id: ObjectID;

	private templateId: string;

	@Column({ name: 'description' })
	@Length(1, 255, {
		message: (args: ValidationArguments) => {
			return Template.getGenericValidationLengthMessage(args);
		}
	})
	private description: string;

	public get $id(): ObjectID {
		return this.id;
	}

	public set $id(value: ObjectID) {
		this.id = value;
	}

	public get $templateId(): string {
		return this.templateId;
	}

	public set $templateId(value: string) {
		this.templateId = value;
	}

	public get $description(): string {
		return this.description;
	}

	public set $description(value: string) {
		this.description = value;
	}

	public static newTemplate(obj: {
		id?: ObjectID;
		templateId?: string;
		description?: string;
	}) {
		const newTemplate = new Template();
		if (obj.id) {
			newTemplate.id = obj.id;
		}
		if (obj.templateId) {
			newTemplate.templateId = obj.templateId;
		}
		if (obj.description) {
			newTemplate.description = obj.description;
		}
		return newTemplate;
	}

	public static cloneTemplate(obj: Template) {
		const newTemplate = new Template();
		if (obj.id) {
			newTemplate.id = obj.id;
		}
		if (obj.templateId) {
			newTemplate.templateId = obj.templateId;
		}
		if (obj.description) {
			newTemplate.description = obj.description;
		}
		return newTemplate;
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

	public sanitize(): Template {
		if (this.id) {
			this.templateId = this.id.toHexString();
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
