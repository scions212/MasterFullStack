'use strict'

var mongoose=require('mongoose');
var app=require('./app');
var port = process.env.PORT || 4000;

mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost:27017/api_rest_node",{  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
        .then(()=>{
            console.log("la conexion a la base de datos de mongo, se ha realizado correctamente");
       
            //Crear servidor
            app.listen(port,()=>{
                console.log('Servidor corriendo en http://localhost:'+port);
            });
        })
        .catch(error=> console.log(error));


