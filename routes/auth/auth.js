var express = require('express');
var router = express.Router();
var passport = require('passport');
var Permalinks = require('permalinks');
var User = require('../../models/user');
var validator = require('validator');
var md5 = require('md5');
require('../../passport/local_login')(passport);
require('../../passport/local_signup')(passport);
require('../../passport/facebook')(passport);
require('../../passport/twitter')(passport);
require('../../passport/google')(passport);

router.get('/login', function (req, res) {
    res.render('auth/login', {message: req.flash('error')});
});

// FaceBook Auth
// Authrouter.get('/username/facebook', function (req, res) {
//     res.render('auth/username');
// });

//Facebook
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/auth/username/facebook',
    failureRedirect: '/auth/login'
}));

router.get('/username/facebook', function (req, res) {

    console.log('**************');
    console.log(req.session);
    console.log('**************');

    if (Object.keys(req.session.passport).length === 0) {
        res.render('auth/username/faceBook', {message: req.flash('error')});
    } else {
        User.findById(req.session.passport.user, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                console.log('ok facebook');
                res.redirect("/member/profile/" + req.session.user.permalink);
            }
        });
    }
});

router.post('/username/facebook', function (req, res) {
    const permalinks = new Permalinks();
    let nUser = new User();
    User.findOne({'username': req.body.username}, function (err, user) {
        console.log("********2******");
        if (err) {
            console.log('error---');
            throw err;
        }
        if (user) {
            res.redirect('/auth/facebook');
        } else {
            console.log("********3******");
            nUser.creationDate = new Date();
            nUser.username = req.body.username;
            nUser.firstName = req.session.user.firstName;
            nUser.lastName = req.session.user.lastName;
            nUser.email = req.session.user.email;
            nUser.superSU = false;
            nUser.censor = false;
            nUser.bannedForever = false;
            if (validator.equals(req.session.authType, 'FaceBook')) {
                nUser.facebook.id = req.session.user.facebook.id;
                nUser.facebook.token = req.session.user.facebook.token;
            }
            console.log("********4******");
            const md5User = md5(req.body.username + 'message' + req.body.username);
            nUser.permalink = permalinks.format(':username', {
                username: md5User
            });

            nUser.save(function (err) {
                if (err) {
                    console.log("****Merde****");
                    throw err;
                }
                console.log("****Good****");
                console.log("********6******");
            });
            if (validator.equals(req.session.authType, "FaceBook")) {
                console.log("********creation3******");
                res.redirect("/auth/facebook");
            }
        }
    });

});

//Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/auth/username/google',
    failureRedirect: '/auth/login'
}));

router.get('/username/google', function (req, res) {

    if (Object.keys(req.session.passport).length === 0) {
        res.render('auth/username/google', {message: req.flash('error')});
    } else {
        User.findById(req.session.passport.user, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                console.log('ok google');
                res.redirect("/member/profile/" + req.session.user.permalink);
            }
        });

    }
});

router.post('/username/google', function (req, res) {
    const permalinks = new Permalinks();
    let nUser = new User();
    User.findOne({'username': req.body.username}, function (err, user) {
        console.log("********2******");
        if (err) {
            console.log('error---');
            throw err;
        }
        if (user) {
            res.redirect('/auth/google');
        } else {
            console.log("********3******");
            nUser.creationDate = new Date();
            nUser.username = req.body.username;
            nUser.firstName = req.session.user.firstName;
            nUser.lastName = req.session.user.lastName;
            nUser.email = req.session.user.email;
            nUser.superSU = false;
            nUser.censor = false;
            nUser.bannedForever = false;
            if (validator.equals(req.session.authType, 'Google')) {
                nUser.google.id = req.session.user.google.id;
                nUser.google.token = req.session.user.google.token;
            }
            console.log("********4******");
            const md5User = md5(req.body.username + 'message' + req.body.username);
            nUser.permalink = permalinks.format(':username', {
                username: md5User
            });

            nUser.save(function (err) {
                if (err) {
                    console.log("****Merde****");
                    throw err;
                }
                console.log("****Good****");
                console.log("********6******");
            });
            if (validator.equals(req.session.authType, "Google")) {
                console.log("********creation3******");
                res.redirect("/auth/google");
            }
        }
    });

});


//Twitter
router.get('/twitter', passport.authenticate('twitter', {
    scope: ['public_profile']
}));

router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/auth/username/twitter',
    failureRedirect: '/auth/login'
}));

router.get('/username/twitter', function (req, res) {

    if (Object.keys(req.session.passport).length === 0) {
        res.render('auth/username/twitter', {user: req.session.user, message: req.flash('error')});
    } else {
        User.findById(req.session.passport.user, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                console.log('ok twitter');
                res.redirect("/member/profile/" + req.session.user.permalink);
            }
        });

    }
});

router.post('/username/twitter', function (req, res) {
    const permalinks = new Permalinks();
    let nUser = new User();
    User.findOne({'username': req.body.username}, function (err, user) {
        console.log("********2******");
        if (err) {
            console.log('error---');
            throw err;
        }
        if (user) {
            res.redirect('/auth/twitter');
        } else {
            console.log("********3******");
            nUser.creationDate = new Date();
            nUser.username = req.body.username;
            nUser.firstName = req.session.user.firstName;
            nUser.lastName = req.session.user.lastName;
            nUser.email = req.session.user.email;
            nUser.superSU = false;
            nUser.censor = false;
            nUser.bannedForever = false;
            if (validator.equals(req.session.authType, 'Twitter')) {
                nUser.twitter.id = req.session.user.twitter.id;
                nUser.twitter.token = req.session.user.twitter.token;
            }
            console.log("********4******");
            const md5User = md5(req.body.username + 'message' + req.body.username);
            nUser.permalink = permalinks.format(':username', {
                username: md5User
            });

            nUser.save(function (err) {
                if (err) {
                    console.log("****Merde****");
                    throw err;
                }
                console.log("****Good****");
                console.log("********6******");
            });
            if (validator.equals(req.session.authType, "Twitter")) {
                console.log("********creation3******");
                res.redirect("/auth/twitter");
            }
        }
    });

});


//Local Strategy
router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/signup', function (req, res) {

    res.render('auth/signup', {message: req.flash('error')});
});

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/auth/signup',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
