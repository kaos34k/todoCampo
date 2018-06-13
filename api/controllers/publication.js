'use strict'
var jwt = require('../services/jwt');
var bcrypt = require('bcrypt-nodejs');
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs'); 
var moment = require('moment');
var path = require('path');

var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publications');

function savePublication(req, res) {
	var params = req.body;
	var p = new Publication();
	p.text = params.text;
	p.file = null;
	p.user = req.user.sub;
	p.create_at = moment();

	p.save((err, pStore)=>{
		if(err) return res.status(500).send({messge:'Error al guardar la publicación'});
	
		if(!pStore) return res.status(404).send({messge:'la publicación no ha sido guardada.'});		
		
		return res.status(200).send({publication:pStore});
	});
}

function loadPublications(req, res) {
	try{
		var page = 1;
		if(req.params.page ){
			page = req.params.page;
		}

	 	var itemPerPage = 4;
		Follow.find({user: req.user.sub}).populate('follow').exec()				
				.then((follow) => {
					var follow_clean = [];
					follow.forEach((follow)=> {
						follow_clean.push(follow.follow._id);
					});
                	
                	follow_clean.push(req.user.sub);
                	//ver solo las publicaciones de mis seguidores
				 	//Publication.find({user: {"$in":follow_clean}})
					//ver todas las publicaciones
					Publication.find({user: {"$in":follow_clean}})
					 	.sort('create_at')
					 	.populate('user')
					 	.paginate(page, itemPerPage, (err, publications, total)=>{
			 			if(err) return res.status(500).send({message:"Error en devolver publicaciones."});
				 		
				 		if(!publications) return res.status(404).send({message:"No hay publicaciones"});
			 			
			 			return res.status(200)
			 						.send({
			 							total: total,
			 							pages: Math.ceil(total/itemPerPage),
			 							page: page,
			 							item_per_page: itemPerPage,
			 							publications
			 						});
				 	});
	            }).catch((err)=>{
	            	console.info(err);
	            	return res.status(500).send({message:"Error en devolver seguimiento."});
	            });
	} catch(error){
		console.info("Error", error);
	}

} 


function getPublication(req, res) {
	var publicationId= req.params.id;

	Publication.findById(publicationId, (err, publication)=>{
		if(err) return res.status(500).send({message:"Error en devolver publicacion."});
	 		
 		if(!publication) return res.status(404).send({message:"No hay publicacion"});
		
		return res.status(200).send(publication); 
	});
}

function deletePublication(req, res) {
	var publicationId= req.params.id;

	Publication.find({'user': req.user.sub, '_id':publicationId}).remove((err, publication)=>{
		if(err) return res.status(500).send({message:"Error en devolver publicacion."});
	 		
 		if(!publication) return res.status(404).send({message:"No hay publicacion"});
		
		return res.status(200).send({message:"Se elimino el registro."}); 
	});
}

//cargar imagen de la publicación 
function uploadImagen(req, res) {
	//var userId = re.params.id;
	var publicationId= req.params.id;

	if(req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		
		var split_ext = file_name.split('\.')
		var file_ext = split_ext[1];




		/*Publication.find({'user': req.user.sub, '_id':publicationId}).remove((err, publication)=>{
			if(err) return res.status(500).send({message:"Error en devolver publicacion."});
	 		
 			if(!publication) return res.status(404).send({message:"No hay publicacion"});
		
			if(file_path!= publication.file ) {
				fs.unlink('./upload/user/'+image_file, (err)=>{
					if(err) return res.status(404).send({message:"Problemas eliminado el anterior registro"});
				});	
			} 
		});*/


		if(file_ext==='png' || file_ext==='jpg' || file_ext==='jpeg' || file_ext==='gif'){
			Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdate)=>{
				if(err) return res.status(404).send({message:"Hay errores en la petición"});

				if(!publicationUpdate) return  res.status(500).send({message:"El registro no puede ser procesado."});
				
				return res.status(200).send({publication:publicationUpdate});
			});
		} else {
			return removeUploads(res, file_path, "El tipo de archivo no es compatible."); 
		}
	} else {
		return  res.status(404).send({message:"El registro no puede ser procesado."});
	}
}

function getImagePublication(req, res) {
	var image_file = req.params.imageFile;
	var path_file = './uploads/user/'+image_file;
	fs.exists(path_file, (exist)=>{
		if(exist){
			return res.sendFile(path.resolve(path_file));
		} else {
			return res.status(200).send({message:"No se encontro el registro con la ruta indicada."});
		}
	});
}

function removeUploads(res, file_path, msg){
	fs.unlink(file_path, (err)=>{
		return res.status(200).send({message:msg});
	});	
}

module.exports = {
	savePublication,
	loadPublications,
	getPublication,
	deletePublication,
	uploadImagen,
	getImagePublication
} 
