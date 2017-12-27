var FacebookStrategy = require('passport-facebook').Strategy;
var Permalinks = require('permalinks');
var User = require('../models/user');
var config = require('../config/auth');

module.exports = function (passport) {
    passport.use('facebook', new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callback,
            passReqToCallback: true,
            profileFields: ['id', 'emails', 'name']
        },
        function (req, token, refreshToken, profile, done) {
            loginOrSignUp = function () {
                User.findOne({'facebook.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err, false, {message: 'Error in sign up' + err});

                    if (user) {
                        req.session.authType = "FaceBook";
                        req.session.user = user;
                        return done(null, user, {message: 'User already exist'});
                    } else {
                        console.log('*********************');
                        console.log(profile);
                        console.log('*********************');

                        var nUser = new User();
                        permalinks = new Permalinks();

                        nUser.creationDate = new Date();
                        nUser.username = req.session.username;
                        nUser.firstName = profile.name.givenName;
                        nUser.lastName = profile.name.familyName;
                        nUser.email = profile.emails[0].value;
                        nUser.facebook.id = profile.id;
                        nUser.facebook.token = token;
                        req.session.authType = "FaceBook";
                        req.session.user = nUser;
                        return done(null, nUser);


                    }
                })
            }
            process.nextTick(loginOrSignUp);
        }))
}
