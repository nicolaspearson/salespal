import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { routerTransition } from '@app/core';

import { StockItem } from '../../models/stockItem';

@Component({
	selector: 'app-stock-item-detail',
	templateUrl: './stock-item-detail.component.html',
	styleUrls: ['./stock-item-detail.component.scss'],
	animations: [routerTransition]
})
export class StockItemDetailComponent implements OnInit {
	@Input() stockItem: StockItem;
	@Input() inCollection: boolean;
	@Output() remove = new EventEmitter<StockItem>();

	constructor() {}

	ngOnInit() {}

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
