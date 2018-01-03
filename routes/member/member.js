var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Channel = mongoose.model('Channel');
var Emotion = mongoose.model('Emotion');
var Message = mongoose.model('Message');

router.get('/profile/:permalink', isAuth, function (req, res) {
    User.findOne({permalink: req.params.permalink}, function (err, items) {

        if (err) {
            res.redirect('/')

        } else {
            res.render('member/profile', {profileProperties: items});
        }
    });
});

router.get('/all', isAuth, function (req, res) {
    User.find({}, function (err, items) {

        if (err) {
            res.redirect('/')

        } else {
            res.render('member/membersList', {members: items});
        }
    });
});

router.get('/super-admin/remover/channel', isAuth, function (req, res) {
    Channel.find().sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channels) {
        if (err) {
            throw err;
        }
        if (channels) {
            User.findById(req.session.passport.user, function (err, user) {
                if (err) {
                    throw err;
                }
                if (user && user.superSU === true) {

                    res.render('channel/admin/remover-channel', {channels: channels});

                } else {


                    res.redirect('/channel/info/' + channel.permalink);
                }

            });
        }
    });

});

router.post('/super-admin/remover/channel', isAuth, function (req, res) {



    Channel.findById(req.body.todelete).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }


        if (channel) {
            Message.find({'channel': channel}).populate('author').populate('emotions').populate('channel').exec(function (err, messages) {

                for (var i = 0; i < messages.length; i++) {
                    messages[i].remove();
                }
                Emotion.find({'channel': channel}).populate('channel').populate('author').exec(function (err, emotions) {
                    for (var y = 0; y < messages.length; y++) {
                        emotions[y].remove();
                    }
                    channel.remove();
                    res.redirect('/channel/all');
                });
            });
        } else {

            res.redirect('/channel/all');
        }
    });

});

module.exports = router;





