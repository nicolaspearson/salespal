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
import StockItem from '../models/StockItem';
import StockItemService from '../services/StockItemService';

/**
 * @swagger
 * tags:
 *   name: stockItem
 *   description: StockItem
 */
@Service()
@JsonController()
export default class StockItemController {
	@Inject() private stockItemService: StockItemService;

	constructor(stockItemService: StockItemService) {
		// Override the injected service
		if (stockItemService) {
			this.stockItemService = stockItemService;
		}
	}

	/**
	 * @swagger
	 * /stockItems:
	 *   get:
	 *     summary: Get all stock items
	 *     description: Get an array of all stock items
	 *     operationId: getAllStockItems
	 *     tags: [stockItem]
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
	 *         description: An array of stock items
	 *         schema:
	 *           type: array
	 *           items:
	 *             $ref: '#/definitions/StockItem'
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
	@Get('/stockItems')
	@Authorized()
	public async getAllStockItems(): Promise<StockItem[]> {
		return await this.stockItemService.findAll();
	}

	/**
	 * @swagger
	 * /stockItems/{id}:
	 *   get:
	 *     summary: Find a specific stock item
	 *     description: Retrieves a specific stock item from the database
	 *     operationId: findStockItemById
	 *     tags: [stockItem]
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
	 *         description: id of the stock item
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The found stock item
	 *         schema:
	 *           $ref: '#/definitions/StockItem'
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
	@Get('/stockItems/:id')
	@Authorized()
	public async findStockItemById(@Param('id') id: string): Promise<StockItem> {
		return await this.stockItemService.findOneById(id);
	}

	/**
	 * @swagger
	 * /stockItems:
	 *   post:
	 *     summary: Save a new stock item
	 *     description: Saves a new stock item to the database
	 *     operationId: saveStockItem
	 *     tags: [stockItem]
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
	 *       - name: stock item
	 *         in: body
	 *         description: the stock item
	 *         required: true
	 *         schema:
	 *           $ref: '#/definitions/StockItem'
	 *     responses:
	 *       200:
	 *         description: The saved stock item
	 *         schema:
	 *           $ref: '#/definitions/StockItem'
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
	@Post('/stockItems')
	@Authorized()
	public async saveStockItem(
		@Body({ validate: { validationError: { target: false } } })
		stockItem: StockItem
	) {
		if (stockItem.$id) {
			stockItem.$id = new ObjectID(stockItem.$id);
		} else if (stockItem.$stockItemId) {
			stockItem.$id = new ObjectID(stockItem.$stockItemId);
		}
		return await this.stockItemService.save(stockItem);
	}

	/**
	 * @swagger
	 * /stockItems/{id}:
	 *   put:
	 *     summary: Updates a specific stock item
	 *     description: Updates a specific stock item on the database
	 *     operationId: updateStockItem
	 *     tags: [stockItem]
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
	 *         description: id of the stock item
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The updated stock item
	 *         schema:
	 *           $ref: '#/definitions/StockItem'
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
	@Put('/stockItems/:id')
	@Authorized()
	public async updateStockItem(
		@Param('id') id: string,
		@Body() stockItem: StockItem
	) {
		if (String(id) !== String(stockItem.$id)) {
			throw new BadRequestError(
				'An id mismatch error occurred. The id supplied in the url parameter does not match the supplied object'
			);
		}
		stockItem.$id = new ObjectID(id);
		return await this.stockItemService.update(stockItem);
	}

	/**
	 * @swagger
	 * /stockItems/{id}:
	 *   delete:
	 *     summary: Deletes a specific stock item
	 *     description: Removes a specific stock item from the database
	 *     operationId: deleteStockItem
	 *     tags: [stockItem]
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
	 *         description: id of the stock item
	 *         required: true
	 *         type: integer
	 *         format: int32
	 *     responses:
	 *       200:
	 *         description: The deleted stock item
	 *         schema:
	 *           $ref: '#/definitions/StockItem'
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
	@Delete('/stockItems/:id')
	@Authorized()
	public async deleteStockItem(@Param('id') id: string) {
		return await this.stockItemService.delete(id);
	}
}
