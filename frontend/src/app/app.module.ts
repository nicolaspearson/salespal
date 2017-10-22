import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@app/core';
import { SharedModule } from './shared/shared.module';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		LoginComponent,
		PageNotFoundComponent
	],
	imports: [
		// Angular
		BrowserModule,
		BrowserAnimationsModule,
		// Core & Shared
		CoreModule,
		SharedModule,
		// App
		AppRoutingModule
		// Features
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
