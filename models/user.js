var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:{ 
        type:String,
        required:true 
    },
    firstName: {
        type: String,
    },
    lastName:String,
    password: String,
    email: String,

    urlImg:String,

    userType:String,
    bannedForever : Boolean,

    facebook : {
        id : String,
        token : String,
    },
    twitter : {
        id : String,
        token : String,
    },

    google : {
        id : String,
        token : String,
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;