 /*let io = require("socket.io-client");
    let socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to server..on socket :  " + socket.id);
    });
    socket.on("newUserJoined", function(data) {
      this.connectedUsers.push(data);
      console.log("A socket id for new user: " +data.socketId);
      console.log("Other sockets joined: " +data.totalOnline);
      console.log(this.connectedUsers.length);
    }.bind(this));
    socket.on("disconnect", function() {
        //this.$store.dispatch("logOutUserUp");
        this.$router.push("/login");
        console.log("User disconnected#");
        socket.disconnect();
      }.bind(this));




//server

const io = server.getIO();
            io.on('connection', (socket) => {
              console.log("A client is connected : " +socket.id);
              io.emit('newUserJoined', { socketId: socket.id, totalOnline: io.sockets.adapter.rooms });
              socket.on('disconnect', () => {
                console.log("User is disconnected");
                User.findByIdAndUpdate(user[0]._id, { $set: { user_isOnline: false }}, { new: true }, function (err, user) {
                  if (err) return handleError(err);
                  //console.log(user);
                });
              });
              });