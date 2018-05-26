import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user'
import { UserService } from '../../services/user.service';

@Component({
	selector: 'user-edit',
	templateUrl: './user-edit.component',
	providers: [UserService]
})

export class UserEditComponent {
	
	private title:string;
	private user: User;
	private identity;
	private token;
	private status: string;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService
		) {
		
		this.title = "Actualizar datos";
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
	}

	ngOnInit(){

	}
}