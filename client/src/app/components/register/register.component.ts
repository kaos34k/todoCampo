import {Component, OnInit} from '@angular/core';

@Component({
	selector : 'login',
	template: './register.component.html'
})
export class RegisterComponent implements OnInit{

	ngOnInit() {
		console.log("Hola mundo.");
	}
}