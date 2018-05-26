'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "PRUEBAS_CLAVE_SECRETO";

exports.ensureAuth = function(req, res, next) {
	if(!req.headers.authorization){
		return res.status(403).send({
			message:"La petición no tiene cabecera de autenticación"
		});
	}

	var token = req.headers.authorization.replace(/['"]+/g, '');
	console.info(token);
	try {
		var pyload = jwt.decode(token, secret);
		if (pyload.exp<=moment().unix()) {
			return res.status(401).send({
				message:"El token ha expirado."
			});
		}	
	} catch(e){
		console.error("Errores", e);
		return res.status(404).send({
			message:"El token no es válido."
		});
	}
	req.user = pyload;
	next();
}