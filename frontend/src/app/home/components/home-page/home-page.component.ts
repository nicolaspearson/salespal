import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromHome from '../../reducers';
import * as Home from '../../actions/home.actions';

import { routerTransition } from '@app/core';
import { environment as env } from '@env/environment';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
	animations: [routerTransition]
})
export class HomePageComponent implements OnInit {
	pending$ = this.store.select(fromHome.getHomePagePending);
	error$ = this.store.select(fromHome.getHomePageError);

	constructor(private store: Store<fromHome.State>) {
		store.dispatch(new Home.FetchStockItems());
	}

	ngOnInit() {}

	onSubmit($event) {
		this.store.dispatch(new Home.FetchStockItems());
	}
}
