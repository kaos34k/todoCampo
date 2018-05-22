'use strict'

var express = require('express');
var messageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/user'});

api.post("/save-message", md_auth.ensureAuth, messageController.saveMessage);

api.get("/get-messages-receive/:page?", md_auth.ensureAuth, messageController.getReceiveMessages);
api.get("/get-messages-emmiter/:page?", md_auth.ensureAuth, messageController.getEmmiterMessages);
api.get("/get-messages-unview", md_auth.ensureAuth, messageController.getUnviewMessages);
api.get("/update-messages-view", md_auth.ensureAuth, messageController.setViewMessages);

module.exports = api;