import { Routes } from '@angular/router';

import { AuthGuard } from './auth/services/auth-guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{
		path: '**',
		component: PageNotFoundComponent,
		canActivate: [AuthGuard]
	}
];
