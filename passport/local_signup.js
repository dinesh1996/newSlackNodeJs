// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Permalinks = require('permalinks');
var md5 = require('md5');
var User = mongoose.model('User');


var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function (passport) {

    passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    }, function (req, username, password, done) {
        findOrCreateUser = function () {
            User.findOne({'username': username}, function (err, user) {
                    if (err) {

                        console.log('Error in sign up' + err);
                        return done(err, false, {message: 'Error in sign up' + err});
                    }
                    if (user) {
                        console.log("User already exists");

                        return done(null, false, {message: 'User already exists'});
                    }
                    else {
                        permalinks = new Permalinks();
                        var nUser = new User();
                        nUser.password = createHash(password);
                        nUser.creationDate = new Date();
                        nUser.isActivated = true;
                        nUser.kicked = 0;
                        nUser.username = req.body.username;
                        nUser.firstName = req.body.firstName;
                        nUser.lastName = req.body.lastName;
                        nUser.email = req.body.email;
                        nUser.superSU = false;
                        nUser.censor = false;
                        nUser.bannedForever = false;

                        const md5User = md5(req.body.username + 'message' + req.body.username);
                        nUser.permalink = permalinks.format(':username', {
                            username: md5User
                        });


                        nUser.save(function (err) {
                            if (err) {
                                console.log("Shit, something went wrong");
                                throw err;
                            }
                            console.log('User created ! Yay !');
                            return done(null, nUser);
                        });
                    }
                }
            );
        }
        process.nextTick(findOrCreateUser);
    }))
    ;

}
