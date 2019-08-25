'use strict'

var express = require('express');
var bodyParser =require('body-parser');
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var pulication_routes = require('./routes/publication');
var messges_routes = require('./routes/message');
var finca_routes = require('./routes/controlFinca');

//cargar middelwares
app.use(bodyParser.urlencoded({
	extended:false
}));
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.header('origin') 
                                                || req.header('x-forwarded-host') || req.header('referer') || req.header('host'));
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', pulication_routes);
app.use('/api', messges_routes);
app.use('/api', finca_routes);




//exportar
module.exports = app;