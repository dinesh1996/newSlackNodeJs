var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var config = require('../config/auth');

module.exports =  function(passport) {
    passport.use('twitter', new TwitterStrategy({
        consumerKey : config.twitter.consumerKey,
        consumerSecret : config.twitter.consumerSecret,
        callbackURL : config.twitter.callback,
    },
    function(token, refreshToken, profile, done) {
        loginOrSignUp = function() {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user){
                if(err)
                    return done(err);
                
                    if(user) {
                        return done(null, user);
                    } else {
                        var nUser = new User();

                        console.log(profile);
                        nUser.twitter.id = profile.id;
                        nUser.twitter.token = token;
                        nUser.username = profile.username;

                        nUser.save(function(err) {
                            if(err)
                                throw err;

                            return done(null, nUser);
                        })
                    }
            })
        }
        process.nextTick(loginOrSignUp);
    }))
}