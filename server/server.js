const http = require("http");
const app = require("./app");
const socketIO = require("socket.io");
const port = process.env.PORT || 3000;
//var os = require( 'os' );



const server = http.createServer(app);
//var networkInterfaces = os.networkInterfaces( );

//console.log( networkInterfaces );
const io = socketIO.listen(server);
server.listen(port);

const lodash = require("lodash");
const _ = require("underscore");

const path = require('path');
//console.log(path.dirname(require.main.filename));
const modelPath = path.dirname(require.main.filename) + "/api/models/user";
const modelPathRoom = path.dirname(require.main.filename) + "/api/models/room";

const User = require(modelPath);
const Room = require(modelPathRoom);
let userSocketId = null;



let userRooms = [];
let userRoomsWithPass = [];
let socketsArr = [];
let socketArrClients = [];
let cleanSocket = [];


let socketCounter = 0;
io.on('connection', (socket) => {
  socketsArr.push(socket.id);
  socketCounter++;

  console.log();
  console.log("#THE NEW SOCKET CONNECTED#");
  console.log();
  console.log("connected client is :" + socket.id);
  console.log("total clients connected : " + socketCounter);
  console.log();
  console.log("#THE NEW SOCKET CONNECTED#");
  console.log("##############################################");
  console.log();

  socket.on("userSocket", (userSocket) => {
    userSocketId = userSocket.socketId;
    User.find({
        _id: userSocket.userId
      })
      .exec()
      .then(user => {
        if (user.length < 1) {
          socket.disconnect(true);
          console.log();
          console.log("#1.THE SOCKET DID NOT EXIST FOR DISCONNECTION#");

          console.log();

        } else {
          User.findByIdAndUpdate(user[0]._id, {
            $set: {
              connected_socket: userSocketId
            }
          }, {
            new: true
          }, function (err, user) {
            if (err) return err;
            console.log(">>the connected user socket is: " + user.connected_socket);
          });
        }
      });
  });


  socket.on("cleanUp", (socketId) => {
    io.of('/').clients((error, clients) => {
      if (error) throw error;
      for (let i in clients) {
        for (let j in socketsArr) {
          if (clients[i] === socketsArr[j]) {
            console.log();
            console.log("The socket id passed from client: " + socketId);
            console.log("The socket id: " + socket.id);
            console.log("The socket id in clients: " + clients[i]);
            console.log("The socket id in socketArr: " + socketsArr[j]);
            User.find({
                connected_socket: socketsArr[j]
              })
              .exec()
              .then(user => {
                if (user.length < 1) {
                  io.sockets.connected[socketsArr[j]].disconnect();
                  console.log("Absent: " + socketsArr[j]);
                  console.log(socketCounter);
                } else {
                  console.log("PRESENT: " + socketsArr[j]);
                  console.log(socketCounter);
                }
              });
          }
        }
      }
    });
  });

  socket.on("alreadyRoom", (rooms) => {
    userRooms.push(rooms);
    userRooms = _.uniq(userRooms);
    //console.log(userRooms.length);
  });

  socket.on("alreadyRoomWithPass", (rooms) => {
    userRoomsWithPass.push(rooms);
    userRoomsWithPass = _.uniq(userRoomsWithPass);
  });

  //io.of('/roomCreated').emit("updateRoom", userRooms);
  //io.of('/roomCreated').emit("updateRoomWithPass", userRoomsWithPass);

  socket.emit("updateRoom", userRooms);
  socket.emit("updateRoomWithPass", userRoomsWithPass);



  socket.on(
    "disconnect",
    () => {
      socketCounter--;

      console.log();
      console.log("#THE SOCKET DISCONNECTED#");
      console.log("disconnected client is :" + socket.id);
      console.log("total clients connected : " + socketCounter);
      console.log("#THE SOCKET DISCONNECTED#");
      console.log("##############################################");
      console.log();

      User.find({
          connected_socket: socket.id
        })
        .exec()
        .then(user => {
          if (user.length < 1) {
            socket.disconnect(true);
            console.log();
            console.log("#2.THE SOCKET DID NOT EXIST FOR DISCONNECTION#");

            console.log();
          } else {
            if (user[0].connected_socket != "") {
              User.findByIdAndUpdate(user[0]._id, {
                $set: {
                  connected_socket: "",
                  user_isOnline: false
                }
              }, {
                new: true
              }, function (err, user) {
                if (err) return err;
                //console.log(user);
              });
            }
          }
        });

      socket.disconnect(true);
    }
  );

});

