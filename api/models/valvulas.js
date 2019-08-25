'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ValvulaSchema = Schema({
	valvula:String,
	inicioApertura:String,
	finApertura:String,
	lunes:String,
	martes:String,
	miercoles:String,
	jueves:String,
	viernes:String,
	sabado:String,
	domingo:String,
	iteracion:String,
	user: {type:Schema.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Valvula',ValvulaSchema);