import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import { HomeService } from '../services/home.service';
import * as Home from '../actions/home.actions';

import { LocalStorageService } from '../../core/local-storage/local-storage.service';
import { LS_STOCK_ITEMS_KEY } from '../../core/local-storage/keys';

@Injectable()
export class HomeEffects {
	constructor(
		private actions$: Actions,
		private homeService: HomeService,
		private localStorageService: LocalStorageService
	) {}

	@Effect()
	fetchStockItems$ = this.actions$
		.ofType(Home.FETCH_STOCK_ITEMS)
		.map((action: Home.FetchStockItems) => action.payload)
		.exhaustMap(() =>
			this.homeService
				.fetchStockItems()
				.map(stockItems => {
					this.localStorageService.setItem(LS_STOCK_ITEMS_KEY, {
						stockItems
					});
					return new Home.FetchStockItemsSuccess({ stockItems });
				})
				.catch(error => of(new Home.FetchStockItemsFailure(error)))
		);
}
