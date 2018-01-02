// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}


module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        }, function (req, username, password, done) {
            loginUser = function () {
                User.findOne({'username': username}, function (err, user) {
                        if (err)
                            return done(err);
                        if (!user) {
                            console.log("User not found with username " + username);
                            return done(null, false, {message: "User or/and password was/were wrong"});
                        }
                        if (typeof user.password === 'undefined' || !isValidPassword(user, password)) {
                            console.log("Invalid password");
                            return done(null, false, {message: "User or/and password was/were wrong"});

                        }
                        if (user && user.isActivated === true && isValidPassword(user, password)) {

                            return done(null, user);
                        }
                    return done(null, false, {message: "User or/and password was/were wrong"});

                    }
                );
            }
            process.nextTick(loginUser);
        })
    )
    ;

}
