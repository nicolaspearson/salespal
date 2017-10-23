import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeTableComponent } from './components/home-table/home-table.component';
import { HomeTableItemComponent } from './components/home-table-item/home-table-item.component';
import { StockItemPageComponent } from './components/stock-item-page/stock-item-page.component';
import { StockItemDetailComponent } from './components/stock-item-detail/stock-item-detail.component';
import { StockItemSelectedComponent } from './components/stock-item-selected/stock-item-selected.component';

import { AuthGuard } from '../auth/services/auth-guard.service';
import { StockItemExistsGuard } from './services/stock-item-guard.service';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../shared/pipes';

import { HomeService } from './services/home.service';
import { HomeEffects } from './effects/home.effects';
import { reducers } from './reducers';

export const COMPONENTS = [
	HomePageComponent,
	HomeTableComponent,
	HomeTableItemComponent,
	StockItemPageComponent,
	StockItemDetailComponent,
	StockItemSelectedComponent
];

@NgModule({
	imports: [CommonModule, ReactiveFormsModule, SharedModule, PipesModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	providers: [StockItemExistsGuard]
})
export class HomeModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: RootHomeModule,
			providers: [HomeService]
		};
	}
}

@NgModule({
	imports: [
		HomeModule,
		RouterModule.forChild([
			{
				path: 'home',
				component: HomePageComponent,
				data: {
					title: 'Home'
				},
				canActivate: [AuthGuard]
			},
			{
				path: ':id',
				component: StockItemPageComponent,
				canActivate: [StockItemExistsGuard]
			}
		]),
		StoreModule.forFeature('home', reducers),
		EffectsModule.forFeature([HomeEffects])
	]
})
export class RootHomeModule {}
