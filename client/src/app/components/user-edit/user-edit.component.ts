import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user'
import { GLOBAL } from '../../services/global.service';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';

@Component({
	selector: 'user-edit',
	templateUrl: './user-edit.component.html',
	providers: [UserService, UploadService]
})

export class UserEditComponent {
	
	private url:string;
	private title:string;
	private user: User;
	private identity;
	private token;
	private status: string;

	constructor(
			private _route: ActivatedRoute,
			private _router: Router,
			private _userService: UserService,
			private _uploadService: UploadService
		) {
		
		this.url = GLOBAL.url;
		this.title = "Actualizar datos";
		this.user = this._userService.getIdentity();
		this.identity = this.user;
		this.token = this._userService.getToken();
	}

	ngOnInit(){
		
	}

	onSubmit(){
		this._userService.updateUser(this.user).subscribe(
			response=>{
				if(!response.user){
					this.status = "error";
				} else { 
					this.status = "success";
					localStorage.setItem("identity", JSON.stringify(response.user));
					this.identity = this.user;

					//subir archivos
					this._uploadService.makeFileRequest(this.url+'upload-imagen/'+this.user._id, [], this.filesToUpload, this.token, 'image')
										.then( ( result:any )=>{
											this.user.image = result.user.image;
											localStorage.setItem('identity', JSON.stringify(this.user)) 
										});
				}
			},
			error=>{
				var errorMessage = <any> error;
				console.error(errorMessage);
			}
		);
	}

	//este metodo es para cargar la foto de mi usuario en sesión
	public filesToUpload: Array<File>;
	fileChangeEvent(file) {
		this.filesToUpload=<Array<File>>file.target.files;
	}
}