import StockItem from '../models/StockItem';
import BaseRepository from './BaseRepository';

export default class StockItemRepository extends BaseRepository<StockItem> {
	constructor() {
		super(StockItem.name);
	}
}
