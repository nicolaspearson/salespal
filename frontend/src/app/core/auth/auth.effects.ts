import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { LocalStorageService } from '../local-storage/local-storage.service';
import { Action } from '../core.interfaces';

import { AUTH_KEY, AUTH_LOGIN, AUTH_LOGOUT } from './auth.reducer';

@Injectable()
export class AuthEffects {
	constructor(
		private http: Http,
		private actions$: Actions<Action>,
		private localStorageService: LocalStorageService
	) {}

	@Effect()
	update$ = this.actions$
		.ofType('SUPER_SIMPLE_EFFECT')
		.switchMap(() =>
			Observable.of({ type: 'SUPER_SIMPLE_EFFECT_HAS_FINISHED' })
		);

	@Effect({ dispatch: false })
	login(): Observable<Action> {
		const options = new RequestOptions({ headers: new Headers() });
		options.headers.set('Content-Type', 'application/json');
		options.headers.set('x-access-token', 'SecretAccessToken');
		return (
			this.actions$
				.ofType(AUTH_LOGIN)
				// Map the payload into JSON to use as the request body
				.map(action => JSON.stringify(action.payload))
				.switchMap(payload =>
					this.http
						.post('http://localhost:3000/api/v1/users/login', payload, options)
						// If successful, dispatch success action with result
						.map(res => ({ type: 'LOGIN_SUCCESS', payload: res.json() }))
						.do(action => {
							console.log('Auth Effect Complete');
							this.localStorageService.setItem(AUTH_KEY, {
								isAuthenticated: true
							});
						})
						// If request fails, dispatch failed action
						.catch(() => Observable.of({ type: 'LOGIN_FAILED', payload: '' }))
				)
		);
	}

	@Effect({ dispatch: false })
	logout(): Observable<Action> {
		return this.actions$
			.ofType(AUTH_LOGOUT)
			.do(action =>
				this.localStorageService.setItem(AUTH_KEY, { isAuthenticated: false })
			);
	}
}