let i = 0;
let chatRoomSocketArr = [];
let roomOwner = null;
let roomOwned = null;
let connMembers = [];
const chatRoom = io.of('/chatRoom');
chatRoom.on('connection', function (socket) {

  chatRoomSocketArr[i] = socket;
  i++;


  socket.on("roomSocket", (roomSocket) => {
    userSocketId = roomSocket.socketId;
    User.find({
        _id: roomSocket.userId
      })
      .exec()
      .then(user => {
        if (user.length < 1) {
          socket.disconnect(true);
          console.log();
          console.log("#3.THE SOCKET DID NOT EXIST FOR DISCONNECTION#");

          console.log(userSocketId);
          console.log(roomSocket.userId);
          console.log();

        } else {
          User.findByIdAndUpdate(user[0]._id, {
            $set: {
              chatRoomSocket: userSocketId
            }
          }, {
            new: true
          }, function (err, user) {
            if (err) return err;
            console.log(">>the connected user socket is: " + user.connected_socket);
          });
        }
      });
  });


  //socket.on("cleanUpClient",(roomInfo) => {
  //  console.log(io.sockets.adapter.rooms);
  //                  io.of('/chatRoom').in(roomInfo.roomName).clients((error, clients) => {
  //                    for(let i in chatRoomSocketArr) {
  //                      cleanSocket.push(chatRoomSocketArr[i].id);
  //                    }
  //                    if (error) throw error;
  //                    console.log("______________CLIENTS_______________");
  //                    console.log(clients); 
  //                    console.log("______________CLIENTS_______________");
  //                    socketArrClients = clients;
  //                    console.log();
  //                    console.log("_______________________Difference_______________________");
  //                    cleanSocket = _.uniq(cleanSocket);
  //                    console.log(socketArrClients);
  //                    console.log(cleanSocket);
  //                    let difference = _.difference(cleanSocket, socketArrClients);
  //                    difference = _.uniq(difference);
  //                    console.log(difference);
  //      
  //                    if(difference.length > 1) {
  //                      difference = _.initial(difference);
  //                      for(let i in chatRoomSocketArr) {
  //                        for(let j in difference) {
  //                          if(chatRoomSocketArr[i]!=undefined) {
  //                            if(chatRoomSocketArr[i].id == difference[j]) {
  //                              console.log("__diff__");
  //                              
  //                              console.log(chatRoomSocketArr[i].id);
  //                              difference = _.without(difference, chatRoomSocketArr[i].id);
  //                              cleanSocket = _.without(cleanSocket, chatRoomSocketArr[i].id);
  //                              chatRoomSocketArr[i].disconnect();();
  //                              console.log("__diff__");
  //                            }
  //                          }
  //                        }
  //                      }
  //                    }
  //                    
  //                    console.log("_______________________Difference_______________________");
  //                    console.log();
  //                  });
  //});


  socket.on("insideRoom", (roomInfo) => {



    console.log("Room Name is : " + roomInfo);
    Room.find({
        room_name: roomInfo
      })
      .populate("memberIds")
      .exec()
      .then(room => {
        if (room.length < 1) {
          socket.disconnect(true);
          console.log("Room does not exists.");
        } else {
          console.log("SERIOUSLYYYYYYYYYYYYYYYYYYYYYY");



          //let roomOwner = null;
          let roomMember = null;
          let aboutMe = null;
          let gender = null;
          let usrname = null;

          console.log("###connected members###");
          console.log(room[0].memberIds.length);
          let userdata = null;
          //sArr = [];
          //let connMembers = [];
          connMembers = [];


          for (let i = 0; i < room[0].memberIds.length; i++) {



            if (room[0].memberIds[i].isRoomOwner === true) {
              io.of('/chatRoom').to(room[0].memberIds[i].chatRoomSocket)
                .emit("isRoomOwner", roomOwner);




              console.log("Room Owner is : " + room[0].memberIds[i].display_name);
              roomOwner = room[0].memberIds[i].display_name;
            } else {

              roomMember = room[0].memberIds[i].display_name;
              console.log("Room member: " + room[0].memberIds[i].display_name);
            }

            aboutMe = room[0].memberIds[i].user_aboutme;
            gender = room[0].memberIds[i].user_gender;
            usrname = room[0].memberIds[i].user_name;
            //userdata = {
            //  usrname: usrname,
            //  roomOwner: roomOwner, 
            //  image: "http://localhost:3000/" + room[0].memberIds[i].user_image.slice(11),
            //  roomMember: roomMember,
            //  aboutMe: aboutMe,
            //  gender: gender
            //};
            userdata = {
              usrname: usrname,
              userId: room[0].memberIds[i]._id,
              roomOwner: roomOwner,
              isRoomOwner: room[0].memberIds[i].isRoomOwner,
              avatar: "http://localhost:3000/" + room[0].memberIds[i].user_image.slice(11),
              title: roomMember,
              subtitle: aboutMe,
              gender: gender
            };
            //console.log(userdata);
            connMembers.push(userdata);
            //io.of('/chatRoom').emit("insideRoomUpdtae", userdata);
          }

        }
      });
  });

  socket.on("ownerPic", (ownerImage) => {
    socket.emit("ownerPic", ownerImage);
  });

  socket.on("ownerAbout", (ownerSign) => {
    socket.emit("ownerAbout", ownerSign);
  });




  socket.on("leaveRoom", (roomInfo) => {


    console.log("Room Name is : " + roomInfo.roomName);
    Room.find({
        room_name: roomInfo.roomName
      })
      .populate("memberIds")
      .exec()
      .then(room => {
        if (room.length < 1) {
          socket.disconnect(true);
          console.log("Room does not exists.");
        } else {
          //let roomOwner = null;
          let roomMember = null;
          let aboutMe = null;
          let gender = null;
          let usrname = null;

          if (room[0].memberIds.length < 1) {

            console.log("EVERYONE LEFt");
            userRooms = _.reject(userRooms, (o) => {
              return o === room[0].room_name;
            });

            userRoomsWithPass = _.reject(userRoomsWithPass, (o) => {
              return o === room[0].room_name;
            });
            //console.log(userRooms);
            io.of('/').emit("removeRoom", {
              roomname: room[0].room_name,
              roomId: room[0]._id,
              userRooms: userRooms,
              userRoomsWithPass: userRoomsWithPass
            });
            //console.log(userRooms);
          } else {

            roomOwner = room[0].memberIds[0]._id;
            User.findByIdAndUpdate(roomOwner, {
              $set: {
                isRoomOwner: true
              }
            }, {
              new: true
            }, function (err, user) {
              if (err) return err;

              Room.findByIdAndUpdate(room[0]._id, {
                $set: {
                  ownerId: roomOwner
                }
              }, {
                new: true
              }, function (err, user) {
                if (err) return err;
                //console.log(user);
              });
              //console.log(user);
            });




            console.log(room[0].memberIds.length);
            let userdata = null;
            //let connMembers = [];
            connMembers = [];
            for (let i = 0; i < room[0].memberIds.length; i++) {

              io.of('/chatRoom').to(room[0].memberIds[i].chatRoomSocket)
                .emit("ownerImageUpdate", "http://localhost:3000/" + room[0].memberIds[0].user_image.slice(11));

              io.of('/chatRoom').to(room[0].memberIds[i].chatRoomSocket)
                .emit("ownerSignUpdate", room[0].memberIds[0].user_aboutme);



              if (room[0].memberIds[i].isRoomOwner === true) {
                roomOwned = true;
                console.log("Room Owner is : " + room[0].memberIds[i].display_name);
                roomOwner = room[0].memberIds[i].display_name;
              } else {
                roomOwned = false;
                roomMember = room[0].memberIds[i].display_name;
                console.log("Room member: " + room[0].memberIds[i].display_name);
              }
              aboutMe = room[0].memberIds[i].user_aboutme;
              gender = room[0].memberIds[i].user_gender;
              usrname = room[0].memberIds[i].user_name;

              userdata = {
                usrname: usrname,
                userId: room[0].memberIds[i]._id,
                roomOwner: roomOwner,
                isRoomOwner: room[0].memberIds[i].isRoomOwner,
                avatar: "http://localhost:3000/" + room[0].memberIds[i].user_image.slice(11),
                title: roomMember,
                subtitle: aboutMe,
                gender: gender
              };
              //console.log(userdata);
              connMembers.push(userdata);



            }

            console.log("|||||||||||||||||||||||||||||");
            console.log(userdata);
            console.log("|||||||||||||||||||||||||||||");

            console.log("@conmem");
            console.log(connMembers);
            console.log("@conmem");

          }

        }
      });
  });

  socket.on("ownerImageUpdate", (ownerImage) => {
    socket.emit("ownerPicUpdate", ownerImage);
  });

  socket.on("ownerSignUpdate", (ownerSign) => {
    socket.emit("ownerAboutUpdate", ownerSign);
  });

  socket.on("roomJoin", (roomInfo) => {
    User.find({
        _id: roomInfo.user
      })
      .exec()
      .then(user => {
        if (user.length < 1) {
          socket.disconnect(true);
          console.log();
          console.log("#4.THE SOCKET DID NOT EXIST FOR DISCONNECTION#");

          console.log();

        } else {
          Room.find({
              room_name: roomInfo.roomName
            })
            .populate("memberIds")
            .exec()
            .then(room => {
              if (room.length < 1) {
                socket.disconnect(true);
                console.log("Room does not exists.");
              } else {
                for (let i = 0; i < room[0].memberIds.length; i++) {

                  io.of('/chatRoom').to(room[0].memberIds[i].chatRoomSocket)
                    .emit("ownerImage", "http://localhost:3000/" + room[0].memberIds[0].user_image.slice(11));

                  io.of('/chatRoom').to(room[0].memberIds[i].chatRoomSocket)
                    .emit("ownerSign", room[0].memberIds[0].user_aboutme);
                }
              }
            });
          console.log();
          console.log("$$$THE user socket in mongo: " + user[0].connected_socket);
          console.log("$$$THE socket joining room: " + socket.id);
          console.log("$$$THE room socket in joining room: " + user[0].chatRoomSocket);

          console.log("_____________________adaptars______________________________");
          console.log(io.sockets.adapter.rooms);
          console.log("_____________________adaptars______________________________");

          console.log(socketCounter);
          console.log(io.of("/chatRoom").adapter.rooms);
          console.log();
          console.log("_______________________joining_______________________________");


          for (let i in chatRoomSocketArr) {
            if (chatRoomSocketArr[i].id === user[0].chatRoomSocket) {

              chatRoomSocketArr[i].join(roomInfo.roomName);


              console.log(connMembers);

            }



          }

          io.of('/chatRoom').to(roomInfo.roomName).emit("isOwnerOfRoom", {
            roomName: roomInfo.roomName
          });
          io.of('/chatRoom').to(roomInfo.roomName).emit("insideRoomUpdtae", {
            connMembers: connMembers,
            roomOwner: roomOwner
          });

          console.log();
          console.log(io.of("/chatRoom").adapter.rooms);
          console.log();
          console.log("___________________joining___________________________________");



        }

      });
  });

  socket.on("roomLeft", (roomInfo) => {

    User.find({
        _id: roomInfo.user
      })
      .exec()
      .then(user => {

        if (user.length < 1) {
          socket.disconnect(true);
          console.log();
          console.log("#5.THE SOCKET DID NOT EXIST FOR DISCONNECTION#");

          console.log();
        } else {

          console.log(socketCounter);
          console.log(io.of("/chatRoom").adapter.rooms);
          console.log();
          console.log("___________________leaving___________________________________");
          io.of('/chatRoom').to(roomInfo.roomName).emit("userKicked", user[0]._id);
          for (let i in chatRoomSocketArr) {
            if (chatRoomSocketArr[i].id === user[0].chatRoomSocket) {
              chatRoomSocketArr[i].leave(roomInfo.roomName);
              console.log();
              console.log(io.of("/chatRoom").adapter.rooms);
              console.log();
              //cleanSocket.push(chatRoomSocketArr[i].id);
              if (i != chatRoomSocketArr.length - 1) {
                chatRoomSocketArr[i].disconnect();
              }
              console.log(connMembers);
              //var index = chatRoomSocketArr.indexOf(socket);
              //if (index > -1) {
              //  chatRoomSocketArr.splice(index, 1);
              //}



              User.findByIdAndUpdate(user[0]._id, {
                $set: {
                  chatRoomSocket: "",
                  isRoomOwner: false
                }
              }, {
                new: true
              }, function (err, user) {
                if (err) return err;

                //console.log(user);
                //chatRoomSocketArr[i].disconnect();
              });
            }
          }




          io.of('/chatRoom').to(roomInfo.roomName).emit("insideRoomUpdtaeUL", {
            connMembers: connMembers,
            roomOwner: roomOwner
          });




          //console.log(io.of("/chatRoom").adapter.rooms);

          console.log("___________________leaving___________________________________");
          //console.log(io.of("/").adapter.rooms);


        }

      });

  });



  socket.on("userSend", (data) => {
    console.log(data.roomName);
    io.of('/chatRoom').to(data.roomName).emit("userSend", data.message);
  });



  socket.on("userSendPrivate", (data) => {

  });

  socket.on(
    "disconnect",
    () => {
      console.log();
      console.log("the disconnected chat room socket id is: " + socket.id);
      console.log();


      var index = chatRoomSocketArr.indexOf(socket);
      if (index > -1) {
        chatRoomSocketArr.splice(index, 1);
      }


      User.find({
          chatRoomSocket: socket.id
        })
        .exec()
        .then(user => {
          if (user.length < 1) {
            socket.disconnect(true);
            console.log();
            console.log("#THE room SOCKET DID NOT EXIST FOR DISCONNECTION#");
            console.log();
          } else {
            if (user[0].chatRoomSocket != "") {
              User.findByIdAndUpdate(user[0]._id, {
                $set: {
                  chatRoomSocket: "",
                  isRoomOwner: false
                }
              }, {
                new: true
              }, function (err, user) {
                if (err) return err;
                //console.log(user);
              });
            }
          }
        });

      socket.disconnect(true);
    }
  );




});



module.exports.getIO = () => {
  return io;
};

module.exports.getChatRoomIO = () => {
  return chatRoom;
};