import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { User } from '../../models/user'
import { Publication } from '../../models/publication';
import { GLOBAL } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { PublicationService } from '../../services/publication.service';

@Component({
	selector: 'sidebar',
	templateUrl:'./sidebar.component.html',
	providers: [UserService, UploadService, PublicationService]
})

export class SidebarComponent {
	
	private url:string;
	private title:string;
	private user: User;
	private identity;
	private token;
	private status: string;
	private stats;
	private publication;
	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService,
			private _uploadService: UploadService,
			private _publicationService: PublicationService,
		) {
		this.title= "Mi publicación";
		this.identity= _userService.getIdentity();
		this.token= _userService.getToken();
		this.url = GLOBAL.url;
		this.stats = _userService.getStats();
		console.info("this.stats", this.stats);


		this.publication = new Publication("","","","" ,this.identity,);
	}


	ngOnInit(){

	}

	//guardar publicación
	onSubmit(form){
		console.info(this.filesToUpload);
		this._publicationService.addPublication(this.token, this.publication).subscribe(
			response=> {
				if(!response){
					this.status = "error";
				} else {
					this.status = "success";
					//this.publication = response.publication;
					
					//subir archivos
					let url = this.url+'upload-foto/'+this.publication._id;
					this._uploadService.makeFileRequest(url, [], this.filesToUpload, this.token,"image")
									.then( ( result:any ) => {
										//this.publication.file = result.publication.file;
									});
					form.reset();
				}	
			}, error=> {
				var errorMessage = <any> error;
				console.error(errorMessage);
			}
		)
	}

	//este metodo es para cargar imagenes
	public filesToUpload: Array<File>;
	fileChangeEvent(file) {
		this.filesToUpload=<Array<File>>file.target.files;
	}
}