import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global.service';
import { Follow } from '../models/follow';



@Injectable()
export class FollowService{

	public url: string;
	public headers;

	constructor(private _http:HttpClient){
		this.url= GLOBAL.url;
		this.headers =  new HttpHeaders().set('Content-Type', 'application/json');
	}

	addFollow(token, follow): Observable<any>{
		let params = JSON.stringify(follow);

		console.info(params);
		let header = this.headers.set('Authorization', token);

		return this._http.post(this.url+"save-follow", params, {headers:header});
	}

	deleteFollow(token, id){
		let header = this.headers.set('Authorization', token);		
		
		return this._http.delete(this.url+'delete-follow/'+id, {headers:header});
	}
}