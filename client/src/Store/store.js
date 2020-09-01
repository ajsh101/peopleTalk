import Vue from "vue";
//import Vuex, { Store } from "vuex";
import Vuex from "vuex";
import axios from "axios";
import router from "../router";
Vue.use(Vuex);
const Cookies = require("cookies-js");
let ltoken = null;
//const _ = require("underscore");

export default new Vuex.Store({
  state: {
    User: null,
    Room: null,
    Friend: null,
    FriendList: null,
    userProfile: null,
    loading: false,
    notify: false,
    error: null
  },
  mutations: {
    setUser(state, payload) {
      state.User = payload;
    },

    setFriendList(state, payload) {
      state.FriendList = payload;
    },

    setUserProfile(state, payload) {
      state.userProfile = payload;
    },
    setRoom(state, payload) {
      state.Room = payload;
    },

    setFriend(state, payload) {
      state.Friend = payload;
    },

    setLoading(state, payload) {
      state.loading = payload;
    },
    setNotification(state, payload) {
      state.notify = payload;
    },
    setError(state, payload) {
      state.error = payload;
      //console.log("The #ERROR: " + payload);
    },
    clearError(state) {
      state.error = null;
    },
    clearNotification(state) {
      state.notify = null;
    }
  },
  actions: {
    signUserUp({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", true);
      axios
        .post("http://localhost:3000/user/signup", payload)
        .then(response => {
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          console.log(response);
          commit("setUser", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          commit("setError", error);
          // console.log(payload);
        });
    },
    verifyUserUp({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", true);
      axios
        .post("http://localhost:3000/user/userVerification", payload)
        .then(response => {
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          console.log(response);
          commit("setUser", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          commit("setError", error);
          //console.log(payload);
        });
    },
    loginUserUp({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      //axios
      //  .get("http://localhost:3000/getcsrftoken")
      //  .then(response => {
      //    console.log(response);
      //    //axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken
      //    //console.log("The Csurf token is : #" +response.data.csrfToken);
      //    commit("setLoading", false);
      //    //commit("setNotification", true);
      //    commit("clearError");
      //
      //    //commit("setUser", payload);
      //
      //  })
      //  .catch(error => {
      //    commit("setLoading", false);
      //    //commit("setNotification", false);
      //    commit("setError", error);
      //
      //  });

      axios
        .post("http://localhost:3000/user/login", payload, {
          withCredentials: true
        })
        .then(response => {
          //axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrfToken
          //console.log("THe cookie : " + response.headers);
          ltoken = response.data.userId;
          if (Cookies.enabled) {
            Cookies.set(ltoken, response.data.token, {});
          }
          //console.log("The Csurf token is : #" +response.data.csurfToken);
          commit("setLoading", false);
          //commit("setNotification", true);
          commit("clearError");
          //console.log(payload);
          payload = response.data;
          commit("setUser", payload);
          //alert(payload.userId);
          //dispatch("getFriendList", {userId: payload.userId });
          //console.log(response);
        })
        .catch(error => {
          commit("setLoading", false);
          //commit("setNotification", false);
          commit("setError", error);
          //console.log(error.response.data.message);
          if (error.response.data.log === false) {
            window.location.href = "/sendMail";
          }
          if (error.response.data.log === "isOnline") {
            window.location.href = "/userOnline";
          }
          //console.log(
          //  "#####Error Data##########:" + error.response.data.message
          //);
          //console.log(payload);
        });
    },
    logOutUserUp({ commit }) {
      commit("setLoading", true);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/userLogout")
        .then(response => {
          commit("setLoading", false);
          //console.log(response.data);
          //commit("setNotification", true);
          if (Cookies.enabled) {
            Cookies.expire(ltoken);
          }
          commit("setUser", null);
          console.log(response);
          commit("clearError");
          router.push("/login");
        })
        .catch(error => {
          commit("setLoading", false);
          //commit("setNotification", false);
          commit("setError", error);
          commit("setUser", null);
          // console.log("######TEsting##########");
          router.push("/login");
        });
    },
    userPicUpload({ commit }, payload) {
      commit("setLoading", true);
      //commit("setNotification", true);
      //console.log(payload);
      const fd = new FormData();
      if (payload.image === null) {
        fd.append("userImage", undefined);
      } else {
        fd.append("userImage", payload.image, payload.image.name);
      }
      fd.append("payload", payload.displayName);
      fd.append("payload", payload.gender);
      fd.append("payload", payload.userAbout);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/updateProfile ", fd, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${fd._boundary}`
          }
        })
        .then(response => {
          commit("setLoading", false);
          //commit("setNotification", true);
          commit("clearError");
          //console.log(payload.displayName);
          commit("setUser", response.data);
          console.log(response);
        })
        .catch(error => {
          commit("setLoading", false);
          //commit("setNotification", false);
          commit("setError", error);
          commit("setUser", null);
          router.push("/login");
          //console.log(error.response.data.message);
        });
    },
    userInfo({ commit }, payload) {
      commit("setLoading", true);
      //commit("setNotification", true);
      //console.log(payload);

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/sendProfile")
        .then(response => {
          commit("setLoading", false);
          //console.log(response.data);
          //commit("setNotification", true);

          commit("clearError");
          payload = response.data;
          //console.log("Payload is" + payload);
          commit("setUser", payload);
          //console.log("######GENDER#######: " + payload.gender);
          //console.log(response);
        })
        .catch(error => {
          commit("setLoading", false);
          //commit("setNotification", false);
          commit("setError", error);
          commit("setUser", null);
          //console.log("######TEsting##########");
          router.push("/login");
          //console.log(error.response.data.message);
        });
    },
    userShowProile({ commit }, payload) {
      commit("setLoading", true);
      //commit("setNotification", true);
      console.log(payload);

      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/userShowProfile", payload)
        .then(response => {
          commit("setLoading", false);
          //console.log(response.data);
          //commit("setNotification", true);

          commit("clearError");
          payload = response.data;
          //console.log("Payload is" + payload);
          commit("setUserProfile", payload);
          //console.log("######GENDER#######: " + payload.gender);
          //console.log(response);
        })
        .catch(error => {
          commit("setLoading", false);
          //commit("setNotification", false);
          commit("setError", error);
          commit("setUserProfile", null);
          //console.log("######TEsting##########");
          router.push("/login");
          //console.log(error.response.data.message);
        });
    },
    newPassword({ commit }, payload) {
      commit("setLoading", true);

      //commit("setNotification", true);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get("token");

      axios
        .put("http://localhost:3000/user/updatePassword/", payload)
        .then(response => {
          commit("setLoading", false);
          //commit("setNotification", true);
          commit("clearError");
          //console.log(payload);
          commit("setUser", payload);
          console.log(response.data.message);
        })
        .catch(error => {
          commit("setLoading", false);
          //commit("setNotification", false);
          commit("setError", error);
          //console.log(error.response.data.message);
          //if(error.response.data.log === false) {
          //  window.location.href = "/sendMail";
          //}
          //console.log(payload);
        });
    },
    forgetUserPassword({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", true);
      axios
        .post("http://localhost:3000/user/forgetPaasword", payload)
        .then(response => {
          //console.log(response.data.token);
          if (Cookies.enabled) {
            Cookies.set("token", response.data.token, { expires: 600 });
          }
          //console.log(Cookies.get("token"));
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response);
          commit("setUser", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          commit("setError", error);
          //console.log(payload);
        });
    },
    resetPasswd({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .put("http://localhost:3000/user/resetPasswd", payload)
        .then(response => {
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          console.log(response);
          commit("setUser", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          commit("setError", error);
          //console.log("Password Cant be changed:( @##");
        });
    },
    createRoom({ dispatch, commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/rooms/createRoom", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          let dpatch = payload;
          //console.log(response.data);
          payload = response.data;
          commit("setRoom", payload);
          dispatch("roomInfo", {
            roomname: dpatch.roomname,
            username: dpatch.username,
            password: dpatch.password
          });
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },
    async roomInfo({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      await axios
        .post("http://localhost:3000/rooms/roomInfo", payload)
        .then(response => {
          //router.push("/chatRoom");
          commit("setLoading", false);
          //console.log(response.data);

          console.log("##Payload ROOMINFO##");
          console.log(payload);
          console.log("##Payload ROOMINFO##");
          //commit("setNotification", true);
          // console.log("IS THIS REAL");
          //console.log(response.data);
          commit("clearError");
          payload = response.data;
          console.log(payload);
          //console.log("Payload is" + payload);
          commit("setUser", payload);
          commit("setRoom", payload);
          //console.log(store.getters.user.passCorrect);

          //console.log(response);
        })
        .catch(error => {
          commit("setUser", error.response.data);

          //console.log(store.getters.user.passCorrect)
          commit("setLoading", false);
          commit("setNotification", false);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },
    userAddFriend({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/addFriend", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");

          //console.log(response.data);
          payload = response.data;
          commit("setFriend", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },
    getFriendInfo({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/getFriendInfo", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");

          //console.log(response.data);
          payload = response.data;
          //commit("setFriend", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },
    async getFriendList({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      await axios
        .post("http://localhost:3000/user/getFriendList", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response.data);

          payload = response.data.userId;
          //alert(payload);
          //console.log(payload.friendList);
          //let fList = [];
          //fList = payload.friendList;
          //console.log();
          //payload.friendList = payload.friendList.slice(0, response.data.listLength);
          //dispatch("updateFriendList", { userId: payload });
          //commit("setFriendList", fList);
          //console.log(fList);
          //commit("setFriend", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },
    async updateFriendList({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      await axios
        .post("http://localhost:3000/user/updateFriendList", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response.data);

          payload = response.data;
          //console.log(payload.friendList);
          let fList = [];
          fList = payload.friendList;
          console.log();
          //payload.friendList = payload.friendList.slice(0, response.data.listLength);

          commit("setFriendList", fList);
          console.log(fList);
          //commit("setFriend", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },

    reqAccepted({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/user/reqAccepted", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");

          //console.log(response.data);
          payload = response.data;
          //commit("setFriend", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },
    async deleteFriend({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      await axios
        .post("http://localhost:3000/user/deleteFriend", payload)
        .then(response => {
          //console.log("##Payload CreateROOM##");
          //console.log(payload);
          //console.log("##Payload CREATEROOM##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response.data);

          payload = response.data;

          //console.log(fList);
          //commit("setFriend", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("Room Cant be created");
        });
    },

    leaveRoom({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/rooms/leaveRoom", payload)
        .then(response => {
          //console.log("##Leave Room##");
          //console.log(payload);
          //console.log("##Leave Room##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response);
          payload = response.data;
          commit("setRoom", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("User cant left the room");
        });
    },
    userKicked({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/rooms/leaveRoom", payload)
        .then(response => {
          //console.log("##Leave Room##");
          //console.log(payload);
          //console.log("##Leave Room##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          console.log(response);
          //payload = response.data;
          //commit("setRoom", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("User cant left the room");
        });
    },
    leaveRoomLogout({ dispatch, commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/rooms/leaveRoom", payload)
        .then(response => {
          //console.log("##Leave Room##");
          //console.log(payload);
          //console.log("##Leave Room##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response);
          payload = response.data;
          commit("setRoom", payload);
          dispatch("logOutUserUp");
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("User cant left the room");
        });
    },
    roomClear({ commit }, payload) {
      commit("setLoading", true);
      commit("setNotification", false);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + Cookies.get(ltoken);
      axios
        .post("http://localhost:3000/rooms/roomDelete", payload)
        .then(response => {
          //console.log("##Leave Room##");
          //console.log(payload);
          //console.log("##Leave Room##");
          commit("setLoading", false);
          commit("setNotification", true);
          commit("clearError");
          //console.log(response);
          payload = response.data;
          //commit("setRoom", payload);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setNotification", false);
          //console.log(payload);
          commit("setError", error);
          //console.log("User cant left the room");
        });
    },
    clearError({ commit }) {
      commit("clearError");
    },
    unsetUser({ commit }) {
      commit("setUser", null);
    },
    unsetFriend({ commit }) {
      commit("setFriend", null);
    },
    unsetRoom({ commit }) {
      commit("setRoom", null);
    },
    clearNotification({ commit }) {
      commit("clearNotification");
    }
  },
  getters: {
    user(state) {
      return state.User;
    },
    friendsList(state) {
      return state.FriendList;
    },
    userFriends(state) {
      return state.Friend;
    },
    userProfile(state) {
      return state.userProfile;
    },
    room(state) {
      return state.Room;
    },
    loading(state) {
      return state.loading;
    },
    error(state) {
      console.log("##########Error####### " + state.error);
      return state.error;
    },
    notify(state) {
      return state.notify;
    }
  }
});
