import * as Home from '../actions/home.actions';

export interface State {
	error: string | null;
	pending: boolean;
}

export const initialState: State = {
	error: null,
	pending: false
};

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
				...state,
				error: null,
				pending: false
			};
		}

		case Home.FETCH_STOCK_ITEMS_FAILURE: {
			return {
				...state,
				error: action.payload,
				pending: false
			};
		}

		default: {
			return state;
		}
	}
}

export const getError = (state: State) => state.error;

export const getPending = (state: State) => state.pending;
