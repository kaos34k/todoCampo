'use strict'
var jwt = require('../services/jwt');
var bcrypt = require('bcrypt-nodejs');
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs'); 


var Follow = require('../models/follow');
var User = require('../models/user');


function home(req, res) {
	/*return res.status(200).send({
		message : 'Accion de pruebas del home',
	});*/
}

function pruebas(req, res) {
	return res.status(200).send({
		message : 'Accion de pruebas de pruebas'
	});
}


function saveUser(req, res) {
	var params = req.body;
	var user = new User();
	
	if(params.name && params.surname &&
		params.nick && params.email && params.password){
		
		

		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = "ROLE_USUARIO";
		user.image = null;

		User.find({ $or:[
				{email: user.email.toLowerCase()},
				{nick: user.nick.toLowerCase()},
			]}).exec((err, users)=>{
				if(err) return res.status(500).send({message:"Error en la petición"});
				
				if( users && users.length>= 1) {
					res.status(200).send({message:"El usuario ya existe."});
				} else {
					bcrypt.hash(params.password, null, null, (err, hash)=>{
						user.password = hash;

						console.info(user.password);
						user.save ((err, userStore) => {
							if(err) return res.status(500).send({
								message:"Error al guardar el usuario."
							});

							if(userStore) {
								res.status(200).send({
									user : userStore
								});	
							} else {
								return res.status(404).send({message:"No se ha registrado el usaurio."});
							}

						});
					});
				}
			});
	} else{
		res.status(200).send({
			message : 'llena todos los campos necesarios.'
		});		
	}
}

function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;
	//borrar password
	delete update.password;
	if(userId != req.user.sub){
		return res.status(500).send({message:"No tiene permisos para editar al usuario."});
	}

	User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate)=>{
		if(err) return res.status(500).send({message:"Error al actualizar el usuario."});

		if(!userUpdate) return res.status(404).send({message:"El usuario no se ha podido identificar."});
		
		return  res.status(200).send({user:userUpdate}); 
	});
}

function uploadImege(req, res) {
	var userId = re.params._id;


	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		
		var split_ext = file_name.split('\.')
		var file_ext = split_ext[1];

		if(userId!= req.user.sub) {
			return removeUploads(res, file_path, "No tiene permisos para editar al usuario.");
		}


		if(file_ext==='png' || file_ext==='jpg' || file_ext==='jpeg' || file_ext==='gif'){
			User.findByIdAndUpdate(useId, {image: file_name}, {new:true}, (err, userUpdate)=>{
				if(err) return res.status(404).send({message:"Hay errores en la petición"});

				if(!userUpdate) return  res.status(500).send({message:"El registro no puede ser procesado."});
				
				return res.status(200).send({user:userUpdate});
			});
		} else {
			return removeUploads(res, file_path, "El tipo de archivo no es compatible."); 
		}
	} else {
		return  res.status(404).send({message:"El registro no puede ser procesado."});
	}
}

function getImageUser(req, res) {
	var image_file = req.params.imageFile;
	var path_file = './upload/user/'+image_file;
	fs.exist(path_file, (exist)=>{
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

function login(req, res) {
	var params = req.body;
	var email = params.email;
	var password = params.password;
	User.findOne({
		email: email
	}, (err, user)=> {
		if(err) return res.status(500).send({message:"Error en la petición."});
		


		if(user){
			bcrypt.compare(password, user.password, (err, check)=>{
				if (check) {
					if(params.gettoken){
						return  res.status(200).send({
							token: jwt.createToken(user),
							message:"Se cargo la información correctamente."
						});
					} else {
						user.password = undefined;
						return res.status(200).send({
							user: user, 
							message:"Se cargo la información correctamente."
						});						
					}

				} else {
					if(err) return res.status(404).send({message:"El usuario no se ha podido identificar."});
				}
			});
		} else {
			return res.status(404).send({message:"El usuario no se ha podido identificar."});
		}
	});
}

function getUser(req, res) {
	var useId = req.params.id;
	User.findOne(useId, (err, user)=>{
		if (err) return res.status(500).send({message:"Error en la petición."});

		if (!user) return res.status(404).send({message:"El usuario no existe."}); 

		/*Follow.findOne({'user': req.user.sub,'followed':useId}).exce((err, follow)=>{
			if (err) return res.status(500).send({message:"Error en la petición."});

			return res.status(200).send({user, follow});
		});*/
 		
 		followThisUser(req.user.sub, useId).then((val)=>{
 			user.password = undefined;
 			return status(200).send({
 				user, 
 				following: val.following, 
 				followed: val.followed
 			});
 		});
	});
}

function getUsers(req, res) {
	//var identity_user_id = req.user.sub;
	
	var page = 1;
	if(req.params.page ){
		page = req.params.page;
	}

	var pageSize = 5;
	User.find().sort('_id').paginate(page, pageSize, (err, users, total)=>{
		if (err) return res.status(500).send({message:"Error en la petición."});

		if (!users) return res.status(404).send({message:"Ho hay usuarios disponibles."}); 
		

		followUserId().then((val)=>{
			return res.status(404).send({
				users,
				users_following: val.following,
				users_followed: val.followed,
				total,
				pages: Math.ceil(total/pageSize)
			}); 
		});
	});
}

function getCounters(req, res) {
	var userId = req.user.id;	
	if(req.params.id) {
		getConutFollow(req.params.id).then((val)=>{
			return res.status(200).send(val);
		});
	} 
	getConutFollow(userId).then( (val)=>{
		return res.status(200).send(val);
	});

}



//metodos privados
async function followUserId(user_id){
	var following = await Follow.find({"user": user_id}).select({'_id':0, '__v':0,'user':0}).exec((err, follow)=>{
		return follow;
	});

	var followed = await Follow.find({"followed": user_id}).select({'_id':0, '__v':0,'followed':0}).exec((err, follow)=>{
		return follow;
	});


	var followed_clean = [];
	followed.forEach((follow)=>{
		followed_clean.push(follow.user);
	});


	var following_clean = [];
	following.forEach((follow)=>{
		follows_clean.push(follow.followed);
	});


	return {
		following: following_clean, 
		followed: followed_clean
	}
}

async function followThisUser(identity_user_id, user_id){
	var following = await Follow.findOne({"user": identity_user_id, "followed": user_id}).exec((err, follow)=>{
		if(err) return handleError(err);

		return follow;
	});

	var followed = await Follow.findOne({"user":user_id, "followed":identity_user_id }).exec((err, followed)=>{
		if(err) return handleError(err);

		return followed;
	});

	return {
		following: following,
		followed: followed
	}

} 

async function getConutFollow(user_id) {
	var following = await Follow.count({"user": user_id}).exec((err, count)=>{
		if(err) return handleError(err);
		return count;
	});

	var followed = await Follow.count({"followed": user_id}).exec((err, count)=>{
		if(err) return handleError(err);
		return count;
	});

	return {
		total_following: following,
		total_followed: followed
	}
}



module.exports = {
	home,
	pruebas,
	saveUser,
	login,
	getUser,
	getUsers,
	updateUser,
	uploadImege,
	getImageUser,
	getCounters 		
}