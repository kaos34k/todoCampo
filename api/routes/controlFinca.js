'use strict'
var express  = require('express');
var ControlFincaController = require('../controllers/controlFinca');
var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.get('/control-motores', ControlFincaController.controlElectroValvulas );
api.get('/crear-valvula', ControlFincaController.crearValvula );

module.exports = api;