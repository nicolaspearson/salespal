import * as moment from 'moment';
import { ObjectID } from 'mongodb';
import { Inject } from 'typedi';
import { BadRequestError, HttpError, InternalServerError } from '../exceptions';
import StockAccessory from '../models/StockAccessory';
import StockImage from '../models/StockImage';
import StockItem from '../models/StockItem';
import StockAccessoryRepository from '../repositories/StockAccessoryRepository';
import StockImageRepository from '../repositories/StockImageRepository';
import StockItemRepository from '../repositories/StockItemRepository';

export default class StockItemService {
	@Inject() private stockAccessoryRepository: StockAccessoryRepository;
	@Inject() private stockImageRepository: StockImageRepository;

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
			const sanitizedStockItems = [];
			for (const stockItem of stockItems) {
				stockItem.$stockImages = await this.getStockImages(stockItem.$images);
				stockItem.$stockAccessories = await this.getStockAccessories(
					stockItem.$accessories
				);
				stockItem.sanitize();
				sanitizedStockItems.push(stockItem);
			}
			return sanitizedStockItems;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	private async getStockAccessories(
		accessories: string[]
	): Promise<StockAccessory[]> {
		const stockAccessories: StockAccessory[] = [];
		for (const accessory of accessories) {
			const stockAccessory: StockAccessory = await this.stockAccessoryRepository.findOneById(
				new ObjectID(accessory)
			);
			stockAccessory.sanitize();
			stockAccessories.push(stockAccessory);
		}
		return stockAccessories;
	}

	private async getStockImages(images: string[]): Promise<StockImage[]> {
		const stockImages: StockImage[] = [];
		for (const image of images) {
			const stockImage: StockImage = await this.stockImageRepository.findOneById(
				new ObjectID(image)
			);
			stockImage.sanitize();
			stockImages.push(stockImage);
		}
		return stockImages;
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
			stockItemResult.$stockImages = await this.getStockImages(
				stockItemResult.$images
			);
			stockItemResult.$stockAccessories = await this.getStockAccessories(
				stockItemResult.$accessories
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
			const now = moment(new Date().toISOString()).format(
				'YYYY-MM-DD HH:mm:ssZ'
			);
			stockItem.$createdAt = moment(now).toDate();
			stockItem.$updatedAt = moment(now).toDate();
			stockItem.$accessories = stockItem.$accessories || [];
			stockItem.$images = stockItem.$images || [];
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
