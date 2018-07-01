import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { User } from '../../models/user';
import { Publication } from '../../models/publication';
import { Follow } from '../../models/follow';

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
	private identity;
	private token;
	private status: string;
	private siguiendo;
	private seguidor;
	private publication;
	private publications: Publication[];

	private msgInput: string = 'lorem ipsum';
	private messages = [];

	//controles de paginación para publicaciones
	private total;
	private page = 1;
	private pages;
	private itemPerPage;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService,
			private _uploadService: UploadService,
			private _followService: FollowService,
			private _messageService: MessageService
		) {
		
		this.url = GLOBAL.url;
		this.title = "Perfil";
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
	}

	ngOnInit() {
	    this._messageService
	      	.getMessages()
	      	.subscribe((message) => {
	        	this.messages.push(message);
      		console.info("Mensajes", this.messages);
      	});
	}

	onSubmit() {
	}

	sendButtonClick() {
		
		console.info("Mensajes", this.messages);
		this._messageService.sendMessage("hola mundo");

		 this._messageService
	      	.getMessages()
	      	.subscribe((message) => {
	        	this.messages.push(message);
	  		
	  	});

	}
}