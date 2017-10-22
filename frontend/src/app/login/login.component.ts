import {
	Component,
	HostBinding,
	Input,
	OnDestroy,
	OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import { login, selectorAuth, routerTransition } from '@app/core';
import { environment as env } from '@env/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	animations: [routerTransition]
})
export class LoginComponent implements OnInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();

	@Input() username = '';
	@Input() password = '';

	isProd = env.production;
	envName = env.envName;
	version = env.versions.app;
	year = new Date().getFullYear();
	isAuthenticated;
	logo = require('../../assets/logo_black.png');

	constructor(private store: Store<any>, private router: Router) {}

	ngOnInit(): void {
		this.store
			.select(selectorAuth)
			.takeUntil(this.unsubscribe$)
			.subscribe(auth => {
				console.log('Auth Complete');
				this.isAuthenticated = auth.isAuthenticated;
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	onUsernameChange(username: string) {
		this.username = username;
	}

	onPasswordChange(password: string) {
		this.password = password;
	}

	onLoginClick() {
		this.store.dispatch(login(this.username, this.password));
	}
}
