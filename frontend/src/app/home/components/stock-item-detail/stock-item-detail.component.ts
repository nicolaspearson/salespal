import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
	@Input() errorMessage: string | null;
	@Output() add = new EventEmitter<StockItem>();
	@Output() remove = new EventEmitter<StockItem>();
	@Output() update = new EventEmitter<StockItem>();

	isCreate: boolean;

	form: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit() {
		if (this.stockItem.stockItemId === 'new') {
			this.isCreate = true;
		}

		this.form = this.formBuilder.group({
			registrationNumber: [this.registrationNumber, Validators.required],
			make: [this.make, Validators.required],
			model: [this.model, Validators.required],
			modelYear: [this.modelYear, Validators.required],
			odometer: [this.odometer, Validators.required],
			colour: [this.colour, Validators.required],
			vin: [this.vin, Validators.required],
			retailPrice: [this.retailPrice, Validators.required],
			costPrice: [this.costPrice, Validators.required]
		});
	}

	submitUpdate() {
		if (this.form.valid) {
			const stockItem: StockItem = this.form.value;
			stockItem.stockItemId = this.stockItem.stockItemId;
			stockItem.accessories = this.stockItem.accessories;
			stockItem.images = this.stockItem.images;
			if (this.isCreate) {
				this.add.emit(stockItem);
			} else {
				this.update.emit(stockItem);
			}
		}
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
