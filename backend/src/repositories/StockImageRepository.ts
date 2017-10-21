import StockImage from '../models/StockImage';
import BaseRepository from './BaseRepository';

export default class StockImageRepository extends BaseRepository<StockImage> {
	constructor() {
		super(StockImage.name);
	}
}
