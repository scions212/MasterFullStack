'use strict'

var jwt=require('jwt-simple');
var moment = require('moment');
var secret ='clave-secreta-para-generar-el-token-1234567890';

exports.authenticated = function(req,res,next){

    //comprobar si llega la autorizacion 

    if(!req.headers.authorization){
        return res.status(403).send({
            message:'El Usuario no esta logueado'
        });
    }

    //limpiar el token y quitar las ""
    var token= req.headers.authorization.replace(/['"]+/g, '');

    //decodificar el token
    try{
        var payload = jwt.decode(token,secret);
        //comprobar la expiracion del token
            if(payload.exp <= moment.unix()){
                return res.status(500).send({
                    message:'El token ha expirado'
                });

            }
    }catch(ex){
        return res.status(500).send({
            message:'El token no es valido'
        });
    }
    //adjuntar usuario identificado a request

    req.user=payload;

    next();
};