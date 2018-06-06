import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';
import { Follow } from '../models/follow';
import { Publication } from '../models/publication';



@Injectable()
export class PublicationService{

	public url: string;
	public headers;
	
	constructor(private _http:HttpClient){
		this.url= GLOBAL.url;
		this.headers =  new HttpHeaders().set('Content-Type', 'application/json');
	}

	//listar publicaciones
	loadPublications(token, page) : Observable<any> {
		let header = this.headers.set('Authorization', token);
		return this._http.get(this.url+"load-publication/"+ page , {headers:header});
	}

	//guardar nueva publicación
	addPublication(token, publication): Observable<any>{
		let params = JSON.stringify(publication);
		let header = this.headers.set('Authorization', token);
		return this._http.post(this.url+"save-publication", params, {headers:header});
	}

	//eliminar publicación
	deletePublication(token, publication): Observable<any>{
		let header = this.headers.set('Authorization', token);
		return this._http.delete(this.url+'delete-publication/'+publication, {headers:header});
	}

	editarPublication(){

	}
}