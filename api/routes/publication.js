'use strict'

var express = require('express');
var publicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/user'});

api.post("/save-publication", md_auth.ensureAuth, publicationController.savePublication);
api.post("/upload-foto/:id", [md_auth.ensureAuth,md_upload], publicationController.uploadImagen);

api.get("/load-publication/:page?", md_auth.ensureAuth, publicationController.loadPublications);
api.get("/publication/:id", md_auth.ensureAuth, publicationController.getPublication);
api.get("/get-imagen-publication/:imageFile", publicationController.getImagePublication);

api.delete("/delete-publication/:id", md_auth.ensureAuth, publicationController.deletePublication);

module.exports = api;