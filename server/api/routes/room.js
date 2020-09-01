//const config = require('./config/config');
const express = require("express");
const router = express.Router();

//const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

//mongoose.connect(config.dbUri, { useNewUrlParser: true })
//mongoose.set('useCreateIndex', true)

//const User = require("../models/users");
const RoomsController = require('../controllers/room');
const checkAuth = require('../middleware/check_auth');

router.post("/createRoom", checkAuth, RoomsController.room_create);

router.post("/roomInfo", checkAuth, RoomsController.room_info);

//router.post("/joinRoom", checkAuth, RoomsController.join_room);

router.post("/leaveRoom", checkAuth, RoomsController.room_leave);

router.post("/roomDelete", checkAuth, RoomsController.room_delete);

module.exports = router;