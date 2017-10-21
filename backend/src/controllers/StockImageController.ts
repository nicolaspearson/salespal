import * as fs from 'fs-extra';
import { ObjectID } from 'mongodb';
import {
	Authorized,
	BodyParam,
	Delete,
	Get,
	JsonController,
	Param,
	Post,
	Put,
	UploadedFile
} from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { KoaMulter } from '../app/KoaMulter';
import { BadRequestError } from '../exceptions';
import StockImage from '../models/StockImage';
import StockImageService from '../services/StockImageService';

/**
 * @swagger
 * tags:
 *   name: stockImage
 *   description: StockImage
 */
@Service()
@JsonController()
export default class StockImageController {
	@Inject() private stockImageService: StockImageService;

	constructor(stockImageService: StockImageService) {
		// Override the injected service
		if (stockImageService) {
			this.stockImageService = stockImageService;
		}
	}

	/**
	 * @swagger
	 * /stockImages:
	 *   get:
	 *     summary: Get all stock images
	 *     description: Get an array of all stock images
	 *     operationId: getAllStockImages
	 *     tags: [stockImage]
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
	 *         description: An array of stock images
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/StockImage'
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
	@Get('/stockImages')
	@Authorized()
	public async getAllStockImages(): Promise<StockImage[]> {
		return await this.stockImageService.findAll();
	}

	/**
	 * @swagger
	 * /stockImages/{id}:
	 *   get:
	 *     summary: Find a specific stock image
	 *     description: Retrieves a specific stock image from the database
	 *     operationId: findStockImageById
	 *     tags: [stockImage]
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
	 *         description: id of the stock image
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The found stock image
	 *         schema:
	 *           $ref: '#/definitions/StockImage'
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
	@Get('/stockImages/:id')
	@Authorized()
	public async findStockImageById(
		@Param('id') id: string
	): Promise<StockImage> {
		return await this.stockImageService.findOneById(id);
	}

	/**
	 * @swagger
	 * /stockImages:
	 *   post:
	 *     summary: Save a new stock image
	 *     description: Saves a new stock image to the database
	 *     operationId: saveStockImage
	 *     tags: [stockImage]
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
	 *       - name: stock image
	 *         in: body
	 *         description: the stock image
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/StockImage'
	 *     responses:
	 *       200:
	 *         description: The saved stock image
	 *         schema:
	 *           $ref: '#/definitions/StockImage'
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
	@Post('/stockImages')
	@Authorized()
	public async saveStockImage(
		@BodyParam('name') name: string,
		@BodyParam('id') id: string,
		@BodyParam('stockImageId') stockImageId: string,
		@UploadedFile('image', { options: KoaMulter.getKoaMulterOptions() })
		image: any
	) {
		const stockImage: StockImage = new StockImage();
		if (id) {
			stockImage.$id = new ObjectID(id);
		} else if (stockImageId) {
			stockImage.$id = new ObjectID(stockImageId);
		}
		stockImage.$name = name;
		stockImage.$image = { data: undefined, contentType: 'image/png' };
		stockImage.$image.data = await fs.readFileSync(image.path);
		return await this.stockImageService.save(stockImage);
	}

	/**
	 * @swagger
	 * /stock images/{id}:
	 *   put:
	 *     summary: Updates a specific stock image
	 *     description: Updates a specific stock image on the database
	 *     operationId: updateStockImage
	 *     tags: [stockImage]
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
	 *         description: id of the stock image
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The updated stock image
	 *         schema:
	 *           $ref: '#/definitions/StockImage'
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
	@Put('/stockImages/:paramId')
	@Authorized()
	public async updateStockImage(
		@Param('paramId') paramId: string,
		@BodyParam('name') name: string,
		@BodyParam('id') id: string,
		@BodyParam('stockImageId') stockImageId: string,
		@UploadedFile('image', { options: KoaMulter.getKoaMulterOptions() })
		image: any
	) {
		const stockImage: StockImage = new StockImage();
		if (id) {
			stockImage.$id = new ObjectID(id);
		} else if (stockImageId) {
			stockImage.$id = new ObjectID(stockImageId);
		}

		stockImage.$name = name;
		stockImage.$image = { data: undefined, contentType: 'image/png' };
		stockImage.$image.data = await fs.readFileSync(image.path);

		if (String(paramId) !== String(stockImage.$id)) {
			throw new BadRequestError(
				'An id mismatch error occurred. The id supplied in the url parameter does not match the supplied object'
			);
		}

		return await this.stockImageService.update(stockImage);
	}

	/**
	 * @swagger
	 * /stockImages/{id}:
	 *   delete:
	 *     summary: Deletes a specific stock image
	 *     description: Removes a specific stock image from the database
	 *     operationId: deleteStockImage
	 *     tags: [stockImage]
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
	 *         description: id of the stock image
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The deleted stock image
	 *         schema:
	 *           $ref: '#/definitions/StockImage'
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
	@Delete('/stockImages/:id')
	@Authorized()
	public async deleteStockImage(@Param('id') id: string) {
		return await this.stockImageService.delete(id);
	}
}
