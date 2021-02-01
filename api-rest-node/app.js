'use strict'

//requires
var express = require("express");
var bodyParser = require("body-parser");
const morgan = require('morgan');


//Ejecutar Express
var app = express();

/** Cargar rutas */
var user_routes=require('./routes/user');
var topic_routes=require('./routes/topic');
var comment_routes=require('./routes/comment');


/**middleware*/
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


/**CORS*/
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});



/** Resscribir rutas -- para añadir / api*/
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

module.exports=app;