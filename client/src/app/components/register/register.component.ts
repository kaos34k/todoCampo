import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector : 'register',
	templateUrl: './register.component.html',
	providers: [UserService]
})
export class RegisterComponent implements OnInit{
	private title: string;
	private user: User;
	private status: string;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userServices:UserService
		){
		this.title= "Registro"; 
		this.user = new User("","","","","","","ROLE_USER","", ""); 
	}

	ngOnInit() {
	}

	ngOnSubmit(){
		this._userServices.register(this.user).subscribe(
				response =>{
						if (response.user && response.user._id) {
							console.info(response.user);
							this.status= "success";
						} else {
							this.status= "error";	
						}
					
				}, err =>{
					var errorMessage = <any> err;
					console.error(errorMessage);
				}
			);
	}

}