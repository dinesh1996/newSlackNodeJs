var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var ChannelSchema = new Schema({
    creationDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },

    authorizedMember:
        [{type: mongoose.Schema.Types.ObjectId, ref: "User"}
        ],
    BannedMember:
        [{type: mongoose.Schema.Types.ObjectId, ref: "User"}
        ],
    privateChannel: {
        type: Boolean,
        required: true
    }


});

var Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;
