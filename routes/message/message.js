var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var Channel = mongoose.model('Channel');
var User = require('../../models/user');
var md = require('markdown-it')();

router.post('/create/', isAuth, function (req, res) {
    if (req.session.channel) {

        let nMessage = new Message;
        nMessage.creationDate = new Date();
        nMessage.context = md.render(req.body.context);
        User.findById(req.session.passport.user, function (err, user) {
            if (user.censor === true || !user.isActivated) {
                nMessage.censor = true;
            } else {
                nMessage.censor = false;
            }
            nMessage.published = true;
            nMessage.author = req.user;
            nMessage.channel = req.session.channel;
            nMessage.save(function (err) {
                if (err) {
                    throw err;
                }
            });

            Message.create(nMessage, function (err, item) {

                req.app.get('socketio').emit('new-message', nMessage);
                res.redirect('/channel/chat/' + req.session.channel.permalink);
            });
        });
    } else {
        res.redirect('/channel/all');
    }
});


router.post('/delete/:messageID', isAuth, function (req, res) {
    Message.findById(req.params.messageID).populate('author').populate("channel").populate('emotions').exec(function (err, message) {
        if (err) {
            throw err;
        }
        if (message) {
            var isOkToDelete = false;


            User.findById(req.session.passport.user, function (err, user) {
                if (err) {
                    throw err;
                }
                if (user) {
                    Channel.findById(message.channel).populate('adminMembers').exec(function (err, channel) {
                        for (var i = 0; i < channel.adminMembers.length; i++) {
                            if (channel.adminMembers[i].id === user.id) {
                                isOkToDelete = true;
                            }
                        }


                        if (message.author.id === user.id) {
                            isOkToDelete = true;
                        }

                        if (isOkToDelete) {
                            message.published = false;
                        }
                        message.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    });
                }
            });
            res.redirect('/channel/chat/' + message.channel.permalink);

        } else {
            res.redirect('/channel/all');
        }
    });

});

router.post('/censor/:messageID', isAuth, function (req, res) {
    Message.findById(req.params.messageID).populate('author').populate("channel").populate('emotions').exec(function (err, message) {
        if (err) {
            throw err;
        }
        if (message) {
            var isOkToDelete = false;


            User.findById(req.session.passport.user, function (err, user) {
                if (err) {
                    throw err;
                }
                if (user) {
                    Channel.findById(message.channel).populate('adminMembers').exec(function (err, channel) {
                        for (var i = 0; i < channel.adminMembers.length; i++) {
                            if (channel.adminMembers[i].id === user.id) {
                                isOkToDelete = true;
                            }
                        }


                        if (isOkToDelete) {
                            message.censor = true;
                        }
                        message.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    });
                }
            });
            res.redirect('/channel/chat/' + message.channel.permalink);

        } else {
            res.redirect('/channel/all');
        }
    });
});
module.exports = router;





