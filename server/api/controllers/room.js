const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const Room = require("../models/room");
const User = require("../models/user");
const path = require('path');

var serverPath = path.dirname(require.main.filename) + "/server";
const server = require(serverPath);

//const cookie = require('cookie');

//mongoose.set('useFindAndModify', false);


Date.prototype.getWeek = function() {
  
var onejan = new Date(this.getFullYear(),0,1);
return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}
var today = new Date();
var week = today.getWeek();
console.log(today);


//let roomMembers = [];

let ownerImage = null;
//create a room
exports.room_create = (req, res, next) => {
  
  console.log("The client passed this thing: " +req.body.username);
  let userName = req.body.username ;
  //console.log(loginName);
  if(userName.includes('@')) {
    console.log("#############Email##############");
    userName = User.find({ email: userName });
  }
  else {
    console.log("#######UserName########");
    userName = User.find({ user_name: userName });
  }
  
  userName
    .exec()
    .then(user => {
      //console.log("The user id is : ##>" +user[0]._id);
      
      if (user.length < 1) {
        //console.log("HERE LIESSSSSSSSSSSSSSSSSS THE ERROR");
        return res.status(409).json({
          message: "User doesn't exists"
        });
      } else {
            const room = new Room({
              //substring(0, req.body.email.lastIndexOf("@")
              room_name: req.body.roomname,
              ownerId: user[0]._id,
              //memberIds: user[0]._id,
              password: req.body.password
            });
            room
              .save()
              .then(result => {
                //var io = server.getIO();
                //console.log("IO is " + io);
                //console.log("The result is: # " +result);
                Room.find({ room_name: req.body.roomname })
                .populate("ownerId", "display_name")
                .exec()
                .then(room => {
                  roomIs = room[0].room_name;
                   //console.log("##CHECK PASSWORD##");
                   //console.log("The roomName is: #" +room[0].room_name);
                   //console.log("The roomName is: #" +room[0].password);
                   //console.log("##CHECK PASSWORD##");
                  let passwdEmpty = false;
                  if(room[0].password === null || room[0].password === undefined) {
                    passwdEmpty = true;
                  }
                  else{
                    passwdEmpty = false;
                  }
                  //roomMembers.push({ username: user[0].user_name, displayName: user[0].displayName });
                  const roomInfo = { roomOwner: room[0].ownerId.display_name, roomName: room[0].room_name, passwdEmpty: passwdEmpty };
                  
                  let io = server.getIO();
                  io.emit("RoomInfo", roomInfo);

                  //io.emit("userInfo", room[0].ownerId);
                  User.findByIdAndUpdate(room[0].ownerId._id, { $set: { isRoomOwner: true }}, { new: true }, function (err, user) {
                    if (err) return err;
                    //console.log(user);
                  });
            
                  res.status(201).json({
                    message: "Room created",
                    userName: user[0].user_name,
                    userImage: "http://localhost:3000/" + user[0].user_image.slice(11),
                    roomname: room[0].room_name
                    //roomOwner: room[0].ownerId.display_name
                  }); 
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
                
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
      }
    });
};


exports.room_info = (req, res, next) => {
  let userName = null;
  //console.log(loginName);
  if(req.body.username.includes('@')) {
    //console.log("#############Email##############");
    userName = User.find({ email: req.body.username });
  }
  else {
    //console.log("#######UserName########");
    userName = User.find({ user_name: req.body.username });
  }

  Room.find({ room_name: req.body.roomname })
    .populate("ownerId", "display_name")
    .exec()
    .then(room => {
      userName
        .exec()
        .then(user => {
          console.log(">>>shini");
          console.log(room);
          console.log("shini<<<");
          console.log("Request body Pass@@");
          console.log(req.body.password);
          console.log("Rooom Name : " +req.body.roomname);
          console.log("Request body Pass@@");
          console.log("mongo saved Pass@@");
          console.log(room[0].password);
          console.log("mongo saved Pass@@");


           
             if(room[0].memberIds.indexOf(user[0]._id) <= -1) {
              if(req.body.password === room[0].password) {
                
                room[0].memberIds.push(user[0]._id);
                room[0].save();
                const roomData = { roomName: room[0].room_name, user: user[0]._id, isRoomOwner: user[0].isRoomOwner };
                let io1 = server.getChatRoomIO();
                io1.emit("roomData", roomData);

             

                return res.status(200).json({
                  userId: user[0]._id,
                  userImage: "http://localhost:3000/" + user[0].user_image.slice(11),
                  userName: user[0].user_name,
                  displayName: user[0].display_name,
                  gender: user[0].user_gender,
                  userAbout: user[0].user_aboutme,
                  email: user[0].email,
                  roomname: room[0].room_name,
                  isRoomOwner: user[0].isRoomOwner,
                  message: "success",
                  passCorrect: true
                  });

                  
                  
              }
             else{
            
               //const roomData = { roomName: room[0].room_name, user: user[0]._id };
            // let io1 = server.getChatRoomIO();
             //io1.emit("roomData", roomData);
             return res.status(401).json({
              userId: user[0]._id,
              userImage: "http://localhost:3000/" + user[0].user_image.slice(11),
              userName: user[0].user_name,
              displayName: user[0].display_name,
              gender: user[0].user_gender,
              userAbout: user[0].user_aboutme,
              email: user[0].email,
              roomname: room[0].room_name,
              isRoomOwner: user[0].isRoomOwner,
              message: "success",
              passCorrect: false
              });
              
             }
           } else {
            
             return res.status(401).json({
               message: "User doesn't exists",
               passCorrect: false
             });
           }
       });          
      })
};



//leave room
exports.room_leave = (req, res, next) => {
  

  User.find({ user_name: req.body.username })
    .exec()
    .then(user => {

      Room.find({ room_name: req.body.roomname})
    .populate("memberIds")
    .exec()
    .then(room => {
      let thisUser = user[0]._id;
     
      if(user[0].isRoomOwner == true) {
        
        Room.updateOne({ room_name: req.body.roomname },
          { "$pull": { "memberIds": thisUser  }}, 
          { safe: true, multi:true }, 
          function(err, obj) {
            User.updateOne({ _id: thisUser}, {
              //chatRoomSocket: "",
              isRoomOwner: false
              }, 
              function(err, affected, resp) {     
            });
      });
      console.log("__________________L__________________________");
      console.log(room[0].memberIds.length);
      console.log("__________________L__________________________");
      
      let io_l = server.getChatRoomIO();
      io_l.emit("userLeft", { roomName: req.body.roomname, user: user[0]._id });
      res.status(200).json({
        message: "Room Left"
      });

      }else {
        console.log("####A USERRRRRRRRRRRRR LEAVING ROMMMMMMMMMMMMMMMM####");
        Room.updateOne({ room_name: req.body.roomname },
          { "$pull": { "memberIds": user[0]._id  }}, 
          { safe: true, multi:true }, 
          function(err, obj) {
            //User.updateOne({ _id: user[0]._id}, {
            //  chatRoomSocket: ""
            //  }, 
            //  function(err, affected, resp) {
            //    
            //});
            //do something smart
            let io_l = server.getChatRoomIO();
            io_l.emit("userLeft", { roomName: req.body.roomname, user: user[0]._id });
            //console.log(obj);
            console.log("user removed from room");
            res.status(200).json({
              message: "Room Left"
            });
      });
      }
    });
});
};





//for room delete
exports.room_delete = (req, res, next) => {
  Room.deleteOne({ _id: req.body.roomId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Room deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Room delete unsuccessful",
        error: err
      });
    });
};