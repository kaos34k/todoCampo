'use strict'
var jwt = require('../services/jwt');
var bcrypt = require('bcrypt-nodejs');
var mongoosePagination = require('mongoose-pagination');
var fs = require('fs'); 
var path = require('path');

var User = require('../models/user');
var Valvula = require('../models/valvula');


function controlElectroValvulas(req, res) {
	Valvula.find().exec(function (err, valvulas) {
	  	if (err) return res.status(200).send({message: 'Problemas al cargar la informacion'});

		console.error(valvulas);
		return res.status(200).send({
			message: 'Se elimino el registro corectamente',	
		});  
	});
}


function crearValvula(req, res) {
		var valvula = new Valvula();

		valvula.valvula = 1;
		valvula.horaInicio = 8;  
		valvula.horaFin = 9;
		valvula.lunes = "si";
		valvula.martes= "si";
		valvula.miercoles= "si";
		valvula.jueves= "si";
		valvula.viernes= "si";
		valvula.sabado= "si";
		valvula.domingo = "si";
		valvula.iteracion = 0;

		valvula.save((err, valvulaStore) => {
			if(err) return res.status(500).send({
				message:"Error al guardar la valvula."
			});

			if(valvulaStore) {
				res.status(200).send({
					valvulaStore
				});	
			} else {
				return res.status(404).send({message:"No se ha registrado el usaurio."});
			}

		});
}

module.exports = {
	controlElectroValvulas,
	crearValvula
}