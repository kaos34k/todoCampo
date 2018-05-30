'use strict'

var express  = require('express');
var UserController = require('../controllers/user.js');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/user'});

api.post('/guardar-usuario', UserController.saveUser);
api.post('/login-usuario', UserController.login);
api.post('/upload-imagen/:id', [md_auth.ensureAuth,md_upload], UserController.uploadImege);

api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.get('/home', UserController.home);
api.get('/get-usuario/:id',md_auth.ensureAuth, UserController.getUser);
api.get('/get-usuarios/:page?',md_auth.ensureAuth, UserController.getUsers); 
api.get('/get-imagen-user/:imagenFile', UserController.getImageUser);
api.get('/counters', md_auth.ensureAuth, UserController.getCounters);

api.post('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;