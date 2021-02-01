'use strict'

var express = require("express");


var TopicController= require("../controllers/topic");

var router = express.Router();
var md_auth =require('../middleware/authenticated');

var multpart =require('connect-multiparty');
var md_upload = multpart({uploadDir:'./uploads/users'});


router.get('/getTopicsPage/:page?',TopicController.getTopicsByPage); 
router.get('/getTopicUser/:user', md_auth.authenticated,TopicController.getTopicByUser);
router.post('/postRegisterTopic', md_auth.authenticated, TopicController.registerTopic);
router.get('/getTopic/:id?', md_auth.authenticated,TopicController.getTopics); 
router.put('/updateTopic/:id?',md_auth.authenticated, TopicController.updateTopics); 
router.delete('/deleteTopic/:id?',md_auth.authenticated, TopicController.deleteTopic); 



module.exports = router;
