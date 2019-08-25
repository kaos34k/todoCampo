// Instalar el servidor express
const express = require ('express');
const path = require ('path');

const app = express ();

// Servir solo los archivos estáticos del directorio dist
app.use (express.static (__ dirname + '/ dist / <name-of-app>'));

app.get ('/ *', función (req, res) {
    
res.sendFile (path.join (__ dirname + '/ dist / <name-of-app> /index.html'));
});

// Iniciar la aplicación escuchando en el puerto Heroku predeterminado
app.listen (process.env.PORT || 8080);
