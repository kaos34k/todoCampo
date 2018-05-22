import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';
import { User } from '../models/user';

@Injectable()
export class UserService{
	public url;
	private headers = new HttpHeaders().set('Content-Type', 'application/json');
	private identity;
	private token;

	constructor(public _http:HttpClient) {
		this.url = GLOBAL.url;
	}

	register(user:User) : Observable<any> {
		let json =JSON.stringify(user);
		return this._http.post(this.url+'guardar-usuario', json, {headers: this.headers});
	}

	login(user:User, gettoken=null ) : Observable<any> {
		if (gettoken) {
			user.gettoken = gettoken;
		}

		let json =JSON.stringify(user);
		return this._http.post(this.url+'login-usuario', json, {headers: this.headers});
	}

	//usuario en session
	getIdentity() {
		if(localStorage.getItem('identity')!== undefined && localStorage.getItem('identity') !== null){
			let identity = JSON.parse(localStorage.getItem('identity'));
			if(identity!= undefined){
				this.identity = identity; 
			} else {
				this.identity = null;
			}
		} else {
			this.identity = null;
		}
		return this.identity;
	}

	//token de usuario en sessión
	getToken(){	
		let token = localStorage.getItem('token');
		if(token!= undefined){
			this.token = token; 
		} else {
			this.token = null;
		}
		return this.token;	
	}
}