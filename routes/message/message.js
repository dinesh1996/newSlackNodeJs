var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var md = require('markdown-it')();

router.post('/create/', isAuth, function (req, res) {
    if (req.session.channel) {


        let nMessage = new Message;
        nMessage.creationDate = new Date();
        nMessage.context = md.render(req.body.context);
        nMessage.censor = false;
        nMessage.published = true;
        nMessage.author = req.user;
        nMessage.channel = req.session.channel;
        nMessage.save(function (err) {
            if (err) {
                console.log("****Merde****");
                throw err;
            }
            Message.create(nMessage, function (err, item) {

                req.app.get('socketio').emit('new-message', nMessage);
                res.redirect('/channel/chat/' + req.session.channel.permalink);
            });
        });
    }else{
        res.redirect('/channel/all');
    }
});


module.exports = router;





