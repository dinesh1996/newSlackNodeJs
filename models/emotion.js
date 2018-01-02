var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');


var EmotionSchema = new Schema({
    creationDate: {
        type: Date,
        required: true
    },
    context: {
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

    message:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"},

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

var Emotion = mongoose.model('Emotion', EmotionSchema);

module.exports = Emotion;

