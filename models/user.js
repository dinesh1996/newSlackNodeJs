var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    creationDate: {
        type: Date,
        required: true
    },

    isActivated: {
        type: Boolean,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    urlImg: String,

    superSU: {
        type: Boolean,
        required: true
    },
    censor: {
        type: Boolean,
        required: true
    },
    bannedForever: {
        type: Boolean,
        required: true
    },
    permalink: {
        type: String,
        required: true
    },
    facebook: {
        id: String,
        token: String
    },
    twitter: {
        id: String,
        token: String
    },
    google: {
        id: String,
        token: String
    },
    git: {
        id: String,
        token: String
    }

});

var User = mongoose.model('User', UserSchema);

module.exports = User;
