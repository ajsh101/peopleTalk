//const config = require('./config/config');
const mongoose = require('mongoose');
//mongoose.connect(config.dbUri, { useNewUrlParser: true })
//mongoose.set('useCreateIndex', true)

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    user_name: { type: String, required: true, unique: true},
    display_name: { type: String, require: false, default: ""},
    password: { type: String, required: true },
    user_image: { type: String, required: false, default: "userAvatar/profile.png"},
    friendIds: [{ type: String }],
    blockedIds: [ { type: String } ],
    friendList : [{ friendName : String, friendId : String, friendGender: String, friendPic: String, friendOnline: Boolean }],
    user_coins: { type: Number, default: 0 },
    user_aboutme: { type: String, default: "" },
    user_gender: { type: String, default: ""},
    user_isVIP: { type: Boolean, default: false },
    user_isVerified: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    isRoomOwner: { type: Boolean, default: false },
    chatRoomSocket: { type: String, default: "" },
    user_isOnline: { type: Boolean, default: false },
    connected_socket: { type: String, default: ""},
    friend_chat: [ { friendId: String, friendMessages: [] } ]
});

module.exports = mongoose.model('User', userSchema, 'User');