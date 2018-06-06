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
	private stats;

	//inicializo  la url de mi api
	constructor(public _http:HttpClient) {
		this.url = GLOBAL.url;
	}

	//registro de usaurios
	register(user:User) : Observable<any> {
		let json =JSON.stringify(user);
		return this._http.post(this.url+'guardar-usuario', json, {headers: this.headers});
	}

	//iniciar sesion en mi aplicación
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

	//manejo de stats del usaurio
	getStats(){
		let stats = JSON.parse(localStorage.getItem('stats'));
		if (stats!= undefined) {
			this.stats = stats;
		} else {
			this.stats =null;
		}
		return this.stats;
	}

	//cotadores de mis seguidos y segidores
	getCounters(userId= null): Observable<any>{
		let token = this.getToken();

		let head = new HttpHeaders()
							.set('Content-Type', 'application/json')
							.set('Authorization', token);
	
		if (userId != null) {
			return this._http.get(this.url+'counters/'+ userId , {headers: head});
		} else {
			return this._http.get(this.url+'counters', {headers: head});
		}

	}

	//actualizar informacion del usuario
	updateUser(user:User): Observable<any>{ 
		let params =JSON.stringify(user);
		let token =this.getToken();
		let head = this.headers.set('Authorization', token);
		
		return this._http.post(this.url+'update-user/'+user._id, params, {headers: head});
	}

	//listar usuarios
	getUsersList(page=null): Observable<any>{ 
		let token =this.getToken();
		let head = this.headers.set('Authorization', token);
		
		return this._http.get(this.url+'get-usuarios/'+page, {headers: head});
	}	

	//cargar un solo usuario
	getUser(id): Observable<any>{ 
		let token =this.getToken();
		let head = this.headers.set('Authorization', token);
		
		return this._http.get(this.url+'get-usuario/'+id, {headers: head});
	}
}