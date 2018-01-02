var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var Emotion = mongoose.model('Emotion');

router.post('/create/', isAuth, function (req, res) {
    let nEmotion = new Emotion;
    nEmotion.creationDate = new Date();
    nEmotion.context = req.body.context;
    nEmotion.censor = false;
    nEmotion.published = true;
    nEmotion.author = req.user;
    nEmotion.channel = req.session.channel;
    nEmotion.save(function (err) {
        if (err) {
            console.log("****Merde****");
            throw err;
        }
        Emotion.create(nEmotion, function (err, item) {

            req.app.get('socketio').emit('new-message', nMessage);
            res.redirect('/channel/chat/' + req.session.channel.permalink);
        });
    });
});


module.exports = router;





