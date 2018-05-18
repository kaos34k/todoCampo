import {Component, OnInit} from '@angular/core';

@Component({
	selector : 'login',
	template: './login.component.html'
})
export class LoginComponent implements OnInit{

	ngOnInit(){
		console.log("Hola mundo.");
	}
}