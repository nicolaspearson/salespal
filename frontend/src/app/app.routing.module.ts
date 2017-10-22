import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
	{
		path: '',
		component: LoginComponent,
		data: {
			title: 'Login'
		},
		pathMatch: 'full'
	},
	{
		path: 'login',
		redirectTo: '',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent,
		data: {
			title: 'Home'
		},
		pathMatch: 'full'
	},
	{
		path: '**',
		component: PageNotFoundComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			routes,
			{ enableTracing: true } // <-- debugging purposes only
		)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
