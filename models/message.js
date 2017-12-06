var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var MessageSchema = new Schema({
    content : String,
    date : Date,
    user : { type : mongoose.Schema.Types.ObjectId, ref : "User"}
});

var User = mongoose.model('Message', MessageSchema);

module.exports = User;