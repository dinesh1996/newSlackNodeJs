var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../../models/user');
require('../../passport/local_login')(passport);
require('../../passport/local_signup')(passport);
require('../../passport/facebook')(passport);
require('../../passport/twitter')(passport);
require('../../passport/google')(passport);

router.get('/login', function (req, res) {
    res.render('auth/login');
});
// FaceBook Auth
router.get('/username/facebook', function (req, res) {
    res.render('auth/username');
});


router.post('/username/facebook', function (req, res, next) {
    console.log(req.body.username);
    User.findOne({'username': req.body.username}, function (err, user) {
        if (err) {
            console.log('Error in sign up' + err);
            res.redirect('/');
        }
        if (user) {
            console.log("User already exists");
            res.redirect('/');
        } else {
            req.session.username = req.body.username;
            console.log(req.session.username);
            next();


        }

    });
}, passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));


router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));

router.get('/twitter', passport.authenticate('twitter', {
    scope: ['public_profile', 'email']
}));

router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));


router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));

router.get('/signup', function (req, res) {
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/auth/signup'
}));


module.exports = router;
