import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector : 'users',
	templateUrl: './users.component.html',
	providers: [UserService]
})

export class UsersComponent {
	private title: string;
	private identity;
	private token;
	private page;
	private nextPage;
	private prevPage;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService
		) {
		this.title= "";
		this.identity= _userService.getIdentity();
		this.token= _userService.getToken();
	}

	//paginador
	actualPage(){
		this._route.params.subscribe(params=>{
			let page = +params['page'];
			this.page = page;
			if(!page){
				this.page = 1;
			} else{
				this.nextPage = page+1;
				this.prevPage= page-1;
				if (this.prevPage<=0) {
					this.prevPage= 1;
				}
			}
		})
	}

	getUsers(){

	}
}