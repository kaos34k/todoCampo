//utils
import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

//mis servicios
import { GLOBAL } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

//models
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

@Component({
	selector : 'users',
	templateUrl: './users.component.html',
	providers: [UserService, FollowService]
})

export class UsersComponent {
	private title: string;
	private url= GLOBAL.url;
	private identity;
	private token;
	private page;
	private pages;
	private nextPage;
	private prevPage;
	private status: string;
	private total;
	private follows;
	
	private users: User[];
	private follow : Follow;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService,
			private _followService: FollowService
		) {
		this.title= "Usuarios";
		this.identity= _userService.getIdentity();
		this.token= _userService.getToken();
	}

	ngOnInit(){
		this.actualPage();	
	}
	//paginador
	actualPage(){
		this._route.params.subscribe(params=>{
			let page = +params['page'];
			this.page = page;

			if(!params['page']){
				page = 1;
			}

			
			if(!page){
				this.page = 1;
			} else{
				this.nextPage = page+1;
				this.prevPage= page-1;
				
				if (this.prevPage<=0) {
					this.prevPage= 1;
				}

			}
			this.getUsers(this.page);
		})
	}

	getUsers(page){
		this._userService.getUsersList(page).subscribe(
				response=>{
					if(!response.users) {
						this.status='error';
					} else {

						console.info(response);
						
						this.status='success';
						this.total = response.total;
						this.users = response.users;
						this.follows = response.users_following;
						this.pages = response.pages;
						if(page > this.page){
							this._router.navigate(['/users'])
						}
					}
				}, error =>{
					var errorMessage = <any>error;
					console.error(errorMessage);
					if (errorMessage!= null) {
						this.status = 'error'
					}
				}
			)
	}

	public folowUserOver;
	mouseEnter(user_id){
		this.folowUserOver = user_id;
	}

	mouseLeaveEnter(id){
		this.folowUserOver = 0;
	}

	saveFollow(followed){
		var follow = new Follow('', this.identity._id, followed);
		this._followService.addFollow(this.token, follow).subscribe(
				response => {
					if(!response.follow){
						this.status = 'error';
					} else {
						this.status = 'success';
						this.follows.push(followed);
					}
				}, error =>{
					var errorMessage = <any>error;
					console.error(errorMessage);
					if (errorMessage!= null) {
						this.status = 'error'
					}
				}
			)
	}

	//dejar de seguir ua una persona
	unFollow(user_id){
		this._followService.deleteFollow(this.token, user_id).subscribe(
				response=>{
					console.info("respuesta", response);

					if(!response){

					} else {
						var search = this.follows.indexOf(user_id);
						if(search != -1){
							this.follows.splice(search, 1);
						}
					}
				}, error=>{
					var errorMessage = <any>error;
					console.error(errorMessage);
					if (errorMessage!= null) {
						this.status = 'error'
					}
				}
			)
	}
}