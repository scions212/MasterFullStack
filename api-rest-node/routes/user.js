'use strict'

var express = require("express");


var UserController= require("../controllers/user");

var router = express.Router();
var md_auth =require('../middleware/authenticated');

var multpart =require('connect-multiparty');
var md_upload=multpart({uploadDir:'./uploads/users'});

router.get('/getUsers', UserController.getUsers);
router.get('/getUser/:userId', UserController.getUser);
router.post('/postRegister', UserController.postRegister);
router.post('/postLogin', UserController.postLogin);
router.put('/postUpdate',md_auth.authenticated, UserController.postUpdate);
router.post('/uploadPhotoProfile', [md_upload,md_auth.authenticated], UserController.uploadPhotoProfile);
router.get('/photoProfile/:fileName', UserController.photoProfile);

module.exports = router;
