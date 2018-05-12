'use strict'

var mongoose= require('mongoose');
var app = require('./app.js');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/demo-mongo')
.then(()=>{
	app.listen(port, ()=>{
		console.info('conectado');
	});
}).catch( err => console.info(err));