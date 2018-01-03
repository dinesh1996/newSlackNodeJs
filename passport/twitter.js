var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var config = require('../config/auth');
var Permalinks = require('permalinks');

module.exports = function (passport) {
    passport.use('twitter', new TwitterStrategy({
            consumerKey: config.twitter.consumerKey,
            consumerSecret: config.twitter.consumerSecret,
            callbackURL: config.twitter.callback,
            passReqToCallback: true,
            includeEmail: true

        },
        function (req, token, refreshToken, profile, done) {
            loginOrSignUp = function () {
                User.findOne({'twitter.id': profile.id}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        if (user.isActivated) {
                            req.session.user = user;
                            return done(null, user, {message: 'User already exist'});
                        } else {
                            return done(err, false, {message: 'User was delete for good reasons'});
                        }
                    } else {

                        var nUser = new User();
                        permalinks = new Permalinks();

                        nUser.creationDate = new Date();
                        nUser.username = profile.username;
                        let name = profile.displayName.split(" ");
                        nUser.firstName = name[0];
                        nUser.lastName = name[1];
                        nUser.email = profile._json.email;
                        nUser.twitter.id = profile.id;
                        nUser.twitter.token = token;
                        req.session.authType = "Twitter";
                        req.session.user = nUser;

                        return done(null, nUser);
                    }
                })
            }
            process.nextTick(loginOrSignUp);
        }))
}
