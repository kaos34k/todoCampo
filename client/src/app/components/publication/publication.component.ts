import { Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { User } from '../../models/user';
import { Publication } from '../../models/publication';

import { GLOBAL } from '../../services/global.service';
import { UploadService } from '../../services/upload.service';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';

import * as $ from 'jquery';

@Component({
	selector : 'publications',
	templateUrl: './publication.component.html',
	providers: [UserService, UploadService, PublicationService]
})

export class PublicationComponent {
	private url;
	private title: String;
	private user: User;
	private status: string;
	private identity;
	private token;
	private stats;
	private publication;
	private loader;
	private publications: Publication[];

	//controles de paginación
	private total;
	private page = 1;
	private pages;
	private itemPerPage;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService:UserService,
			private _publicationService: PublicationService,
			private _uploadService : UploadService,
		) {
		this.title = "";
		this.identity= _userService.getIdentity();
		this.token= _userService.getToken();
		this.url = GLOBAL.url;
		this.stats = _userService.getStats();
		this.loader = false;
	}

	//inicializar mis publicaciones
	ngOnInit() {
		this.loadPublications(this.page);
	}

	//listar publicaciones
	loadPublications(page, adding=false) {
		this.loader = true;
		this._publicationService.loadPublications(this.token,page).subscribe(
			response=> {
				if(!response){
					this.status='error';
				} else {
					this.total = response.total;
					this.pages = response.pages;
					this.itemPerPage = response.item_per_page;
					if(!adding){
						this.publications = response.publications;
					} else {
						var arrayA = this.publications;
						var arrayB = response.publications;
						this.publications = (arrayA!= undefined) ? arrayA.concat(arrayB) : arrayB;
					}

					if(page > this.pages){
						//this._router.navigate(['/timeline'])
					}
					this.status = "success";
				}
				this.loader = false;	
			}, error=> {
				this.loader = false;
				var errorMessage = <any> error;
				console.error(errorMessage);
			}
		)
	}

	//eliminar publicaciones
	deletePublicaion() {
		this._publicationService.deletePublication(this.token, this.publication).subscribe(
			response=> {
				if(!response){
					this.status = "error";
				} else {
					this.status = "success";
				}	
			}, error=> {
				var errorMessage = <any> error;
				console.error(errorMessage);
			}
		)
	}

	//este metodo es para ccargar fotografia
	public filesToUpload: Array<File>;
	fileChangeEvent(file) {
		this.filesToUpload=<Array<File>>file.target.files;
	}

	//control de view mas
	public noMore = false;
 	viewMore(){
		this.page += 1;
		if(this.page >= this.pages){
			this.noMore = true;
		}

		this.loadPublications(this.page, true);
 	}


 	@HostListener('window:scroll', ['$event'])
 	onElementScroll($event) {
 		if(!this.noMore){
 			this.viewMore();
 		}
	}
}