var FacebookStrategy = require('passport-facebook').Strategy;
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
                console.log(profile);
                console.log("la vie est belle 2");
                console.log(req.session);
                User.findOne({'facebook.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        var nUser = new User();

                        nUser.facebook.id = profile.id;
                        nUser.facebook.token = token;
                        nUser.email = profile.emails[0].value;
                        nUser.username = req.session.username;

                        nUser.save(function (err) {
                            if (err)
                                throw err;

                            return done(null, nUser);
                        })
                    }
                })
            }
            process.nextTick(loginOrSignUp);
        }))
}
