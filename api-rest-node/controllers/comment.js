'use strict'

var Topic = require('../models/topic');
var validator =require('validator');
var bcrypt = require('bcryptjs');
var fs =require('fs');
var path=require('path');
const saltRounds = 10;
var jwt = require('../services/jwt');
const { exists } = require('../models/user');
const topic = require('../models/topic');
var controller={

    postRegisterComment :function(req,res){

        //recoger el id del topic de la url
        var topicId=req.params.topicId;

        //find por id del topic
        Topic.findById(topicId).exec((err,topic)=>{
            if(err){
                return res.status(500).send({
                    status:'Error',
                    message:'Error en la peticion'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status:'Error',
                    message:'No existe el tema'
                });
            }        
            //comprobar objeto usuario y validar datos
            if(req.body.content){
                try{
                    var validate_content = !validator.isEmpty(req.body.content);                 
                }catch(err){
                    return res.status(500).send({
                        status:'Error',
                        messange:'No has comentado nada!!'
                    });
                }            
                if(validate_content){

                    var comment={
                        user: req.user.sub,
                        content:req.body.content
                    };
                //En la propiedad comment del objeto resultante hacer un push
                    topic.comments.push(comment);
                //guardar el topic completo
                    topic.save((err)=>{
                //revolver respuesta
                if(err){
                    return res.status(500).send({
                        status:'Error',
                        message:'Error al guardar el topic'
                    });
                }
                return res.status(200).send({
                    status:'Success',
                    topic
                    });
                });
                    }else{
                        return res.status(500).send({
                            status:'Error',
                            messange:'No has comentado nada!!'
                        });                   
                    }
                }
        });
      
    },

    updateComment :function(req,res){

        //conseguir el id que llega por la url
        var commentId = req.params.commentId;

        //recoger datos y validar
        var params = req.body;
        
        //validar datos
            try{
                var validate_content = !validator.isEmpty(params.content);                 
            }catch(err){
                return res.status(404).send({
                    status:'Error',
                    messange:'No has comentado nada!!'
                });
            } 

            if(validate_content){

            //find and update de subdocumento
                Topic.findOneAndUpdate(
                    {"comments._id" :commentId},
                    {
                        "$set":{
                            "comments.$.content": params.content
                        }
                    },
                    {new:true},
                    (err,topicUpdated)=>{
                        if(err){
                            return res.status(500).send({
                                status:'Error',
                                message:'No se pudo actualizar el comentario'
                            });
                        }
                        if(!topicUpdated){
                            return res.status(404).send({
                                status:'Error',
                                message:'No se encontro el topic actualizar'
                            });
                        }
                //devolver Datos
                return res.status(200).send({
                    status:'Success',
                    topic:  topicUpdated
                    });
            });
        }       
    },

    deleteComment :function(req,res){

        //sacar el id del topic y del comentario a borrar
        var topicId = req.params.topicId;
        var commentId=req.params.commentId;
        //buscar topic
        Topic.findById(topicId, (err,topic)=> {

            if(err){
                return res.status(500).send({
                    status:'Error',
                    message:'No se pudo actualizar el comentario'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status:'Error',
                    message:'No se encontro el topic actualizar'
                });
            }
        //seleccionar el subdocumento (comentario)
            var comment = topic.comments.id(commentId);
            console.log(commentId);
        //borrar comentario
            if(comment){
                comment.remove();
        //guardar el topic
            topic.save((err)=>{
                if(err){
                        return res.status(500).send({
                            status:'Error',
                            message:'No se pudo actualizar el comentario'
                        }); 
                    }
                    //devolver el resultado
                        return res.status(200).send({
                            status:'Success',
                           topic
                        });
                    });
            }else{
                return res.status(404).send({
                    status:'Error',
                    message:'No Existe comentario actualizar'
                });
            }
        });
    },

    searchComment: function (req,res){

        //sacar el string a buscar la ur
        var searchString = req.params.search;

        //find or
        Topic.find({"$or": [
                { "title" : { "$regex": searchString, "$options" : "i" } },
                { "content" : { "$regex": searchString, "$options" : "i" } },
                { "lang" : { "$regex": searchString, "$options" : "i" } },
                { "code" : { "$regex": searchString, "$options" : "i" } },
        ]})
        .exec((err,topic) => {
            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message:"error en la peticion" 
                });
            }

            if(!topic){
                return res.status(404).send({
                    status: 'Error',
                    message:"No se ha encontrado conincidencias" 
                });
            }
      
        //devolver resultado
        return res.status(200).send({
            status: 'Success',
            topics:topic
            });
        });
    }
};

module.exports=controller;