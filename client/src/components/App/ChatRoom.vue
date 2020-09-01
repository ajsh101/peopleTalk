<template>

  <v-app id="keep" style="background: #eee;">
    <v-container grid-list-md text-xs-center style="background: #eee;">
      
      <v-layout column align-stretch>
        <!--chatWin v-if="privateWin"></chatWin-->
        <!--chatWin></chatWin-->
        <v-dialog persistent overlay-opacity="100" v-model="privateWin" hide-overlay>
          <div ref="draggableContainer" id="draggable-container">
            <div id="draggable-header" @mousedown="dragMouseDown">
              <slot name="header">
                <v-system-bar color="indigo" window>
                  <v-icon>mdi-message</v-icon>
                  <span>10 unread messages</span>
                  <v-spacer></v-spacer>
                  <v-icon>mdi-minus</v-icon>
                  <v-btn class="ma-0" small right text color="white" v-on:click="privateWinToggle">
                    <v-icon right dark dense color="white">mdi-close</v-icon>
                  </v-btn>
                </v-system-bar>
              </slot>
            </div>
            <slot name="main">
              <v-card class="ma-0"
                width="600"
                height="400"
                color="white"
                style="position: relative">
                 <template>
                  <!--chat-window 
                  :currentUserId="currentUserId" 
                  :rooms="rooms" 
                  :messages="messages" /-->

                  <v-row no-gutters>
                <v-col v-for="n in 2" :key="n" :cols="n === 1 ? 4 : 8">
                  <v-card v-if="n === 1" class="pa-2 overflow-y-auto" dense>
                    <v-list
                    dense
                    height="383"
                    outlined
                    
                    subheader
                    nav
                    avatar
      >
        <v-subheader>My Friends</v-subheader>
         <v-divider
          :key="n"
        ></v-divider>
        <v-list-item-group color="primary">
         
          <v-list-item
          flat
          
            v-for="(item, index) in addedFriends"
            :key="index"
            
          >
           
            
                <v-list-item-avatar>
              <v-img :src="item.friendPic"></v-img>
            </v-list-item-avatar>
                
             <div v-if="item.friendOnline">
               <v-badge color="transparent" left inline >
                <template v-slot:badge><v-icon color="green">
                          mdi-wifi
                        </v-icon></template>
            <v-list-item-content>
              <v-list-item-title>{{ item.friendName}}</v-list-item-title>
              <v-list-item-subtitle v-html="item.subtitle">
        </v-list-item-subtitle>
              
            </v-list-item-content>
             </v-badge>
                        
                      </div>

                      <div v-else>
                        <v-badge color="transparent" left inline >
                <template v-slot:badge><v-icon color="grey">
                          mdi-wifi-off
                        </v-icon></template>
            <v-list-item-content>
              <v-list-item-title>{{ item.friendName}}</v-list-item-title>
              <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
              
            </v-list-item-content>
             </v-badge>
                      </div>
                      
            
          </v-list-item>
       
        </v-list-item-group>
      </v-list>
         
                  </v-card>
                  <v-card v-else-if="n === 2">
                     
    <v-virtual-scroll
      :items="items"
      :item-height="50"
      height="300"
    >
    <v-card>
 
      
   
      <v-container style="height: 1000px;">
        <template v-for="(message, index) in messages">
        <div :key="index">
          <v-flex xs10 v-if="userName === message.user" class="chat" style="display: inline-block;">
            <v-layout wrap justify-start>
              <div
                class="bubble me mt-2 mb-2 white--text font-weight-normal"
                style="font-size: 15px;"
              >{{ message.text }}</div>
            </v-layout>
          </v-flex>
          <v-layout v-else wrap justify-end>
            <v-flex xs10 class="chat" style="display: inline-block;">
              <div class="bubble you mr-0 mt-2 mb-2">
                <span class="ma-0 pa-0 font-weight-light" style="float:right;">
                  <i>@{{ message.user }}</i>
                </span>
                <br />
                <span
                  class="ma-0 pa-0 font-weight-normal"
                  style="float:left; font-size: 15px;"
                >{{ message.text }}</span>
              </div>
            </v-flex>
            <v-avatar class="ml-4 mr-2" size="35">
              <img :src="message.userImage" />
            </v-avatar>
          </v-layout>
        </div>
        
      </template>
      
      </v-container>
      
      
    
    </v-card>
    </v-virtual-scroll>
     
