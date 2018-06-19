import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { GLOBAL } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { FollowService } from '../../services/follow.service';

@Component({
	selector: 'profile',
	templateUrl: './profile.component.html',
	providers: [UserService, FollowService,  UploadService]
})

export class ProfileComponent {
	
	private url:string;
	private title:string;
	private user: User;
	private identity;
	private token;
	private status: string;
	private siguiendo;
	private seguidor;


	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService,
			private _uploadService: UploadService,
			private _followService: FollowService
		) {
		
		this.url = GLOBAL.url;
		this.title = "Perfil";
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		this.loadPage();	
	}

	onSubmit(){

	}

	loadPage(){
		this._route.params.subscribe(params=>{
			let id = params['id'];		
			this.getUser(id);
		})
	}

	//cargar información del usaurio seleccionado
	getUser(id) {
		this._userService.getUser(id).subscribe(
				response => {
					if(!response){
						this.status = "error";
					} else {
						if(!response.user) {
							this.status = "error";
						} else {
							this.user = response.user;
							this.status = "success";
							if(response.followed != null){
								this.seguidor = true;
								this.siguiendo = true;
							} else {
								this.siguiendo = false;
								this.seguidor = false;
							}
						}
					}
				}, error => {
					console.error(error);
					this.user = this.identity;
					this._router.navigate(['/perfil', this.identity._id]);
				}
			)
	}

	//seguir a un usuario
	followUser(followed){
		var follow = new Follow('', this.identity._id, followed);

		this._followService.addFollow(this.token, follow).subscribe(
				response =>{
					this.siguiendo = true;
				}, err =>{
					console.error(err);
				}
			)
	}

	//dejar de seguir a un usuario
	unFollow(followed){
		this._followService.deleteFollow(this.token, followed).subscribe(
			response => {
				this.siguiendo = false;
			}, err =>{
				console.error(err);
			}
		)
	}

	//efectos para botones de seguir y dejar de seguir un usuario
	public folowUserOver;
	mouseEnter(user_id){
		this.folowUserOver = user_id;
	}

	mouseLeaveEnter(id){
		this.folowUserOver = 0;
	}
}