import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';

@Component({
	selector : 'login',
	templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit{
	private title: string;
	private user: User;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router
		){
		this.title= "Registro"; 
		this.user = new User("","","","","","","",""); 
	}

	ngOnInit() {
		console.log("Hola mundo.");
	}

	ngOnSubmit(){
		console.log("USUARIO", this.user);
	}

}