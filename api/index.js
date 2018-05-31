'use strict'

var mongoose= require('mongoose');
var app = require('./app.js');
var port = 3899;

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://127.0.0.1:27017/demo-mongo')
//mongoose.connect('mongodb+srv://miapp:KMbz413F6CFDWc73@cluster0-ptyun.mongodb.net/test?retryWrites=true')

var url = 'mongodb://miapp:KMbz413F6CFDWc73@'+//usuario y contraseña
			'cluster0-shard-00-00-ptyun.mongodb.net:27017,'+ //servidor 1 principal
			'cluster0-shard-00-01-ptyun.mongodb.net:27017,'+ //servidor 2 apoyo
			'cluster0-shard-00-02-ptyun.mongodb.net:27017/'+ //servidor 1 apoyo
			'desarrolloapp?'+//mi bd
			'ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';//parametros adicionales

mongoose.connect(url)
.then((client)=>{
	app.listen(port, ()=>{
		console.info("Ya se encuentra conetada mi aplicación");
	});
}).catch( err => console.info(err));