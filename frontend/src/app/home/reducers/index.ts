import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromHome from './home.reducer';
import * as fromHomePage from './home-page.reducer';

export interface HomeState {
	status: fromHome.State;
	homePage: fromHomePage.State;
}

export interface State extends fromRoot.State {
	home: HomeState;
}

export const reducers = {
	status: fromHome.reducer,
	homePage: fromHomePage.reducer
};

export const selectHomeState = createFeatureSelector<HomeState>('home');

export const selectHomeStatusState = createSelector(
	selectHomeState,
	(state: HomeState) => state.status
);
export const getStockItems = createSelector(
	selectHomeStatusState,
	fromHome.getStockItems
);

export const selectHomePageState = createSelector(
	selectHomeState,
	(state: HomeState) => state.homePage
);
export const getHomePageError = createSelector(
	selectHomePageState,
	fromHomePage.getError
);
export const getHomePagePending = createSelector(
	selectHomePageState,
	fromHomePage.getPending
);
