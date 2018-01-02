var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var Emotion = mongoose.model('Emotion');
var Message = mongoose.model('Message');
var User = mongoose.model('User');

router.post('/create/:messageID', isAuth, function (req, res) {

    User.findById(req.session.passport.user, function (err, user) {
        if (user) {
            Message.findById(req.params.messageID).populate('channel').exec(function (err, message) {
                if (message) {

                    let nEmotion = new Emotion;
                    nEmotion.creationDate = new Date();
                    nEmotion.context = req.body.emo;
                    nEmotion.censor = false;
                    nEmotion.published = true;
                    nEmotion.author = user;
                    nEmotion.channel = message.channel;

                    message.emotions.push(nEmotion);
                    message.save(function (err) {
                        if (err) {
                            console.log("****Merde****");
                            throw err;
                        }
                    });
                    nEmotion.save(function (err) {
                        if (err) {
                            console.log("****Merde****");
                            throw err;
                        }
                        Emotion.create(nEmotion, function (err, item) {
                            req.app.get('socketio').emit('new-emotion', nEmotion);
                            res.redirect('/channel/chat/' + req.session.channel.permalink);
                        });
                    });
                } else {
                    res.redirect('/channel/chat/' + req.session.channel.permalink);
                }

            });


        } else {
            res.redirect('/channel/chat/' + req.session.channel.permalink);
        }

    });
});


module.exports = router;





