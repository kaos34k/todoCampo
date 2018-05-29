import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user'
import { UserService } from '../../services/user.service';

@Component({
	selector: 'user-edit',
	templateUrl: './user-edit.component.html',
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

	onSubmit(){
		this._userService.updateUser(this.user).subscribe(
			response=>{
				if(!response.user){
					this.status = "error";
				} else { 
					this.status = "success";
					localStorage.setItem("identity", JSON.stringify(response.user));
					this.identity = this.user;

					//subir archivos
				}
			},
			error=>{
				var errorMessage = <any> error;
				console.error(errorMessage);
			}
		);
	}
}