import StockAccessory from '../models/StockAccessory';
import BaseRepository from './BaseRepository';

export default class StockAccessoryRepository extends BaseRepository<StockAccessory> {
	constructor() {
		super(StockAccessory.name);
	}
}
