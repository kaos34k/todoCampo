'use strict'
var moment = require('moment'); 

var mongoosePagination = require('mongoose-pagination');
var fs = require('fs'); 

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function saveMessage(req, res) {
	var params = req.body;
	if (!params.text || !params.receiver) return res.status(404).send({message: 'no se puede enviar el mensaje'});

	var message = new Message();
	message.emmiter = req.user.id; 
	message.receiver = params.receiver;
	message.text = params.text 
	message.create_at = moment.unix(); 
	message.view = 'false';
	message.save((err, messageStore)=>{
		if(err) return res.status(404).send({message: 'Error en la petición'});
		
		if(!messageStore) res.status(500).send({message: 'Error al enviar el mensaje'});
		
		return res.status(200).send(messageStore);
	});
}


function getReceiveMessages(req, res) {
	var userId = req.user.sub;

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemPerPage = 4;
	Message.find({receiver:userId}).populate('emmiter', 'name surname _id image').paginate(page, itemPerPage, (err, messages, page)=>{
		if(err) return res.status(404).send({message: 'Error en la petición'}); 
		
		if(!messages) res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemPerPage),
		 		messages
		 	});
	});
}

function getEmmiterMessages(req, res) {
	var userId = req.user.sub;

	var page = 1;
	if (req.params.page) {
		page = req.params.page;
	}

	var itemPerPage = 4;
	Message.find({emmiter:userId}).populate('emmiter', 'name surname _id image').paginate(page, itemPerPage, (err, messages, page)=>{
		if(err) return res.status(404).send({message: 'Error en la petición'}); 
		
		if(!messages) res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemPerPage),
		 		messages
		 	});
	});
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