'use strict'
//var fs = require('fs'); 
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs'); 

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res) {
	var params = req.body;
	var follow = new Follow();
	follow.user = params.user;
	follow.follow  = params.follow; 

	follow.save((err, followStored)=>{
		if(err) return res.status(500).send({message: "No se guarado el registro"});
		
		if (!followStored) return res.status(404).send({message: "No se guarado el registro"});
		
		return res.status(200).send({message:"Se guardo la información corretamente.", follow:followStored});
	});
}

function deleteFollow(req, res) {
	var userId = req.user.sub;
	var followId= req.params.id;


	//la antigua forma de elimiar registros requeria de hacer un acambio en la variable
	//retryWrites=true a false para poder usar de manera correta el metodo remove que es sustituido por
	//findOneAndRemove que resibe como paametros el filtro por el que 
	//va a eliminar el regstro y la respuesta o callback 
	//var follow= Follow.find({'user':userId, 'follow':followId});
	
	Follow.findOneAndRemove({'user':userId, 'follow':followId},  err=>{
		if(err) return res.status(500).send({message:'No se removio el registro'});
		
		return res.status(200).send({message: 'se elimino el registro corectamente'});
	}); 
}

function getFollowingUser(res, req) {
	var userId = req.user.sub;

	if(req.params.id){
		userId = req.params.id;	
	}

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Follow
		.find({'user':userId})
		.populate({path: 'follow'})
		.paginate(page, itemsPerPage, (err, follows, total)=>{
			if(err) return res.status(500).send({message:'Problemas cargando los registros'});

			if(!follows) return res.status(404).send({message:'No hay registros'});
			
			return res.status(200).send({
				follows,
				total:total,
				pages: Math.ceil(total/itemsPerPage)
			});
		});
}


function getMyFollowingUser(res, req) {
	var userId = req.user.sub;

	if(req.params.id){
		userId = req.params.id;	
	}

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;
	Follow
		.find({'follow':userId})
		.populate('user follow')
		.paginate(page, itemsPerPage, (err, follows, total)=>{
			if(err) return res.status(500).send({message:'Problemas cargando los registros'});

			if(!follows) return res.status(404).send({message:'No hay registros'});
			
			return res.status(200).send({
				follows,
				total:total,
				pages: Math.ceil(total/itemsPerPage)
			});
		});
}

function getMyFollows(res, req){
	var userId = req.user.sub; 

	var find = Follow.find({user:userId}); 
	if(req.params.followed){
		find = Follow.find({followed:userId});
	}

	find.populate('user followed').exec((err, follows)=>{
		if (err) return res.status(500).send({message:'Error en el servidor'});

		if(!follows) return res.status(404).send({message:'Error en el servidor'});
		
		return res.status(200).send({follows});
	});
}

module.exports= {
	saveFollow,
	deleteFollow,
	getFollowingUser,
	getMyFollowingUser,
	getMyFollows
}