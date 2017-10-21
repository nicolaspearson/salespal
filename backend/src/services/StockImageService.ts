import { ObjectID } from 'mongodb';
import { Inject } from 'typedi';
import { BadRequestError, HttpError, InternalServerError } from '../exceptions';
import StockImage from '../models/StockImage';
import StockImageRepository from '../repositories/StockImageRepository';

export default class StockImageService {
	@Inject() private stockImageRepository: StockImageRepository;

	constructor(stockImageRepository: StockImageRepository) {
		// Override the injected repository
		if (stockImageRepository) {
			this.stockImageRepository = stockImageRepository;
		}
	}
	public async findAll(): Promise<StockImage[]> {
		try {
			const stockImages: StockImage[] = await this.stockImageRepository.getAll();
			const sanitizedStockImages = stockImages.map((stockImage: StockImage) => {
				stockImage.sanitize();
				return stockImage;
			});
			return sanitizedStockImages;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async findOneById(id: string | ObjectID): Promise<StockImage> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!StockImage.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const stockImageResult = await this.stockImageRepository.findOneById(
				objectId
			);
			return stockImageResult; // .sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async save(stockImage: StockImage): Promise<StockImage> {
		try {
			// Check if the stock image is valid
			const stockImageIsValid = await stockImage.isValid();
			if (!stockImageIsValid) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Save the stock image to the database
			const stockImageResult = await this.stockImageRepository.save(stockImage);
			return stockImageResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async update(stockImage: StockImage): Promise<StockImage> {
		try {
			// Check if the stock image is valid
			const stockImageIsValid = await stockImage.isValid();
			if (!stockImageIsValid || !StockImage.validId(stockImage.$id)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			// Update the stock image on the database
			const stockImageResult = await this.stockImageRepository.updateOneById(
				stockImage.$id,
				stockImage
			);
			return stockImageResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}

	public async delete(id: string | ObjectID): Promise<StockImage> {
		try {
			let objectId: ObjectID;
			if (!(id instanceof ObjectID)) {
				objectId = new ObjectID(id);
			} else {
				objectId = id;
			}

			if (!StockImage.validId(objectId)) {
				throw new BadRequestError('Incorrect / invalid parameters supplied');
			}
			const stockImageResult = await this.stockImageRepository.deleteOneWithId(
				objectId
			);
			stockImageResult.$id = objectId;
			return stockImageResult.sanitize();
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new InternalServerError(error.message || error);
		}
	}
}
