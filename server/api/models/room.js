//const config = require('./config/config');
const mongoose = require('mongoose');
//mongoose.connect(config.dbUri, { useNewUrlParser: true })
//mongoose.set('useCreateIndex', true)

const roomSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    room_name: { type: String, required: true, unique: true},
    password: { type: String, default: null},
    //room_image: { type: String, required: false, default: "us"},
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', roomSchema, 'Room');