<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="userInputMsg"
            placeholder="Type a message.."
            outlined
            label="Message"
            type="text"
          >
            <template v-slot:prepend>
              <v-tooltip
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                I'm a tooltip
              </v-tooltip>
            </template>
            <template v-slot:append-outer>
              <v-fade-transition leave-absolute>
        
                  <v-btn v-on:click="send" color="primary" dark fab x-small>
              <v-icon>send</v-icon>
            </v-btn>
              </v-fade-transition>
            </template>
            
          </v-text-field>
        </v-col>

      </v-row>
    </v-container>
  </v-form>
        </template>
   
  
                    

                  </v-card>
                  
                </v-col>
                
              </v-row>
                  </template>
              </v-card>
            </slot>
            <slot name="footer">
            
     
    
      
  
            </slot>
          </div>
        </v-dialog>

        <v-tooltip left color="primary">
          <template v-slot:activator="{ on }">
            <v-btn
              class="ma-5"
              v-on="on"
              right
              small
              bottom
              fab
              color="green"
              fixed
              v-on:click="listFriends"
            >
              <v-badge>
                <template v-slot:badge>0</template>
                <v-icon>mdi-email</v-icon>
              </v-badge>
            </v-btn>
          </template>

          <span text--color="red">Exit</span>
        </v-tooltip>
        <v-navigation-drawer v-model="drawer" app color="white" permanent floating>
          <v-list dense nav class="py-0">
            <v-img
              class="ma-2 portrait"
              :aspect-ratio="1"
              v-if="ownerImage != null"
              :src="ownerImage"
            ></v-img>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>
                  <div class="headline font-weight-regular">{{ roomOwner }}</div>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="subheading font-italic">@{{ roomName }}</div>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </v-list>
          <div class="ma-3 title font-weight-light">Room Members</div>

          <v-menu absolute offset-y style="max-width: 600px">
            <template v-slot:activator="{ on }">
              <template v-for="(item, index) in connectedUsers">
                <v-divider v-if="item.divider" :key="index" :inset="item.inset"></v-divider>

                <v-list-item
                  v-else
                  :key="index"
                  v-on="on"
                  @click="userOption(item.usrname, item.userId)"
                >
                  <v-list-item-avatar>
                    <img :src="item.avatar" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.usrname }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </template>

            <v-list v-if="memberChoice != null">
              <v-list-item
                v-for="(element, i) in memberChoice"
                :key="i"
                @click="userChoose(element.title)"
              >
                <v-list-item-title>{{ element.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-navigation-drawer>
      </v-layout>
      <template v-for="(message, index) in messages">
        <div :key="index">
          <v-flex xs10 v-if="userName === message.user" class="chat" style="display: inline-block;">
            <v-layout wrap justify-start>
              <div
                class="bubble me mt-2 mb-2 white--text font-weight-normal"
                style="font-size: 15px;"
              >{{ message.text }}</div>
            </v-layout>
          </v-flex>
          <v-layout v-else wrap justify-end>
            <v-flex xs10 class="chat" style="display: inline-block;">
              <div class="bubble you mr-0 mt-2 mb-2">
                <span class="ma-0 pa-0 font-weight-light" style="float:right;">
                  <i>@{{ message.user }}</i>
                </span>
                <br />
                <span
                  class="ma-0 pa-0 font-weight-normal"
                  style="float:left; font-size: 15px;"
                >{{ message.text }}</span>
              </div>
            </v-flex>
            <v-avatar class="ml-4 mr-2" size="35">
              <img :src="message.userImage" />
            </v-avatar>
          </v-layout>
        </div>
      </template>
    </v-container>

    <v-tooltip bottom color="pink">
      <template v-slot:activator="{ on }">
        <v-btn class="mt-6" v-on="on" right small fab color="primary" fixed v-on:click="leaveRoom">
          <v-icon>close</v-icon>
        </v-btn>
      </template>

      <span text--color="red">Exit</span>
    </v-tooltip>

    <v-dialog v-model="dialogOwnerProfile" max-width="300">
      <v-hover>
        <v-card slot-scope="{ hover }" class="mx-auto" color="grey lighten-4" max-width="600">
          <v-img v-if="ownerImage != null" :src="ownerImage" :aspect-ratio="1">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out blue darken-2 v-card--reveal subheading white--text"
                style="height: 100%;"
              >
                <div class="ma-2 pa-4">{{ ownerSign }}</div>
              </div>
            </v-expand-transition>
          </v-img>
          <v-card-text class="pt-4" style="position: relative;">
            <v-btn
              v-if="alreadyFriend"
              absolute
              color="success"
              class="white--text"
              fab
              right
              top
              v-on:click="addFriend"
            >
              <v-icon>fa-user-friends</v-icon>
            </v-btn>
            <v-btn v-else absolute color="blue" class="white--text" small fab right top>
              <v-icon>chat</v-icon>
            </v-btn>
            <h3 class="display-1 text-xs-center font-weight-light orange--text mb-2">{{ roomOwner }}</h3>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-dialog>

    <v-dialog v-model="dialogUserProfile" max-width="300">
      <v-hover>
        <v-card slot-scope="{ hover }" class="mx-auto" color="grey lighten-4" max-width="600">
          <v-img v-if="userImage != null" :src="userImage" :aspect-ratio="1">
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out blue darken-2 v-card--reveal subheading white--text"
                style="height: 100%;"
              >
                <div class="ma-2 pa-4">{{ userSign }}</div>
              </div>
            </v-expand-transition>
          </v-img>
          <v-card-text class="pt-4" style="position: relative;">
            <v-btn
              v-if="alreadyFriend"
              absolute
              color="success"
              class="white--text"
              fab
              right
              top
              v-on:click="addFriend"
            >
              <v-icon>fa-user-friends</v-icon>
            </v-btn>
            <v-btn v-else absolute color="blue" class="white--text" small fab right top>
              <v-icon>chat</v-icon>
            </v-btn>
            <h3
              class="display-1 text-xs-center font-weight-light orange--text mb-2"
            >{{ userNameProfile }}</h3>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-dialog>

    <v-dialog v-model="newFriendAdd" max-width="290">
      <v-card class="mx-auto" max-width="400">
        <v-card-title>
          <v-img class="elevation-6" v-if="ifriendPic != null" :src="ifriendPic"></v-img>
        </v-card-title>

        <v-card-text
          class="pt-0 pb-0 font-weight-light primary--text headline text-sm-center"
        >{{ ifriendName }}</v-card-text>

        <v-card-text class="pt-0 font-weight-light title">want to add you as a friend.</v-card-text>

        <v-card-actions>
          <v-btn v-on:click="newFriendAdd = false" dark block class="red accent-4">Cancel</v-btn>
          <v-btn v-on:click="acceptFriend" dark block class="green darken-4">Add Friend</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-footer id="container" class="transparent justify-center mb-0" inset app fixed height="70">
      <v-spacer></v-spacer>
      <v-flex>
        <v-text-field
          v-model="userInputMsg"
          class="hidden-sm-and-down"
          placeholder="Type a message.."
          prepend-inner-icon="fa-pencil-alt"
          label="Message"
          append-outer-icon="send"
          solo
          background-color="white"
          clearable
          autofocus
          v-on:keyup.enter="send"
          @click:append-outer="send"
        ></v-text-field>
      </v-flex>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
  import 'vue-advanced-chat/dist/vue-advanced-chat.css'
//const _ = require("underscore");
//import chatWindow from "@/components/App/chatWindow.vue";
import VueDragResize from "vue-drag-resize";
export default {
  name: "DraggableDiv",
  components: {
    //chatWin: chatWindow
    VueDragResize
  },
  data: function() {
    return {
      io: null,
      socket: null,
      uID: null,
      userKicked: null,
      userName: null,
      userNameProfile: null,
      userImage: null,
      userSign: null,
      ownerSign: null,
      ownerImage: null,
      dialogUserProfile: false,
      dialogOwnerProfile: false,
      drawer: true,
      roomOwner: null,
      chattyUser: false,
      isRoomOwner: false,
      roomName: null,
      newFriendAdd: false,
      ifriendPic: null,
      ifriendName: null,
      friendId: null,
      requestingUser: null,
      alreadyFriend: false,
      socketId: null,
      listWidth: 400,
      listHeight: 500,
      offsetTop: 0,
      friendList: false,
      friendGender: 0,
      item: 5,
      dense: true,
      nav: true,
      avatar: true,
      dialog: false,
      privateWin: false,
      addedFriends: [],
      right: null,
      //chatHistory: false,
      //itemsFriendsListPrivateWin: [],
      chatMessages: [],
      userInputMsg: "",
      userInputPrivateMsg: "",
      sendPrivateMsg: true, //need to be applied
      friendInPrivateClicked: false,
      friendInPrivateNotClicked: true,
      memberChoice: [{ title: "Profile" }, { title: "Block" }],
      message: {
        type: "",
        action: "",
        user: "",
        text: "", //actual chat message
        timestamp: ""
      },
      privateMessage: {
        type: "",
        action: "",
        user: "",
        text: "", //actual chat message
        timestamp: ""
      },
      userTyping: [],
      messages: [],
      connectedUsers: [],
      showMenu: false,
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ],

      positions: {
        clientX: undefined,
        clientY: undefined,
        movementX: 0,
        movementY: 0
      },
      colors: ["transparent"],
      slides: [
        {
          src: require("@/assets/peopleTalk.jpg")
        }
      ],
      showAddRoom: false,
        rooms: [],
        messages: [],
        currentUserId: 1234
    };
  },
  created: function() {
    this.io = require("socket.io-client");
    this.socket = this.io("http://localhost:3000/chatRoom");

    this.socket.on(
      "connect",
      function() {
        this.socketId = this.socket.id;
        //console.log(this.socketId);
        console.log(this.$store.getters.user.userId);
        this.socket.emit("roomSocket", {
          socketId: this.socketId,
          userId: this.$store.getters.user.userId
        });
        console.log(this.$store.getters.user.userId);
        console.log(
          "Connected to server., ready to create rooms.. :  " + this.socket.id
        );
      }.bind(this)
    );

    this.socket.on(
      "isRoomOwner",
      function(data) {
        this.isRoomOwner = data;
      }.bind(this)
    );

    this.socket.on(
      "isOwnerOfRoom",
      function(data) {
        this.roomName = data.roomName;
      }.bind(this)
    );

    this.socket.on(
      "roomData",
      function(roomInfo) {
        console.log("####INSIDE ROOMDATA SOCKET#####");
        console.log(roomInfo.roomName);
        //this.roomName = roomInfo.roomName;
        console.log("####INSIDE ROOMDATA SOCKET#####");
        console.log(roomInfo.roomName);
        this.socket.emit("insideRoom", roomInfo.roomName);
        this.socket.emit("roomJoin", {
          roomName: roomInfo.roomName,
          user: roomInfo.user
        });
      }.bind(this)
    );

    this.socket.on(
      "ownerImage",
      function(ownerImage) {
        this.ownerImage = ownerImage;
        this.socket.emit("ownerPic", ownerImage);
      }.bind(this)
    );

    this.socket.on(
      "ownerPic",
      function(ownerImage) {
        this.ownerImage = ownerImage;
      }.bind(this)
    );

    this.socket.on(
      "ownerImageUpdate",
      function(ownerImage) {
        this.socket.emit("ownerImageUpdate", ownerImage);
      }.bind(this)
    );

    this.socket.on(
      "ownerPicUpdate",
      function(ownerImage) {
        this.ownerImage = ownerImage;
      }.bind(this)
    );

    this.socket.on(
      "ownerSign",
      function(ownerSign) {
        this.ownerSign = ownerSign;
        this.socket.emit("ownerAbout", ownerSign);
      }.bind(this)
    );

    this.socket.on(
      "ownerAbout",
      function(ownerSign) {
        this.ownerSign = ownerSign;
      }.bind(this)
    );

    this.socket.on(
      "ownerSignUpdate",
      function(ownerSign) {
        this.socket.emit("ownerSignUpdate", ownerSign);
      }.bind(this)
    );

    this.socket.on(
      "ownerAboutUpdate",
      function(ownerSign) {
        this.ownerSign = ownerSign;
      }.bind(this)
    );

    this.socket.on(
      "insideRoomUpdtae",
      function(roomInfo) {
        this.roomOwner = roomInfo.roomOwner;

        console.log("MEMBURU#@");
        console.log(roomInfo.connMembers);
        console.log("MEMBURU#@");
        //this.connectedUsers = [];
        //if (roomInfo.roomMember != null) {
        //  this.connectedUsers.push({
        //    username: roomInfo.usrname,
        //    avatar: roomInfo.image,
        //    title: roomInfo.roomMember,
        //    subtitle: roomInfo.aboutMe
        //  });
        //  console.log(this.connectedUsers);
        //}
        //if (this.temp.indexOf(roomInfo.usrname) <= -1) {
        //  this.temp.push(roomInfo.usrname);
        //}

        this.connectedUsers = roomInfo.connMembers;

        this.connectedUsers.push({ divider: true, inset: true });
        console.log("################INSIDE CHAT ROOM################");
        //console.log(this.connectedUsers.length);
        //for(let keys in this.connectedUsers) {
        //  if(this.connectedUsers[keys].username != undefined) {
        //    console.log("The members inside this room are: " +this.connectedUsers[keys].username);
        //  }
        //}
        console.log(this.connectedUsers);
        //console.log(roomInfo.roomOwner);
        //console.log(roomInfo.roomMember);
        //console.log(roomInfo.aboutMe);
        //console.log(roomInfo.gender);
        console.log("THe room owner is " + this.roomOwner);

        //this.connectedUsers = _.uniq(this.connectedUsers, "username");

        console.log("################INSIDE CHAT ROOM################");
      }.bind(this)
    );

    this.socket.on(
      "insideRoomUpdtaeUL",
      function(roomInfo) {
        this.roomOwner = roomInfo.roomOwner;

        //this.connectedUsers = [];
        //if (roroomOwneromInfo.roomMember != null) {
        //  thisroomOwner.connectedUsers.push({
        //    usroomOwnerername: roomInfo.usrname,
        //    avatar: roomInfo.image,
        //    title: roomInfo.roomMember,
        //    subtitle: roomInfo.aboutMe
        //  });
        //  console.log(this.connectedUsers);
        //}

        this.connectedUsers = roomInfo.connMembers;

        for (let i = 0; i < this.connectedUsers.length; i++) {
          if (this.connectedUsers[i].isRoomOwner) {
            if (
              this.connectedUsers[i].userId == this.$store.getters.user.userId
            ) {
              this.isRoomOwner = true;
            }
          }
        }

        this.connectedUsers.push({ divider: true, inset: true });
        console.log("################INSIDE CHAT ROOM################");
        //console.log(this.connectedUsers.length);
        //for(let keys in this.connectedUsers) {
        //  if(this.connectedUsers[keys].username != undefined) {
        //    console.log("The members inside this room are: " +this.connectedUsers[keys].username);
        //  }
        //}
        console.log(this.connectedUsers);
        //console.log(roomInfo.roomOwner);
        //console.log(roomInfo.roomMember);
        //console.log(roomInfo.aboutMe);
        //console.log(roomInfo.gender);
        //this.connectedUsers = _.uniq(this.connectedUsers, "username");
        console.log("THe room owner is " + this.roomOwner);
        console.log("################INSIDE CHAT ROOM################");
      }.bind(this)
    );

    this.socket.on(
      "userSend",
      function(message) {
        this.messages.push(message);
        if (this.messages.length > 7) {
          this.$vuetify.goTo(9999);
        }
        for (let i = 0; i < this.messages.length; i++) {
          if (this.$store.getters.user.userName === this.messages[i].user) {
            this.chattyUser = true;
          } else {
            this.chattyUser = false;
          }
        }
      }.bind(this)
    );

    this.socket.on(
      "addFriend",
      function(friendInfo) {
        this.ifriendPic = friendInfo.userImage;
        this.ifriendName = friendInfo.userName;
        this.friendId = friendInfo.friendId;
        this.requestingUser = friendInfo.userId;
        this.newFriendAdd = true;
      }.bind(this)
    );

    this.socket.on(
      "notFriend",
      function() {
        this.alreadyFriend = true;
      }.bind(this)
    );

    this.socket.on(
      "alreadyFriend",
      function() {
        this.alreadyFriend = false;
      }.bind(this)
    );

    this.socket.on(
      "userLeft",
      function(roomInfo) {
        console.log("#ROOMNAME INSIDE USERLEFT SOCKET#");
        console.log(roomInfo.roomName);

        console.log("#ROOMNAME INSIDE USERLEFT SOCKET#");
        this.socket.emit("leaveRoom", { roomName: roomInfo.roomName });
        this.socket.emit("roomLeft", {
          roomName: roomInfo.roomName,
          user: roomInfo.user
        });
        this.isRoomOwner = false;

        //socket.emit("cleanUpClient", { roomName: roomInfo.roomName });
      }.bind(this)
    );

    this.socket.on(
      "userKicked",
      function(userInfo) {
        if (this.$store.getters.user.userId === userInfo) {
          this.$router.replace("/dashboard");
        }
      }.bind(this)
    );

    this.socket.on(
      "disconnect",
      function() {
        console.log("The socket of inside chat room is disconnecteds#: ");
        this.socket.disconnect(true);
      }.bind(this)
    );
  },
  mounted() {},
  updated() {
    //this.$vuetify.goTo(9999);
  },
  props: {
    source: String
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    menuItems_b() {
      let menuItems = [
        { icon: "fa-user-plus", title: "Sign up", link: "/signup" },
        { icon: "lock_open", title: "Login", link: "/login" }
      ];
      if (this.userIsAuthenticated) {
        menuItems = [
          { icon: "supervisor_account", title: "Friends", link: "/dashboard" },
          { icon: "supervisor_account", title: "dashboard", link: "/dashboard" }
          //{icon: 'logout', title: 'Logout', link: '/login'}
        ];
        //console.log(menuItems[0]);
      }
      return menuItems;
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    }
  },
  methods: {
    userOption(userInfo, userId) {
      if (userId === this.$store.getters.user.userId) {
        this.memberChoice = null;
      } else if (this.isRoomOwner) {
        this.memberChoice = [
          { title: "Profile" },
          { title: "Kick Out" },
          { title: "Block" }
        ];
      } else {
        this.memberChoice = [{ title: "Profile" }, { title: "Add Friend" }];
      }
      //alert(userKicked);
      //this.setChooseOption = true;
      this.uID = userId;
      this.$store.dispatch("userShowProile", { userId: this.uID });
      this.userNameProfile = userInfo;
      this.userKicked = userInfo;
    },
    userChoose(userOption) {
      //alert(this.uID + "  " + this.userKicked);

      alert(this.uID);
      alert(this.$store.getters.user.userId);

      this.$store.dispatch("getFriendInfo", {
        userId: this.$store.getters.user.userId,
        friendId: this.uID
      });

      if (userOption === "Kick Out") {
        this.kickUser();
      }
      if (userOption === "Profile") {
        this.userSign = this.$store.getters.userProfile.userAbout;

        if (this.userSign === "") {
          this.userSign = "The user got nothing to tell about himself.";
        }
        this.userImage = this.$store.getters.userProfile.userImage;
        this.dialogUserProfile = true;
      }
    },

    ownerProfile() {
      this.userSign = this.$store.getters.user.userAbout;

      if (this.userSign === "") {
        this.userSign = "The user got nothing to tell about himself.";
      }
      this.userImage = this.$store.getters.user.userImage;
      this.dialogOwnerProfile = true;
    },

    addFriend() {
      alert(this.$store.getters.user.userId + "  " + this.uID);
      this.$store.dispatch("userAddFriend", {
        userId: this.$store.getters.user.userId,
        friendId: this.uID,
        displayName: this.$store.getters.user.displayName,
        userPic: this.$store.getters.user.userImage
      });
    },

    acceptFriend() {
      console.log("____________");
      console.log(this.ifriendPic);
      console.log(this.ifriendName);
      console.log(this.friendId);
      console.log(this.requestingUser);
      console.log("____________");
      this.$store.dispatch("reqAccepted", {
        userId: this.requestingUser,
        friendId: this.friendId
      });
      this.newFriendAdd = false;
    },

    cancleDialog() {
      this.dialogUserProfile = false;
    },

    leaveRoom() {
      //  this.userName = this.$store.getters.user.userName;
      console.log(this.user);
      console.log(this.room);
      if (this.user.roomname != null || this.user.roomname != undefined) {
        this.$store.dispatch("leaveRoom", {
          roomname: this.user.roomname,
          username: this.user.userName
        });
      } else {
        this.$store.dispatch("leaveRoom", {
          roomname: this.$store.getters.room.roomname,
          username: this.user.userName
        });
      }
      console.log("##############Leave Room###############");
      //console.log(leaveRoomInfo.userName);
      //console.log(leaveRoomInfo.roomname)
      //this.$store.dispatch("leaveRoom", {
      //  roomname: roomLeaving.roomname,
      //  username: userLeaving.userName,
      //});
      console.log("##############Leave Room###############");
      //this.$router.replace("/dashboard");
    },
    kickUser() {
      if (this.user.roomname != null || this.user.roomname != undefined) {
        this.$store.dispatch("userKicked", {
          roomname: this.user.roomname,
          username: this.userKicked
        });
      } else {
        this.$store.dispatch("userKicked", {
          roomname: this.$store.getters.room.roomname,
          username: this.userKicked
        });
      }
    },
    async onLogout() {
      //this.$store.dispatch("logOutUserUp");
      if (this.user.roomname != null || this.user.roomname != undefined) {
        await this.$store.dispatch("leaveRoomLogout", {
          roomname: this.user.roomname,
          username: this.user.userName
        });
      } else {
        await this.$store.dispatch("leaveRoomLogout", {
          roomname: this.$store.getters.room.roomname,
          username: this.user.userName
        });
      }
      //this.$store.dispatch("logOutUserUp")
    },
    send() {
      this.userName = this.$store.getters.user.userName;
      this.message.type = "chat";
      this.message.text = this.userInputMsg;
      this.message.user = this.user.userName;
      this.message.userImage = this.$store.getters.user.userImage;
      this.message.timestamp = "Today";
      console.log(this.roomName);
      if (this.message.text != "") {
        this.socket.emit("userSend", {
          message: this.message,
          roomName: this.$store.getters.room.roomname
        });
      }

      this.reset();
    },
    reset() {
      this.message.type = "";
      this.userInputMsg = "";
      this.message.user = "";
      this.message.text = "";
      this.message.userImage = "";
      this.message.timestamp = "";
    },

    fetchPrivate() {
      this.friendInPrivateNotClicked = false;
      this.friendInPrivateClicked = true;
    },

    sendPrivate() {
      this.userName = this.$store.getters.user.userName;
      this.privateMessage.type = "privateChat";
      this.privateMessage.text = this.userInputPrivateMsg;
      this.privateMessage.user = this.user.userName;
      this.privateMessage.userImage = this.$store.getters.user.userImage;
      this.privateMessage.timestamp = "Today";
      if (this.message.text != "") {
        this.socket.emit("userSendPrivate", {
          message: this.privateMessage
        });
      }

      this.resetPrivate();
    },
    resetPrivate() {
      this.privateMessage.type = "";
      this.userInputPrivateMsg = "";
      this.privateMessage.user = "";
      this.privateMessage.text = "";
      this.privateMessage.userImage = "";
      this.privateMessage.timestamp = "";
    },
    userIsTyping() {},
    userAreTyping() {},
    stoppedTyping() {},
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },
    async privateWinToggle() {
      /*
      if (this.privateWin === false) {
        
        
          await this.$store.dispatch("updateFriendList", {
          userId: this.$store.getters.user.userId
        });
        
      
      }
      
        
        if (this.$store.getters.friendsList != null) {
        this.addedFriends = this.$store.getters.friendsList;
        if (this.addedFriends[0] === null) {
          this.addedFriends = [];
        }
      }
      */
      this.privateWin = !this.privateWin;
      this.friendInPrivateClicked = false;
      this.friendInPrivateNotClicked = true;
    },
    async listFriends() {
       await this.$store.dispatch("getFriendList", {
        userId: this.$store.getters.user.userId
      });

      await this.$store.dispatch("updateFriendList", {
        userId: this.$store.getters.user.userId
      });

      if (this.$store.getters.friendsList != null) {
        this.addedFriends = this.$store.getters.friendsList;
        if (this.addedFriends[0] === null) {
          this.addedFriends = [];
        }
      }
      for (let i = 0; i < this.addedFriends.length; i++) {
        alert(this.addedFriends[i].friendPic);
        if (this.addedFriends[i].friendGender === "Female") {
          this.friendGender = 0;
        } else {
          this.friendGender = 1;
        }
      }
      this.friendList = true;
      this.privateWinToggle();
    },
    dragMouseDown: function(event) {
      event.preventDefault();
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      document.onmousemove = this.elementDrag;
      document.onmouseup = this.closeDragElement;
    },
    elementDrag: function(event) {
      event.preventDefault();
      this.positions.movementX = this.positions.clientX - event.clientX;
      this.positions.movementY = this.positions.clientY - event.clientY;
      this.positions.clientX = event.clientX;
      this.positions.clientY = event.clientY;
      // set the element's new position:
      this.$refs.draggableContainer.style.top =
        this.$refs.draggableContainer.offsetTop -
        this.positions.movementY +
        "px";
      this.$refs.draggableContainer.style.left =
        this.$refs.draggableContainer.offsetLeft -
        this.positions.movementX +
        "px";
    },
    closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
};
</script>
<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}

.chat {
  width: 800px;
}

.bubble {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 0 6px #ffffff;
  display: inline-block;
  padding: 10px 18px;
  position: relative;
  vertical-align: top;
}

.bubble::before {
  background-color: #ffffff;
  content: "\00a0";
  display: block;
  height: 16px;
  position: absolute;
  top: 11px;
  transform: rotate(29deg) skew(-35deg);
  -moz-transform: rotate(29deg) skew(-35deg);
  -ms-transform: rotate(29deg) skew(-35deg);
  -o-transform: rotate(29deg) skew(-35deg);
  -webkit-transform: rotate(29deg) skew(-35deg);
  width: 20px;
}

.me {
  background-color: #3949ab;
  float: left;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin: 5px 45px 5px 20px;
}

.me::before {
  background-color: #3949ab;
  box-shadow: -2px 2px 2px 0 rgba(255, 255, 255, 0.425);
  left: -9px;
}

.you {
  float: right;
  margin: 5px 20px 5px 45px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.you::before {
  box-shadow: 2px -2px 2px 0 rgba(253, 253, 255, 0.411);
  right: -9px;
}

#draggable-container {
  position: absolute;
  z-index: 9;
}
#draggable-header {
  z-index: 10;
}


</style>
