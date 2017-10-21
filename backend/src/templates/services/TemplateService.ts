import { ObjectID } from 'mongodb';
import { Inject } from 'typedi';
import {
	BadRequestError,
	HttpError,
	InternalServerError
} from '../../exceptions';
import Template from '../models/Template';
import TemplateRepository from '../repositories/TemplateRepository';

export default class TemplateService {
	@Inject() private templateRepository: TemplateRepository;

	constructor(templateRepository: TemplateRepository) {
		// Override the injected repository
		if (templateRepository) {
			this.templateRepository = templateRepository;
		}
	}
	public async findAll(): Promise<Template[]> {
		try {
			const templates: Template[] = await this.templateRepository.getAll();
			const sanitizedTemplates = templates.map((template: Template) => {
				template.sanitize();
				return template;
			});
			return sanitizedTemplates;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findOneById(id: string | ObjectID): Promise<Template> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!Template.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const templateResult = await this.templateRepository.findOneById(
				objectId
			);
			return templateResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async save(template: Template): Promise<Template> {
		try {
			// Check if the template is valid
			const templateIsValid = await template.isValid();
			if (!templateIsValid) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Save the template to the database
			const templateResult = await this.templateRepository.save(template);
			return templateResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async update(template: Template): Promise<Template> {
		try {
			// Check if the template is valid
			const templateIsValid = await template.isValid();
			if (!templateIsValid || !Template.validId(template.$id)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Update the template on the database
			const templateResult = await this.templateRepository.updateOneById(
				template.$id,
				template
			);
			return templateResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async delete(id: string | ObjectID): Promise<Template> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!Template.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const templateResult = await this.templateRepository.deleteOneWithId(
				objectId
			);
			templateResult.$id = objectId;
			return templateResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}
}
