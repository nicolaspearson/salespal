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
import { BadRequestError } from '../exceptions';
import StockAccessory from '../models/StockAccessory';
import StockAccessoryService from '../services/StockAccessoryService';

/**
 * @swagger
 * tags:
 *   name: stockAccessory
 *   description: StockAccessory
 */
@Service()
@JsonController()
export default class StockAccessoryController {
	@Inject() private stockAccessoryService: StockAccessoryService;

	constructor(stockAccessoryService: StockAccessoryService) {
		// Override the injected service
		if (stockAccessoryService) {
			this.stockAccessoryService = stockAccessoryService;
		}
	}

	/**
	 * @swagger
	 * /stockAccessories:
	 *   get:
	 *     summary: Get all stock accessories
	 *     description: Get an array of all stock accessories
	 *     operationId: getAllStockAccessories
	 *     tags: [stockAccessory]
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
	 *         description: An array of stock accessories
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/StockAccessory'
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
	@Get('/stockAccessories')
	@Authorized()
	public async getAllStockAccessories(): Promise<StockAccessory[]> {
		return await this.stockAccessoryService.findAll();
	}

	/**
	 * @swagger
	 * /stockAccessories/{id}:
	 *   get:
	 *     summary: Find a specific stock accessory
	 *     description: Retrieves a specific stock accessory from the database
	 *     operationId: findStockAccessoryById
	 *     tags: [stockAccessory]
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
	 *         description: id of the stock accessory
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The found stock accessory
	 *         schema:
	 *           $ref: '#/definitions/StockAccessory'
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
	@Get('/stockAccessories/:id')
	@Authorized()
	public async findStockAccessoryById(
		@Param('id') id: string
	): Promise<StockAccessory> {
		return await this.stockAccessoryService.findOneById(id);
	}

	/**
	 * @swagger
	 * /stockAccessories:
	 *   post:
	 *     summary: Save a new stock accessory
	 *     description: Saves a new stock accessory to the database
	 *     operationId: saveStockAccessory
	 *     tags: [stockAccessory]
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
	 *       - name: stockAccessory
	 *         in: body
	 *         description: the stock accessory
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/StockAccessory'
	 *     responses:
	 *       200:
	 *         description: The saved stock accessory
	 *         schema:
	 *           $ref: '#/definitions/StockAccessory'
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
	@Post('/stockAccessories')
	@Authorized()
	public async saveStockAccessory(@Body() stockAccessory: StockAccessory) {
		if (stockAccessory.$id) {
			stockAccessory.$id = new ObjectID(stockAccessory.$id);
		} else if (stockAccessory.$stockAccessoryId) {
			stockAccessory.$id = new ObjectID(stockAccessory.$stockAccessoryId);
		}
		return await this.stockAccessoryService.save(stockAccessory);
	}

	/**
	 * @swagger
	 * /stockAccessories/{id}:
	 *   put:
	 *     summary: Updates a specific stock accessory
	 *     description: Updates a specific stock accessory on the database
	 *     operationId: updateStockAccessory
	 *     tags: [stockAccessory]
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
	 *         description: id of the stock accessory
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The updated stock accessory
	 *         schema:
	 *           $ref: '#/definitions/StockAccessory'
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
	@Put('/stockAccessories/:id')
	@Authorized()
	public async updateStockAccessory(
		@Param('id') id: string,
		@Body() stockAccessory: StockAccessory
	) {
		if (String(id) !== String(stockAccessory.$id)) {
			throw new BadRequestError(
				'An id mismatch error occurred. The id supplied in the url parameter does not match the supplied object'
			);
		}
		stockAccessory.$id = new ObjectID(id);
		return await this.stockAccessoryService.update(stockAccessory);
	}

	/**
	 * @swagger
	 * /stockAccessories/{id}:
	 *   delete:
	 *     summary: Deletes a specific stock accessory
	 *     description: Removes a specific stock accessory from the database
	 *     operationId: deleteStockAccessory
	 *     tags: [stockAccessory]
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
	 *         description: id of the stock accessory
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The deleted stock accessory
	 *         schema:
	 *           $ref: '#/definitions/StockAccessory'
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
	@Delete('/stockAccessories/:id')
	@Authorized()
	public async deleteStockAccessory(@Param('id') id: string) {
		return await this.stockAccessoryService.delete(id);
	}
}
