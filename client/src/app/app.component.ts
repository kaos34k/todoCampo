import { Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { UserService } from './services/user.service';

import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ UserService, ]
})
export class AppComponent implements OnInit, DoCheck{
    private title = 'app';
    private identity;

    constructor(
        private _userService:UserService,
        private _route:ActivatedRoute,
        private _router:Router,
    ){}

    ngOnInit() {
        this.identity = this._userService.getIdentity(); 
    }

    ngDoCheck(){
        this.identity = this._userService.getIdentity(); 	
    }

    //cerrar sesión del usaurio
    logout(){
        localStorage.clear();
        this.identity = null;
        this._router.navigate(['/']);
    }
}
