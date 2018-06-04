'use strict'
var express  = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/save-follow', md_auth.ensureAuth, FollowController.saveFollow );

api.get('/get-follows/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUser );
api.get('/get-my-following/:id?/:page?', md_auth.ensureAuth, FollowController.getMyFollowingUser );
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows );


api.delete('/delete-follow/:id', md_auth.ensureAuth, FollowController.deleteFollow );

module.exports = api;