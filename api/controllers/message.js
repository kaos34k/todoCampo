'use strict'
var moment = require('moment'); 

var mongoosePagination = require('mongoose-pagination');
var fs = require('fs'); 

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

//guardar mensajes 
async function saveMessage(data) {

	if (!data.text || !data.receiver) return 'no se puede enviar el mensaje';

	var message = new Message();
	message.emitter = data.emitter; 
	message.receiver = data.receiver;
	message.text = data.text; 
	message.create_at = moment(); 
	message.view = 'false';
	
	var msg = await message.save()
			.then((messageStore) => {
				if(!messageStore) return {message: 'No se puede almacenar la información'};
				
				return messageStore;
	    })
	    .catch((err)=>{
	    	console.info("error", err);
	        return err;
	    });
	return msg;
}

//cargar mensajes recibidos
function getReceiveMessages(req, res) {
	var userId = req.user.sub;

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemPerPage = 4;
	Message.find({receiver:userId}).populate('emmiter', 'name surname _id image')
		.paginate(page, itemPerPage, (err, messages, page)=>{
		if(err) return res.status(404).send({message: 'Error en la petición'}); 
		
		if(!messages) res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemPerPage),
		 		messages
		 	});
	});
}

async function getEmmiterMessages(emmiters, receivers, page = 1) {
	var itemPerPage = 7;
	var mensajes  = await Message.find({$or:[{emmiter:emmiters, receiver: receivers}, {emmiter: receivers, receiver: emmiters}]})
		.populate('emmiter', 'name surname _id image').paginate(page, itemPerPage)
			.then((messages) => {
					if(!messages) return {message: 'No se puede almacenar la información'};
					
					return {
						
			 			messages
				 	};
		    })
		    .catch((err)=>{
		    	console.info("Error en la aplicación", err);
		        return err;
		    });
	    return mensajes;
}

function getUnviewMessages(req, res) {
	var userId = req.user.sub;
	Message.count({receiver:userId}).exec((err, count)=>{
		if(err) return res.status(404).send({message: 'Error en la petición'}); 
		
		return res.status(200).send({
				'unviewed':count
		 	});
	});
}

function setViewMessages(req, res) {
	var userId = req.user.sub;
	Message.update({receiver:userId, view:'false'}, {view:'true'}, {"multi":true}, (err, count)=>{
		if(err) return res.status(404).send({message: 'Error en la petición'}); 
		
		return res.status(200).send({
				'unviewed':count
		 	});
	});
}

module.exports = {
	saveMessage,
	getReceiveMessages,
	getEmmiterMessages,
	getUnviewMessages, 
	setViewMessages
}