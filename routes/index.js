var express = require('express');
var router = express.Router();
var isAuth = require('../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var Message = mongoose.model('Message');


router.get('/', function (req, res) {
    res.render('index');

});
module.exports = router;
