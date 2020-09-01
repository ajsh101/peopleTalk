<template>
  <v-app style="background: #eee;">
    <v-card flat style="background: #eee;">
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex
            xs3
            v-for="rooms in userRooms"
            :key="rooms.roomName"
            @click="onClick(rooms, $event)"
            @mouseover="onClick(rooms, $event)"
          >
            <v-card
              raised
              hover
              class="accent-2 black--text"
              :color="
                roomColor[
                  (randomNumber = Math.floor(Math.random() * roomColor.length))
                ]
              "
            >
              <div class="subheading right ma-2 pa-0">1/7</div>

              <v-card-title primary-title>
                <v-icon>fa-home</v-icon>
                <div class="text-truncate">
                  <span
                    ><div class="text-truncate font-weight-thin display-1">
                      {{ rooms.roomName }}
                    </div></span
                  ><br />
                  <!--span class="text-truncate font-weight-normal heading">{{ roomTopic }}</span-->
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-actions class="justify-center">
                <v-btn v-on:click="joinRoom" class="transparent text-capitalize"
                  >Join Room
                  <v-icon right dark>fa-person-booth</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-card flat style="background: #eee;">
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex
            xs3
            v-for="rooms in userRoomsWithPass"
            :key="rooms.roomName"
            @click="onClick(rooms, $event)"
            @mouseover="onClick(rooms, $event)"
          >
            <v-card
              raised
              hover
              class="accent-2 black--text"
              :color="
                roomColor[
                  (randomNumber = Math.floor(Math.random() * roomColor.length))
                ]
              "
            >
              <div class="subheading right ma-2 pa-0">1/7</div>

              <v-card-title primary-title>
                <v-icon>fa-home</v-icon>
                <div class="text-truncate">
                  <span
                    ><div class="text-truncate font-weight-thin display-1">
                      {{ rooms.roomName }}
                    </div></span
                  ><br />
                  <!--span class="text-truncate font-weight-normal heading">{{ roomTopic }}</span-->
                </div>
              </v-card-title>
              <v-card flat class="transparent">
                <v-card-text>
                  <v-text-field
                    class="pa-0 ma-0"
                    @input="handleInput($event)"
                    prepend-icon="lock"
                    name="roomPass"
                    label="Enter the Room Password"
                    required
                  >
                  </v-text-field>
                </v-card-text>
              </v-card>
              <v-divider></v-divider>
              <v-card-actions class="justify-center">
                <v-btn
                  v-on:click="joinRoomWithPass"
                  class="transparent text-capitalize"
                >
                  Join Room
                  <v-icon right dark>fa-person-booth</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>

    <v-layout row justify-center>
      <v-dialog v-model="dialog1" max-width="290">
        <v-card dark color="primary">
          <v-card-text class="headline font-weight-light text-xs-center">
            <v-icon class="ml-1 mr-2">fa-exclamation-triangle</v-icon>
            Invalid Password.
          </v-card-text>

          <v-card-actions> </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-tooltip top color="primary">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          bottom
          right
          small
          color="primary"
          fixed
          v-on:click="showDialog"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </template>
      <span>Create Room</span>
    </v-tooltip>
    <!-- Room Dialogue-->
    <v-dialog v-model="dialog" width="400px">
      <v-card>
        <v-card-title class="font-weight-light  red--text headline mb-0">
          Create Room
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submit"
            lazy-validation
          >
            <v-text-field
              class="pa-0 ma-0"
              v-model="roomName"
              :rules="nameRules"
              prepend-icon="home"
              name="roomName"
              label="Enter the Room Name"
              required
            >
            </v-text-field>
            <!--v-text-field 
                  class="pa-0 ma-0"
                  v-model="roomTopic" 
                  prepend-icon="home" 
                  name="roomTopic" 
                  label="Enter room description"
                  required>
                  </v-text-field-->
            <v-switch
              v-model="passwdProtect"
              @change="switchPressed"
              color="primary"
              label="Password Protect Room"
              value="passwdProtect"
            ></v-switch>
            <v-text-field
              v-show="passwdProtect"
              class="pa-0 ma-0"
              v-model="roomPasswd"
              prepend-icon="lock"
              name="roomPasswd"
              label="Enter the room Password"
              required
            >
            </v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-model="dialog"
                v-on:click="dialog = !dialog"
                color="primary text-capitalize"
                >Cancel</v-btn
              >
              <v-btn
                :disabled="!valid"
                v-on:click="submit"
                color="primary text-capitalize"
                >Create Room</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!--End of Room Dialogue-->
  </v-app>
