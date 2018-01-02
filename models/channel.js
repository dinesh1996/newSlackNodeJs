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

    authorizedMembers:
        [{type: mongoose.Schema.Types.ObjectId, ref: "User"}
        ],

    adminMembers:
        [{type: mongoose.Schema.Types.ObjectId, ref: "User"}
        ],
    bannedMember:
        [{type: mongoose.Schema.Types.ObjectId, ref: "User"}
        ],
    privateChannel: {
        type: Boolean,
        required: true
    },
    permalink: {
        type: String,
        required: true
    },


});

var Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;
