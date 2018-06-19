import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector : 'login',
	templateUrl: './login.component.html',
	providers: [UserService]
})

export class LoginComponent implements OnInit{
	private title: string;
	private user: User;
	private status: string;
	private identity;
	private token;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userServices:UserService
		){
		this.title= "Login"; 
		this.user = new User("","","","","","","ROLE_USER","", ""); 
	}

	ngOnInit() {
		console.log("Inicializar la vista login");
	}

	ngOnSubmit() {
		this._userServices.login(this.user).subscribe(
			response =>{
				if (response.user && response.user._id) {
					this.identity = response.user;
					if(!this.identity || !this.identity._id){
						this.status= "error";
					} else {
						this.getToken();
						localStorage.setItem("identity", JSON.stringify(this.identity));
					}
				} else {
					this.status= "error";	
				}
			}, err =>{
				var errorMessage = <any> err;
				console.error(errorMessage);
			}
		);
	}

	//solicitar token
	getToken(){
		this._userServices.login(this.user, "true").subscribe(
			response =>{
				this.token = response.token;
				if(this.token.length <= 0 ){
					this.status= "error";
				} else {
					localStorage.setItem("token", this.token);
					this.getCounters();
					this.status= "success";
				}
			}, err =>{
				var errorMessage = <any> err;
				console.error(errorMessage);
			}
		);
	}

	getCounters(){
		this._userServices.getCounters().subscribe(
			response=>{
				localStorage.setItem('stats', JSON.stringify(response));
				this._router.navigate(['/']);
			}, error=>{
				var errorMessage = <any> error;
				console.error(errorMessage);
			}
		)
	}
}