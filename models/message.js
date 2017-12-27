var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');
var Emotion = mongoose.model('Emotion');

var MessageSchema = new Schema({
    creationDate: {
        type: Date,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    censor: {
        type: Boolean,
        required: true
    },

    published: {
        type: Boolean,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"},


    emotions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Emotion"
    }]

});

var Message = mongoose.model('Message', MessageSchema);

module.exports = Message;


