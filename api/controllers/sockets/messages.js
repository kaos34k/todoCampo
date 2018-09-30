const { io } = require('../../index');
var messageController = require('../message');

io.on('connection',  (socket) => {


    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });



	//mensajes de dos usaurios en particular 
    socket.on('message', (data) => {
        var res = messageController.saveMessage(data);
        res.then(result => {
            var mensajes = messageController.getEmmiterMessages(result.emmiter, result.receiver);
            mensajes.then(resp =>{
                socket.emit("message", data);
            }); 
        });	
    });


  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  

});