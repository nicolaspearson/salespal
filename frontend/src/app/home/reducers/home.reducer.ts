import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import * as Home from '../actions/home.actions';
import { StockItem } from '../models/stockItem';

export interface State extends EntityState<StockItem> {
	selectedStockItemId: string | null;
	stockItems: StockItem[];
	ids: string[];
	error: string | null;
	pending: boolean;
}

export const adapter: EntityAdapter<StockItem> = createEntityAdapter<
	StockItem
>({
	selectId: (stockItem: StockItem) => stockItem.stockItemId,
	sortComparer: false
});

export const initialState: State = adapter.getInitialState({
	selectedStockItemId: null,
	stockItems: [],
	ids: [],
	error: null,
	pending: false
});

export function reducer(state = initialState, action: Home.Actions): State {
	switch (action.type) {
		case Home.FETCH_STOCK_ITEMS: {
			return {
				...state,
				error: null,
				pending: true
			};
		}

		case Home.FETCH_STOCK_ITEMS_SUCCESS: {
			return {
				...adapter.addMany(action.payload, state),
				error: null,
				pending: false,
				selectedStockItemId: state.selectedStockItemId,
				ids: action.payload.map(stockItem => stockItem.stockItemId)
			};
		}

		case Home.FETCH_STOCK_ITEMS_FAILURE: {
			return {
				...state,
				error: action.payload,
				pending: false
			};
		}

		case Home.SELECT_STOCK_ITEM: {
			return {
				...state,
				selectedStockItemId: action.payload,
				pending: false
			};
		}

		case Home.ADD_STOCK_ITEM_SUCCESS:
		case Home.REMOVE_STOCK_ITEM_FAILURE: {
			if (state.ids.indexOf(action.payload.stockItemId) > -1) {
				return state;
			}

			return {
				...state,
				ids: [...state.ids, action.payload.stockItemId],
				pending: false
			};
		}

		case Home.REMOVE_STOCK_ITEM_SUCCESS:
		case Home.ADD_STOCK_ITEM_FAILURE: {
			return {
				...state,
				ids: state.ids.filter(id => id !== action.payload.stockItemId),
				pending: false
			};
		}

		default: {
			return state;
		}
	}
}

export const getStockItems = (state: State) => {
	return state.stockItems;
};

export const getSelectedId = (state: State) => state.selectedStockItemId;

export const getIds = (state: State) => state.ids;

export const getError = (state: State) => state.error;

export const getPending = (state: State) => state.pending;
