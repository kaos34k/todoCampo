import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { User } from '../../models/user';
import { Publication } from '../../models/publication';
import { Message } from '../../models/message';

import { GLOBAL } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { FollowService } from '../../services/follow.service';
import { MessageService } from '../../services/message.service';

@Component({
	selector: 'message',
	templateUrl: './message.component.html',
	providers: [UserService, FollowService, UploadService, MessageService]
})

export class MessageComponent {
	
	private url:string;
	private title:string;
	private user: User;
	private message : Message;
	private identity;
	private token;
	private status: string;
	private total;
	private follows;
	
	//usaurio al que le enviare mensajes
	private user_a_enviar_mensaje;

	private users: User[];

	private msgInput: string = 'lorem ipsum';
	private mensajes = [];

	//controles de paginación para publicaciones
	private page = 1;
	private pages;
	private itemPerPage;
	private nextPage;
	private prevPage;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService,
			private _uploadService: UploadService,
			private _followService: FollowService,
			private _messageService: MessageService
		) {
		
		this.url = GLOBAL.url;
		this.title = "Contactos";
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
	}

	ngOnInit() {
		this.actualPage();

	}

	onEnter(value: string) {
		this.message = new Message(
			"",
			value,
			"",
			"",
			this.identity._id, 
			this.user_a_enviar_mensaje
		);
   		this.sendButtonClick(this.message);
  	}

  	//enviar y recibir mensajes
	sendButtonClick(msg) {
		//enviar mensajes 
		this._messageService.sendMessage(msg);
		
		//cargar mensaje
	 	this._messageService.getMessages(this.user._id, this.user_a_enviar_mensaje, this.page)
	      	.subscribe((message) => {
	      		console.info(message);
	        	this.mensajes = message;
	  	});
	}

	//selecionar usaurio
	seleccionarUsaurio(user, receiver) {
		this._messageService.getMessages(user, receiver, this.page);
 		this.user_a_enviar_mensaje = user;
	}


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

	//cargar usaurios seguidores
    getUsers(page){
       	this._userService.getUsersList(page).subscribe(
            response=>{
                if(!response.users) {
                    this.status='error';
                } else {
                    this.status='success';
                    this.total = response.total;
                    this.users = response.users;
                    this.follows = response.users_following;
                    this.pages = response.pages;
                    if(page > this.page){
                        this._router.navigate(['/message'])
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
}