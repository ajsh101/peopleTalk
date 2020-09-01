//const config = require('./config/config');
const express = require("express");

const router = express.Router();
const multer = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './userAvatar');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "," + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
//const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

//mongoose.connect(config.dbUri, { useNewUrlParser: true })
//mongoose.set('useCreateIndex', true)

//const User = require("../models/users");
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check_auth');

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.post("/userVerification", UserController.user_verification);

router.post("/forgetPaasword", UserController.forget_password);

router.get("/resetPassword/:token", UserController.reset_password);

router.get("/userValid/:token", UserController.user_valid);

router.put("/updatePassword/", UserController.update_password);

router.post("/updateProfile", checkAuth, upload.single("userImage"), UserController.update_profile);

router.post("/sendProfile", checkAuth, UserController.send_profile);

router.post("/userShowProfile", checkAuth, UserController.show_profile);

router.post("/addFriend", checkAuth, UserController.add_friend);

router.post("/reqAccepted", checkAuth, UserController.request_accepted);

router.post("/getFriendInfo", checkAuth, UserController.friend_info);

router.post("/getFriendList", checkAuth, UserController.friend_list);

router.post("/updateFriendList", checkAuth, UserController.update_friend_list);

router.post("/deleteFriend", checkAuth, UserController.delete_friend);

router.post("/userLogout", checkAuth, UserController.user_logout);

router.put("/resetPasswd", checkAuth, UserController.reset_passwd);

router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;