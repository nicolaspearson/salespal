import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeTableComponent } from './components/home-table/home-table.component';

import { AuthGuard } from '../auth/services/auth-guard.service';
import { SharedModule } from '../shared/shared.module';

import { HomeService } from './services/home.service';
import { HomeEffects } from './effects/home.effects';
import { reducers } from './reducers';

export const COMPONENTS = [HomePageComponent, HomeTableComponent];

@NgModule({
	imports: [CommonModule, ReactiveFormsModule, SharedModule],
	declarations: COMPONENTS,
	exports: COMPONENTS
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
			}
		]),
		StoreModule.forFeature('home', reducers),
		EffectsModule.forFeature([HomeEffects])
	]
})
export class RootHomeModule {}
