// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');



var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
   }

module.exports = function(passport) {

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, function(req,username, password, done){
    findOrCreateUser = function() {
        User.findOne({ 'username' : username}, function(err, user){
            if(err) {
                console.log('Error in sign up' + err);
                return done(err);
            }
            if(user) {
                console.log("User already exists");
                return done(null, false);
            } else {
                var nUser = new User();

                nUser.username = username;
                nUser.password = createHash(password);
                nUser.email = req.params.email;
                
                nUser.save(function(err){
                    if(err) {
                        console.log("Shit, something went wrong");
                        throw err;
                    }
                    console.log('User created ! Yay !');
                    return done(null, nUser);
                });
            }
        });
    }
    process.nextTick(findOrCreateUser);
}));

}