</template>

<script>
//const lodash = require("lodash");
const _ = require("underscore");
export default {
  data: function() {
    return {
      randomNumber: 0,
      roomTopic: "Hey, there! Join my room.",
      roomColor: [
        "deep-orange accent-2",
        "yellow accent-2",
        "lime accent-3",
        "green darken-2",
        "light-blue darken-3"
      ],
      totalOnlineUsers: [],
      userRooms: [],
      userRoomsWithPass: [],
      totalOnlineCount: 0,
      email: null,
      inputPassData: null,
      roomName: null,
      roomPasswd: null,
      valid: true,
      user: null,
      userChooseRoom: null,
      dialog: false,
      dialog1: false,
      passwdProtect: false,
      passwdEmpty: false,
      passCorrect: false,
      nameRules: [
        v => !!v || "Name is required"
        //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ]
    };
  },
  created: function() {
    let io = require("socket.io-client");
    //let socket = io("http://localhost:3000/roomCreated");
    let socket = io("http://localhost:3000");

    socket.on(
      "connect",
      function() {
        let socketId = socket.id;
        //socketId = socketId.indexOf("#") + 1;
        //socketId = socket.id.slice(socketId, socket.id.length);
        //console.log("1...###userID##" + this.userId);
        socket.emit("userSocket", {
          socketId: socketId,
          userId: this.$store.getters.user.userId
        });
        console.log("The Socket id is @-->", socketId);
        //socket.emit("userSocketId", {socketId: socket.id, userIs: this.user});
        console.log(
          "Connected to server., ready to create rooms.. :  " + socket.id
        );
        socket.emit("cleanUp", socket.id);
      }.bind(this)
    );

    //socket.emit("socketCleanup", this.socketId);

    socket.on(
      "RoomInfo",
      function(data) {
        if (data.passwdEmpty === false) {
          this.userRoomsWithPass.push({ roomName: data.roomName });
          for (let i in this.userRoomsWithPass) {
            socket.emit(
              "alreadyRoomWithPass",
              this.userRoomsWithPass[i].roomName
            );
          }
        } else {
          this.passwdProtect = false;
          this.userRooms.push({ roomName: data.roomName });
          for (let i in this.userRooms) {
            socket.emit("alreadyRoom", this.userRooms[i].roomName);
          }
        }
      }.bind(this)
    );

    socket.on(
      "updateRoom",
      function(rooms) {
        rooms = _.uniq(rooms);
        console.log(rooms);
        console.log(this.userRooms);
        this.userRooms = _.uniq(this.userRooms);
        for (var key in rooms) {
          //this.userRooms.push({ roomName: rooms[key] });
          this.userRooms.push({ roomName: rooms[key] });
        }
        this.userRooms = _.uniq(this.userRooms, "roomName");
        console.log(this.userRooms);
      }.bind(this)
    );

    socket.on(
      "updateRoomWithPass",
      function(rooms) {
        rooms = _.uniq(rooms);
        //this.userRooms = _.uniq(this.userRooms);

        for (var key in rooms) {
          //this.userRooms.push({ roomName: rooms[key] });
          this.userRoomsWithPass.push({ roomName: rooms[key] });
        }
        this.userRoomsWithPass = _.uniq(this.userRoomsWithPass, "roomName");
      }.bind(this)
    );

    socket.on(
      "removeRoom",
      function(roomInfo) {
        this.$store.dispatch("roomClear", {
          roomId: roomInfo.roomId
        });

        this.userRooms = [];
        this.userRoomsWithPass = [];

        for (var key in roomInfo.userRooms) {
          //this.userRooms.push({ roomName: rooms[key] });
          this.userRooms.push({ roomName: roomInfo.userRooms[key] });
        }

        for (var keyP in roomInfo.userRoomsWithPass) {
          //this.userRooms.push({ roomName: rooms[key] });
          this.userRoomsWithPass.push({
            roomName: roomInfo.userRoomsWithPass[keyP]
          });
        }

        this.userRooms = _.uniq(this.userRooms, "roomName");
        this.userRoomsWithPass = _.uniq(this.userRoomsWithPass, "roomName");

        for (let i in this.userRooms) {
          socket.emit("alreadyRoom", this.userRooms[i].roomName);
        }
        for (let i in this.userRoomsWithPass) {
          socket.emit(
            "alreadyRoomWithPass",
            this.userRoomsWithPass[i].roomName
          );
        }
      }.bind(this)
    );

    socket.on(
      "disconnect",
      function() {
        console.log(
          "The socket created at room creation time is disconnected# " +
            socket.id
        );
        socket.disconnect(true);
      }.bind(this)
    );
  },
  mounted() {
    const email = this.$store.getters.user.username;
    this.email = email;
  },
  methods: {
    onClick() {
      this.userChooseRoom = event.currentTarget.innerText.split("\n")[1];
      //console.log(event.currentTarget.innerText.split("\n")[1]);
    },
    switchPressed() {
      this.roomPasswd = null;
    },
    joinRoom() {
      this.roomPasswd = null;
      this.user = this.$store.getters.user.userName;
      const joinRoomInfo = {
        username: this.user,
        roomname: this.userChooseRoom,
        password: this.roomPasswd
      };

      console.log("##############JOIN ROOM###############");
      console.log(joinRoomInfo.username + " is the username");
      console.log(joinRoomInfo.roomname + " is the roomname");
      console.log(joinRoomInfo.password + " is the password");
      this.$store.dispatch("roomInfo", {
        roomname: joinRoomInfo.roomname,
        username: joinRoomInfo.username,
        password: joinRoomInfo.password
      });
      console.log("##############JOIN ROOM###############");
      this.$router.replace("/chatRoom");
    },
    handleInput(value) {
      this.roomPasswd = value;
      console.log(this.roomPasswd);
    },
    async joinRoomWithPass() {
      this.user = this.$store.getters.user.userName;
      const joinRoomInfo = {
        username: this.user,
        roomname: this.userChooseRoom,
        password: this.roomPasswd
      };

      console.log("##############JOIN ROOM WITH PASS###############");
      console.log(joinRoomInfo.username + " is the username");
      console.log(joinRoomInfo.roomname + " is the roomname");
      console.log(joinRoomInfo.password + " is the password");
      await this.$store
        .dispatch("roomInfo", {
          roomname: joinRoomInfo.roomname,
          username: joinRoomInfo.username,
          password: joinRoomInfo.password
        })
        .then(
          function() {
            console.log(this.$store.getters.user.passCorrect);
          }.bind(this)
        );
      if (this.$store.getters.user.passCorrect) {
        this.$router.replace("/chatRoom");
      } else {
        this.dialog1 = true;
      }
      console.log("##############JOIN ROOM WITH PASS###############");
    },
    showDialog() {
      let roomIs = null;
      if (this.email === null || this.email === undefined) {
        roomIs = this.$store.getters.user.userName;
        roomIs = roomIs.split("@");
        this.roomName = roomIs[0] + "'s room";
        this.email = roomIs;
      } else {
        roomIs = this.$store.getters.user.userName;
        this.roomName = roomIs + "'s room";
      }

      console.log(this.roomName);
      this.dialog = !this.dialog;
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.roomPasswd === null || this.roomPasswd === "") {
          this.roomPasswd = null;
          const roomInfo = {
            username: this.$store.getters.user.userName,
            roomname: this.roomName,
            password: this.roomPasswd
          };
          this.$store.dispatch("createRoom", roomInfo);

          this.dialog = !this.dialog;
          this.$router.replace("/chatRoom");
        } else {
          const roomInfo = {
            username: this.$store.getters.user.userName,
            roomname: this.roomName,
            password: this.roomPasswd
          };
          this.$store.dispatch("createRoom", roomInfo);
          this.dialog = !this.dialog;
          this.$router.replace("/chatRoom");
        }

        // Native form submission is not yet supported
      } else {
        console.log("Room cant be created as form is not validated..");
      }
    }
  },
  watch: {
    room(value) {
      if (value) {
        console.log(value);
        //this.$router.push("/chatRoom");
        //console.log("Room is created");
        //this.$store.dispatch("logOutUserUp");
      }
    }
  },
  computed: {
    room() {
      return this.$store.getters.room;
    },
    error() {
      return this.$store.getters.error;
    }
  }
};
</script>
