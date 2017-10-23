import { Action } from '@ngrx/store';
import { StockItem } from '../models/stockItem';

export const FETCH_STOCK_ITEMS = 'HOME/STOCK_ITEMS/FETCH';
export const FETCH_STOCK_ITEMS_SUCCESS = 'HOME/STOCK_ITEMS/FETCH_SUCCESS';
export const FETCH_STOCK_ITEMS_FAILURE = 'HOME/STOCK_ITEMS/FETCH_FAILURE';

export class FetchStockItems implements Action {
	readonly type = FETCH_STOCK_ITEMS;

	public payload: {};

	constructor() {}
}

export class FetchStockItemsSuccess implements Action {
	readonly type = FETCH_STOCK_ITEMS_SUCCESS;

	constructor(public payload: { stockItems: StockItem[] }) {}
}

export class FetchStockItemsFailure implements Action {
	readonly type = FETCH_STOCK_ITEMS_FAILURE;

	constructor(public payload: any) {}
}

export type Actions =
	| FetchStockItems
	| FetchStockItemsSuccess
	| FetchStockItemsFailure;
