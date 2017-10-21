import { ObjectID } from 'mongodb';
import { Inject } from 'typedi';
import { BadRequestError, HttpError, InternalServerError } from '../exceptions';
import StockAccessory from '../models/StockAccessory';
import StockAccessoryRepository from '../repositories/StockAccessoryRepository';

export default class StockAccessoryService {
	@Inject() private stockAccessoryRepository: StockAccessoryRepository;

	constructor(stockAccessoryRepository: StockAccessoryRepository) {
		// Override the injected repository
		if (stockAccessoryRepository) {
			this.stockAccessoryRepository = stockAccessoryRepository;
		}
	}
	public async findAll(): Promise<StockAccessory[]> {
		try {
			const stockAccessories: StockAccessory[] = await this.stockAccessoryRepository.getAll();
			const sanitizedStockAccessories = stockAccessories.map(
				(stockAccessory: StockAccessory) => {
					stockAccessory.sanitize();
					return stockAccessory;
				}
			);
			return sanitizedStockAccessories;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findOneById(id: string | ObjectID): Promise<StockAccessory> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!StockAccessory.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const stockAccessoryResult = await this.stockAccessoryRepository.findOneById(
				objectId
			);
			return stockAccessoryResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async save(stockAccessory: StockAccessory): Promise<StockAccessory> {
		try {
			// Check if the stock accessory is valid
			const stockAccessoryIsValid = await stockAccessory.isValid();
			if (!stockAccessoryIsValid) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Save the stock accessory to the database
			const stockAccessoryResult = await this.stockAccessoryRepository.save(
				stockAccessory
			);
			return stockAccessoryResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async update(stockAccessory: StockAccessory): Promise<StockAccessory> {
		try {
			// Check if the stock accessory is valid
			const stockAccessoryIsValid = await stockAccessory.isValid();
			if (
				!stockAccessoryIsValid ||
				!StockAccessory.validId(stockAccessory.$id)
			) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Update the stock accessory on the database
			const stockAccessoryResult = await this.stockAccessoryRepository.updateOneById(
				stockAccessory.$id,
				stockAccessory
			);
			return stockAccessoryResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async delete(id: string | ObjectID): Promise<StockAccessory> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!StockAccessory.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const stockAccessoryResult = await this.stockAccessoryRepository.deleteOneWithId(
				objectId
			);
			stockAccessoryResult.$id = objectId;
			return stockAccessoryResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}
}
