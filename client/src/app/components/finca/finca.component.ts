import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
	selector: "finca",
	templateUrl: './finca.component.html',
	providers: [UserService]
})

export class FincaComponent implements OnInit {
	private title: string;

	constructor (
		private _route: ActivatedRoute,
		private _router: Router,
		private _userServices:UserService
	) {
		this.title= "Finca"; 
	}

	ngOnInit() {
		console.log("Inicializar la vista finca");
	}
}