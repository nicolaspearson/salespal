import * as Home from '../actions/home.actions';
import { StockItem } from '../models/stockItem';

export interface State {
	stockItems: StockItem[];
}

export const initialState: State = {
	stockItems: []
};

export function reducer(state = initialState, action: Home.Actions): State {
	switch (action.type) {
		case Home.FETCH_STOCK_ITEMS_SUCCESS: {
			return {
				...state,
				stockItems: action.payload.stockItems
			};
		}

		default: {
			return state;
		}
	}
}

export const getStockItems = (state: State) => state.stockItems;
