import { Routes } from '@angular/router';

import { AuthGuard } from './auth/services/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{
		path: 'home',
		component: HomeComponent,
		data: {
			title: 'Home'
		},
		canActivate: [AuthGuard]
	},
	{
		path: '**',
		component: PageNotFoundComponent
	}
];
