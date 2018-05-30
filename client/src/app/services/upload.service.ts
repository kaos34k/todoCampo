import { Injectable } from '@angular/core';
import {GLOBAL} from './global.service';


@Injectable()
export class UploadService{
	public url: string;

	constructor(){
		this.url= GLOBAL.url;
	}

	/**
	* este metodo es el encargado de cargar los archivos
	* recibe como parametros:
	* @params url: es hacia donde va a puntar el servicio de descarga
	* @params params: en caso de que se requiera de envio de parameros al servidor es de uso opcional
	* @params files: son los archivos que seran enviados al servidor para ser procesados por el muismo
	* @params name: es el nombre que se le dara al archivo en caso de ser almacenado
	* 
	* se puede ver documentación del ajax nativo de java Script en: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest 
	*/
	makeFileRequest(url:string, params : Array<string>, files: Array<File>, token:string, name:string){
		return new Promise( function(resolve, reject) {
					var formData: any = new FormData();
					var xhr = new XMLHttpRequest();

					//mientras existan files este siclo se cumplira
					for (var i = 0; i < files.length; i++) {
						formData.append(name, files[i], files[i].name);
				 	}

				 	xhr.onreadystatechange =function () {
				 		//valido si el estado es igual a 4
				 		if (xhr.readyState==4) {
				 			//valido si el codigo de la respuesta es = a 200
				 			if (xhr.status==200) {
				 				resolve(JSON.parse(xhr.response));
				 			}else{
				 				reject(	xhr.response);
				 			}
			 			}	
				 	}

				 	xhr.open("POST", url, true);
			 		xhr.setRequestHeader('Authorization', token);
			 		xhr.send(formData);
				})
	}

}