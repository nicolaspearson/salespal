import { ObjectID } from 'mongodb';
import {
	Authorized,
	Body,
	Delete,
	Get,
	JsonController,
	Param,
	Post,
	Put
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { BadRequestError } from '../../exceptions';
import Template from '../models/Template';
import TemplateService from '../services/TemplateService';

/**
 * @swagger
 * tags:
 *   name: template
 *   description: Template
 */
@Service()
@JsonController()
export default class TemplateController {
	@Inject() private templateService: TemplateService;

	constructor(templateService: TemplateService) {
		// Override the injected service
		if (templateService) {
			this.templateService = templateService;
		}
	}

	/**
	 * @swagger
	 * /templates:
	 *   get:
	 *     summary: Get all templates
	 *     description: Get an array of all templates
	 *     operationId: getAllTemplates
	 *     tags: [template]
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: Authorization
	 *         in: header
	 *         description: jwt access token
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: An array of templates
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/Template'
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
	@Get('/templates')
	@Authorized()
	public async getAllTemplates(): Promise<Template[]> {
		return await this.templateService.findAll();
	}

	/**
	 * @swagger
	 * /templates/{id}:
	 *   get:
	 *     summary: Find a specific template
	 *     description: Retrieves a specific template from the database
	 *     operationId: findTemplateById
	 *     tags: [template]
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
	 *         description: id of the template
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The found template
	 *         schema:
	 *           $ref: '#/definitions/Template'
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
	@Get('/templates/:id')
	@Authorized()
	public async findTemplateById(@Param('id') id: string): Promise<Template> {
		return await this.templateService.findOneById(id);
	}

	/**
	 * @swagger
	 * /templates:
	 *   post:
	 *     summary: Save a new template
	 *     description: Saves a new template to the database
	 *     operationId: saveTemplate
	 *     tags: [template]
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
	 *       - name: template
	 *         in: body
	 *         description: the template
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/Template'
	 *     responses:
	 *       200:
	 *         description: The saved template
	 *         schema:
	 *           $ref: '#/definitions/Template'
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
	@Post('/templates')
	@Authorized()
	public async saveTemplate(@Body() template: Template) {
		if (template.$id) {
			template.$id = new ObjectID(template.$id);
		} else if (template.$templateId) {
			template.$id = new ObjectID(template.$templateId);
		}
		return await this.templateService.save(template);
	}

	/**
	 * @swagger
	 * /templates/{id}:
	 *   put:
	 *     summary: Updates a specific template
	 *     description: Updates a specific template on the database
	 *     operationId: updateTemplate
	 *     tags: [template]
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
	 *         description: id of the template
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The updated template
	 *         schema:
	 *           $ref: '#/definitions/Template'
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
	@Put('/templates/:id')
	@Authorized()
	public async updateTemplate(
		@Param('id') id: string,
		@Body() template: Template
	) {
		if (
			String(id) !== String(template.$id) &&
			String(id) !== template.$templateId
		) {
			throw new BadRequestError(
				'An id mismatch error occurred. The id supplied in the url parameter does not match the supplied object'
			);
		}
		template.$id = new ObjectID(id);
		return await this.templateService.update(template);
	}

	/**
	 * @swagger
	 * /templates/{id}:
	 *   delete:
	 *     summary: Deletes a specific template
	 *     description: Removes a specific template from the database
	 *     operationId: deleteTemplate
	 *     tags: [template]
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
	 *         description: id of the template
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The deleted template
	 *         schema:
	 *           $ref: '#/definitions/Template'
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
	@Delete('/templates/:id')
	@Authorized()
	public async deleteTemplate(@Param('id') id: string) {
		return await this.templateService.delete(id);
	}
}
