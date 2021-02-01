'use strict'

var jwt=require('jwt-simple');
var moment =require('moment');

exports.createToken= function(user){
    
    var payload= {
      /*ID DEL USUARIO*/  
      sub: user._id,
      name: user.name,
      surname:user.surname,
      email:user.email,
      role:user.role,
      photoProfile:user.photoProfile,
      iat:moment().unix(),
      exp:moment().add(30, 'days').unix
    };

//generar Token del Payload
    return jwt.encode(payload, 'clave-secreta-para-generar-el-token-1234567890');
};
