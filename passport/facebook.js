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
                        permalinks = new Permalinks();

                        nUser.creationDate = new Date();
                        nUser.username = req.session.username;
                        nUser.firstName = profile.name.givenName;
                        nUser.lastName = profile.name.familyName;
                        nUser.email = profile.emails[0].value;
                        nUser.superSU = false;
                        nUser.censor = false;
                        nUser.bannedForever = false;
                        nUser.permalink = permalinks.format(':familyName-:firstName', {familyName:profile.name.familyName,firstName:profile.name.givenName,},);
                        nUser.facebook.id = profile.id;
                        nUser.facebook.token = token;
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
