'use strict'

var Topic = require('../models/topic');
var validator =require('validator');
var bcrypt = require('bcryptjs');
var fs =require('fs');
var path=require('path');
const saltRounds = 10;
var jwt = require('../services/jwt');
const { exists } = require('../models/user');

var controller ={

    
 registerTopic : function(req, res){
    //recoger parametros por post
   var params = req.body;

    //Validar datos
    try{
        var validate_title = !validator.isEmpty(params.title);
        var validate_content = !validator.isEmpty(params.content);
        var validate_lang = !validator.isEmpty(params.lang);
        
     
    }catch(err){
        return res.status(200).send({
            messange:'Faltan datos por enviar'
        });
    }

    if(validate_title && validate_content && validate_lang){

    //crear objeto a guardar//
        var topic = new Topic(); 

    //Asignar valores
        topic.title = params.title;
        topic.content = params.content;
        topic.code = params.code;
        topic.lang = params.lang;
        topic.user = req.user.sub;

    //guardar el topic
        topic.save((err,topicStored)=>{

          if(err || !topicStored){
            return res.status(404).send({
                Status:'Error',
                message:'No se pudo Guardar el topic'
            });
          }  
           //devolver respuesta 
            return res.status(200).send({
                Status:'Success',
                topic : topicStored
                });      
            });
    }else{
            return res.status(200).send({
                message:'faltan datos por enviar'
            });

        }
    },

    getTopicsByPage: function(req,res){

        //recoger la pagina actual
            if(!req.params.page || req.params.page == 0 || req.params.page == "0" || req.params.page == null || req.params.page == undefined) {
                 var page = 1;
            }else{
                var page = parseInt(req.params.page);
            }
        //indicar las opciones de apginacion
            var options ={
                sort:{ date: -1} ,
                populate: 'user',
                limit:5,
                page:page
            };

        //find paginados
            Topic.paginate({}, options, (err,topics) =>{

                if(err){
                    return res.status(500).send({
                        'status': 'Error',
                        message:"error al realizar la consulta"
                    });
                }
                if(!topics){
                    return res.status(404).send({
                        'status': 'Error',
                        message:"no hay topics"
                    });
                }

        //devolver resultado (topics, total de topic, total de paginas)
            return res.status(200).send({
                status: 'Success',
                topics:topics.docs,
                totalDocs: topics.totalDocs,
                totalPages:topics.totalPages
            });
        });
    
     },

    getTopicByUser: function(req,res){

        //conseguir el id del usuario;
            var userId =req.params.user;

        //find con una condicion de un usuario
        Topic.find({
            user:userId
        })
            .sort([['date', 'descending']])
            .exec((err,topic)=>{
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message:"Error en la peticion"
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'Error',
                    message:"no hay temas par amostrar"
                });
            }
          //devolver resultado
            return res.status(200).send({
                status: 'Sucess',
                topics : topic
                });
            });
        },

        getTopics:function(req,res){

            //sacar el ID del topic de la URL 
            var topicId = req.params.id;
            
            //find por el id del topic
            Topic.findById(topicId)
                    .populate('user')
                    .exec((err,topic)=>{

                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message:"No se puede obtener el topics" 
                        });
                    }
                if(!topic){
                    return res.status(500).send({
                        status: 'Error',
                        message:"No se puede obtener el topics" 
                        });
                    }
           
            //devolvver resultado
            return res.status(200).send({
                status: 'Success',
                message:"Soy el metodo topics",
                topic:topic
                });
            });
        },

        updateTopics :function(req,res){

            //obtener el id del topics a modificar
            var topicId = req.params.id;

            //recoger los datos que llegan desde post
            var params = req.body;

            //Validar datos
            try{
                var validate_title = !validator.isEmpty(params.title);
                var validate_content = !validator.isEmpty(params.content);
                var validate_lang = !validator.isEmpty(params.lang);
                
            }catch(err){
                return res.status(200).send({
                    messange:'Faltan datos por enviar'
                });
            }

            if(validate_title && validate_content && validate_lang){

         //montar un json con los datos modificables
            var update = {
                title: params.title,
                content: params.content,
                lang: params.lang,
                code: params.code,
            }

            //find and update del topic por id y y por id de usuario
            Topic.findOneAndUpdate({_id:topicId, user :req.user.sub},update,{new:true},(err,topicUpdated)=>{

            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message:"No se pudo modificar el Topics" 
                });
            }


            if(!topicUpdated){
                return res.status(404).send({
                    status: 'Error',
                    message:"No se encontro el Topics para modificar" 
                });
            }
                //devolver los datos
            return res.status(200).send({
                status: 'Success',
                topic:topicUpdated
                }); 
            });
            }else{
                return res.status(500).send({
                    status: 'Error',
                    message:"la validacion de los datos no son correctos" 
                    });
            }
        },

        deleteTopic:function(req,res){

            //obtener el id del topics a modificar
            var topicId = req.params.id;
            
            //metodo eliminar
            Topic.findOneAndDelete({_id:topicId, user:req.user.sub},(err, topicDelete)=>{
                if(err){
                    return res.status(500).send({
                        status: 'Error',
                        message:"No se pudo Borrar el topics" 
                    });

                }
                if(!topicDelete){
                    return res.status(404).send({
                        status: 'Error',
                        message:"No se encontro el topics a borrar" 
                    });

                }
                 //Devolver respuesta
                    return res.status(200).send({
                        status: 'Success',
                        topic:topicDelete
                    });
            });
           
        },

     
    };

 
module.exports=controller;