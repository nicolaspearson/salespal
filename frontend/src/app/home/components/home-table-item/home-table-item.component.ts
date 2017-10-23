import { Component, OnInit, Input } from '@angular/core';
import { routerTransition } from '@app/core';
import { Router } from '@angular/router';

import { StockItem } from '../../models/stockItem';

@Component({
	selector: 'app-home-table-item',
	templateUrl: './home-table-item.component.html',
	styleUrls: ['./home-table-item.component.scss'],
	animations: [routerTransition]
})
export class HomeTableItemComponent implements OnInit {
	@Input() stockItem: StockItem;

	constructor(private router: Router) {}

	ngOnInit() {}

	onItemClick() {
		this.router.navigate(['/items', this.id]);
	}

	get id() {
		return this.stockItem.stockItemId;
	}

	get registrationNumber() {
		return this.stockItem.registrationNumber;
	}

	get make() {
		return this.stockItem.make;
	}

	get model() {
		return this.stockItem.model;
	}

	get modelYear() {
		return this.stockItem.modelYear;
	}

	get odometer() {
		return this.stockItem.odometer;
	}

	get colour() {
		return this.stockItem.colour;
	}

	get vin() {
		return this.stockItem.vin;
	}

	get retailPrice() {
		return this.stockItem.retailPrice;
	}

	get costPrice() {
		return this.stockItem.costPrice;
	}

	get accessories() {
		return this.stockItem.accessories;
	}

	get images() {
		return this.stockItem.images;
	}

	get createdAt() {
		return this.stockItem.createdAt;
	}

	get updatedAt() {
		return this.stockItem.updatedAt;
	}

	get thumbnail(): string | boolean {
		if (this.stockItem.stockImages && this.stockItem.stockImages.length > 0) {
			return 'data:image/png;base64,' + this.stockItem.stockImages[0].image;
		}
		return false;
	}
}
