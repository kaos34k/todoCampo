'use strict'

//https://stackoverflow.com/questions/50283081/mongodb-error-cannot-use-retryable-writes-with-limit-0
//retryWrites=trues una buena cosa, una solución para esta incompatibilidad es usar en findOneAndRemovelugar de remove(parece que estás usando mangosta)

var mongoose= require('mongoose');
var app = require('./app.js');
var port = 3899;
var server = require('http').Server(app);  
var io = require('socket.io')(server);

//servicios chat
var messageController = require('./controllers/message');


io.on('connection',  (socket) => {
	//console.info("estoy conectado a un socket", socket);
	socket.on('message', function(data) {
		console.info("hola", data);
    	io.emit('message', data);
  	});

	//nuevo mensage
    socket.on('save-message', (message) => {
    	console.info(message);
      	//messageController.saveMessage();
    });


	socket.on('chatmessage', function(msg){
		console.log('message: ' + msg);
	});


    //recibir mensajes
    socket.on('recivido-message', (message) => {
      	//messageController.getReceiveMessages();
    })

    //emitir mensajes
    socket.on('emmiter-message', (message) => {
      	//messageController.getEmmiterMessages();
    })

    //ver mensajes
    socket.on('view-message', (message) => {
      	//messageController.getUnviewMessages();
    })

    //mensajes vistos
    socket.on('save-message', (message) => {
      	messageController.setViewMessages();
    	socket.emit('message', { msg: 'Welcome bro!' });
    })

    //esperimentos
    /*socket.on('msg',(msg) => {
    	socket.emit('msg', { msg: "you sent : "+msg });
    })*/
});

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
.then((client)=> {
	server.listen(port, ()=>{
		console.info("Ya se encuentra conetada mi aplicación");
	});
}).catch( err => console.info(err));
