var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.get('/profile/:permalink', isAuth, function (req, res) {
    User.findOne({permalink: req.params.permalink}, function (err, items) {
        console.log(items);
        if (err) {
            res.redirect('/')

        } else {
            res.render('member/profile', {profileProperties: items});
        }
    });
});

router.get('/all', isAuth, function (req, res) {
    User.find({}, function (err, items) {
        console.log(items);
        if (err) {
            res.redirect('/')

        } else {
            res.render('member/membersList', {members: items});
        }
    });
});

module.exports = router;





