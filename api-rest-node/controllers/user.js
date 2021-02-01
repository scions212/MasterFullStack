'use strict'

var User = require('../models/user');
var validator =require('validator');
var bcrypt = require('bcryptjs');
var fs =require('fs');
var path=require('path');
const saltRounds = 10;
var jwt = require('../services/jwt');
const { exists } = require('../models/user');

var controller = {


    getUsers: function(req,res){

        User.find().exec((err,users)=>{
            if(err || !users){
                return res.status(404).send({
                    status:'Error',
                    message:"No hay usuarios registrados"
                });
            }
            return res.status(200).send({
                status:'Success',
                users
            });
        });
    },

    getUser: function(req,res){

        var userId = req.params.userId;

        User.findById(userId).exec((err,user)=>{
            if(err || !user){
                return res.status(404).send({
                    status:'Error',
                    message:"No existe el usuario"
                });
            }
            return res.status(200).send({
                status:'Success',
                user
            });
        });
    },

    postRegister:function(req,res){
    //recoge los parametros de la peticion
     
    //recoge los parametros de la peticion
    var params = req.body;

    //valida los datos
    try{
       
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_role = !validator.isEmpty(params.role);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);   
        var validate_password = !validator.isEmpty(params.password);

    }catch(err){
            return  res.status(404).send({
                message:'faltan datos por enviar // Save', 
        });
    }

//console.log(validate_name, validate_lastname,  validate_email,validate_password, validate_photoPerfile);
        if (validate_name && validate_surname && validate_role &&  validate_email  && validate_password  ){


//Crea Objeto Usuario
            var user = new User();
	
            user.name = params.name;
            user.surname = params.surname;
            user.role = params.role;
            user.email = params.email.toLowerCase();
            user.password = bcrypt.hashSync(params.password,10);
            user.photoPerfile = null;

//Comprobar que el usuario existe
                User.findOne({ email:user.email}, (err, issetUser)=>{
                    if (err){
                         return res.status(500).send({
                        message: 'Error al comprobar el duplicidad el usuario. // Save '
                    });
                }

                if (!issetUser) {
//Si no existe     
//cifra la contraseña
                    bcrypt.hash(params.password, saltRounds, function(err, hash) {
                        user.password=hash;
                       //Guarda el Usuario
                       user.save((err, userStored)=>{
                           console.log(err, userStored);
                        if (err){
                            return res.status(500).send({
                                message: 'Error al guardar el usuario. // Save'
                                });
                            }
                        if(!userStored){
                            return res.status(400).send({
                                message: 'El usuario no se ha guardado.// Save'
                                });

                            }
                             //Devolver Respuestas  
                        return res.status(200).send({
                            status : 'success // Save',
                            user: userStored
                            });
                       });//close save
                                      
                    });//close bycript

                }else{
                    return res.status(200).send({
                        message:'El usuario ya existe en la BD // Save'
                        });
                    }
                });
        }else{
            return res.status(200).send({
            message:'la validacion de los datos del usuario es incorrecta, intentalo de nuevo// Save'
            });
        }
    },

        postLogin : function(req, res){
            //recoger los parametros de la peticion
            var params= req.body;

            //validar los datos
            try{
            var validate_email = !validator.isEmpty(params.email)  && validator.isEmail(params.email);
            var validate_password =!validator.isEmpty(params.password);
        }catch(err){
            return res.status(500).send({
                message:"Faltan datos por Enviar",

                err
            });
        }
            if(!validate_email || !validate_password){
                return res.status(500).send({
                    message:"Datos incorrectos",
                    params
                    });
            }
            
             User.findOne({email: params.email.toLowerCase()}, (err,user)=>{

                if(err){
                    return res.status(500).send({
                        message:"Error al intentar identificarse",
                    });
                }

                if(!user){
                    return res.status(500).send({
                        message:"Usuario no existe",
                    });
                }

                    //si lo encuentra,     
                    //validar contraseña (coincidir el email con el password: metodo bcrypt)
    
                    bcrypt.compare(params.password, user.password, (err,check)=>{


                    //si es correcto 
                    if(check){
                    //generar token jwt y devolver luego
                        if(params.gettoken){

                            return res.status(200).send({
                                token:jwt.createToken(user)
                                });
                        }else{
                            //limpiar el objeto password
                            user.password= undefined;

                            // devolver los datos{
                            return res.status(200).send({
                                status:'Success',
                                user
                                });
                             }
                       }else{
                        res.status(500).send({
                        message:"Las credenciales no coincide",
                        });
                    }
                   
                    });                
                   
             });    
            
        },

        postUpdate: function(req,res){

        //recoger los dtos del body
            var params = req.body;

        //validar datos  
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email)  && validator.isEmail(params.email);
        }catch(err){
                res.status(200).send({
                    message:"Faltan datos por enviar",
                    });
                }

            //Eliminar propiedades innecesarias
            delete params.password;
            
            var userId=req.user.sub;    
            
            if(req.user.email != params.email){

                User.findOne({email: params.email.toLowerCase()}, (err,user)=>{

                    if(err){
                        return res.status(500).send({
                            message:"Error al intentar identificarse",
                        });
                    }
    
                    if(user && user.email == params.email){
                        return res.status(500).send({
                            message:"El email no puede Ser modificado",
                        });
                    }else{
                             //User.findOneAndUpdate(condicion,datos actualizar, cofiguracion o opciones, callback)
                User.findOneAndUpdate({_id : userId},params,{new:true}, (err,userUpdate)=>{
                    if(err){
                        res.status(500).send({
                            status:'Error',
                            message:'error al actualizar el usuario'
                            });
                        }

                    if(!userUpdate){
                        res.status(500).send({
                            status:'Error',
                            message:'No se ha actualizado el usuario'
                            });
                        }
                          
                //devolver respuesta
                res.status(200).send({
                    status:"Success",
                    userUpdate
                            });
                        });
                    }
                });

            }else{
            //Realizar la busqueda y actualizacion de documentos.

            //User.findOneAndUpdate(condicion,datos actualizar, cofiguracion o opciones, callback)
                User.findOneAndUpdate({_id : userId},params,{new:true}, (err,userUpdate)=>{
                    if(err){
                        res.status(500).send({
                            status:'Error',
                            message:'error al actualizar el usuario'
                            });
                    }

                    if(!userUpdate){
                        res.status(500).send({
                            status:'Error',
                            message:'No se ha actualizado el usuario'
                            });
                    }
                          
                //devolver respuesta
                res.status(200).send({
                    status:"Success",
                    userUpdate
                    });
                });
            }
        },

        uploadPhotoProfile: function(req,res){
            //configurar el modulo mutiparty (subida de fichero)
    
            //recoger el fichero de la peticion
            var photoProfile = 'Avatar no subido...';
            
    
            if(!req.files){
    
                return res.status(404).send({
                    status:'error',
                    message: photoProfile
                    
                });
            }
           // conseguir el nombre y la extension del archivo
           var file_path= req.files.photoProfile.path;
           var file_split = file_path.split('\\');
             
            //nombre del archivo
           var file_name= file_split[2];
           
           //Extension del archivo
           var ext_split = file_name.split('\.');
           var file_ext = ext_split[1];
    
           //comprobar extension(solo imagenes)
            if (file_ext != 'png' && file_ext !='jpg' && file_ext !='jpeg' && 
            file_ext !='gif' && file_ext !='JPG' && file_ext !='JPEG'&& file_ext !='PNG'){
                fs.unlink(file_path, () =>{
                    
                    return res.status(200).send({
                        status:'error',
                        message:'La Extension del Archivo no es valido',
                        file: file_ext
                        });
                });
    
            }else{
           //sacar el id del usuario identificado
                var userId= req.user.sub;
           //buscar y actualizar documentos de la bd
           User.findOneAndUpdate({ _id: userId}, {photoProfile : file_name}, {new:true}, (err, userUpdated)=>{
                
            if(err || !userUpdated){
    
                //devolver respuesta 
                return res.status(500).send({
                    status:'error',
                    message:'Error al guardar el usuario',
                        });
                    }
                return res.status(200).send({
                    status:'succes',
                    user : userUpdated
                    });
                    
                });
          
            }
        },
    
    
        photoProfile :function(req,res){
            var file_name = req.params.file_name;
            var path_file = './uploads/users/'+'fileName';
    
            fs.exists(path_file , (exists)=>{
    
                if (exists) {
                    //envia el archivo resolviendo el path completo de donde esta ubicada el archivo
                    return res.sendFile(path.resolve(path_file));
                }else{
                    return res.status(404).send({
                        message:'la image no existe'
                    });
                }
            });
            
        }
    };
module.exports=controller;