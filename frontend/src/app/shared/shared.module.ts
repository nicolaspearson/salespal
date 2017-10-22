import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {
	MatSidenavModule,
	MatButtonModule,
	MatToolbarModule,
	MatMenuModule,
	MatSelectModule,
	MatTabsModule,
	MatInputModule,
	MatProgressSpinnerModule,
	MatChipsModule,
	MatCheckboxModule,
	MatCardModule,
	MatListModule,
	MatIconModule,
	MatTooltipModule
} from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpModule,
		MatSidenavModule,
		MatButtonModule,
		MatToolbarModule,
		MatSelectModule,
		MatTabsModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatChipsModule,
		MatCardModule,
		MatCheckboxModule,
		MatListModule,
		MatMenuModule,
		MatIconModule,
		MatTooltipModule
	],
	exports: [
		CommonModule,
		FormsModule,
		HttpModule,
		MatSidenavModule,
		MatButtonModule,
		MatMenuModule,
		MatTabsModule,
		MatChipsModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatCheckboxModule,
		MatCardModule,
		MatListModule,
		MatSelectModule,
		MatToolbarModule,
		MatIconModule,
		MatTooltipModule
	]
})
export class SharedModule {}
