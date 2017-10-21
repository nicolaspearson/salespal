import { ObjectID } from 'mongodb';
import { Inject } from 'typedi';
import { BadRequestError, HttpError, InternalServerError } from '../exceptions';
import StockItem from '../models/StockItem';
import StockItemRepository from '../repositories/StockItemRepository';

export default class StockItemService {
	@Inject() private stockItemRepository: StockItemRepository;

	constructor(stockItemRepository: StockItemRepository) {
		// Override the injected repository
		if (stockItemRepository) {
			this.stockItemRepository = stockItemRepository;
		}
	}
	public async findAll(): Promise<StockItem[]> {
		try {
			const stockItems: StockItem[] = await this.stockItemRepository.getAll();
			const sanitizedStockItems = stockItems.map((stockItem: StockItem) => {
				stockItem.sanitize();
				return stockItem;
			});
			return sanitizedStockItems;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findOneById(id: string | ObjectID): Promise<StockItem> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!StockItem.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const stockItemResult = await this.stockItemRepository.findOneById(
				objectId
			);
			return stockItemResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async save(stockItem: StockItem): Promise<StockItem> {
		try {
			// Check if the stock item is valid
			const stockItemIsValid = await stockItem.isValid();
			if (!stockItemIsValid) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Save the stock item to the database
			const stockItemResult = await this.stockItemRepository.save(stockItem);
			return stockItemResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async update(stockItem: StockItem): Promise<StockItem> {
		try {
			// Check if the stock item is valid
			const stockItemIsValid = await stockItem.isValid();
			if (!stockItemIsValid || !StockItem.validId(stockItem.$id)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Update the stock item on the database
			const stockItemResult = await this.stockItemRepository.updateOneById(
				stockItem.$id,
				stockItem
			);
			return stockItemResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async delete(id: string | ObjectID): Promise<StockItem> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!StockItem.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const stockItemResult = await this.stockItemRepository.deleteOneWithId(
				objectId
			);
			stockItemResult.$id = objectId;
			return stockItemResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}
}
