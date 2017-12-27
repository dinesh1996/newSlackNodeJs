var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var config = require('../config/auth');
var Permalinks = require('permalinks');

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callback,
            passReqToCallback: true
        },
        function (req, token, refreshToken, profile, done) {
            loginOrSignUp = function () {
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        req.session.authType = "Google";
                        req.session.user = user;
                        return done(null, user);
                    } else {

                        var nUser = new User();
                        permalinks = new Permalinks();

                        console.log("********Session Info******");
                        console.log(profile);
                        console.log("********The End******");

                        nUser.creationDate = new Date();
                       // nUser.username = req.session.username;
                        nUser.firstName = profile.name.givenName;
                        nUser.lastName = profile.name.familyName;
                        nUser.email = profile.emails[0].value;
                        nUser.google.id = profile.id;
                        nUser.google.token = token;
                        req.session.authType = "Google";
                        req.session.user = nUser;

                        return done(null, nUser);
                    }
                })
            }
            process.nextTick(loginOrSignUp);
        }))
}
