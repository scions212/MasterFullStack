'use strict'

var express = require("express");


var CommentController=require('../controllers/comment');

var router = express.Router();
var md_auth =require('../middleware/authenticated');

var multpart =require('connect-multiparty');
var md_upload = multpart({uploadDir:'./uploads/users'});


//router.get('/getComent/:id?', md_auth.authenticated,TopicController.getTopics); 
router.post('/postRegisterComment/topic/:topicId', md_auth.authenticated, CommentController.postRegisterComment);
router.put('/updateComment/:commentId?',md_auth.authenticated, CommentController.updateComment); 
router.delete('/deleteComment/:topicId/:commentId',md_auth.authenticated, CommentController.deleteComment); 
router.get('/searchComment/:search',md_auth.authenticated, CommentController.searchComment); 


module.exports = router;
