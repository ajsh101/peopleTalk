<template>
  <nav>
    <v-app-bar app color="primary" dense dark>
      <v-toolbar-title>
        <span class="font-weight-light">People</span>
        <span>Talk</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <!--v-on:click="dialog = !dialog"-->
        <v-btn
          class="font-weight-regular text-capitalize"
          v-on:click="onDialogueOpen"
          @mouseover="simulateClick()"
          text
          v-for="item in menuItems_a"
          :key="item.title"
          :to="item.link"
        >
          <v-icon class="ma-1" small left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn
          class="font-weight-regular text-capitalize"
          text
          v-on:click="listFriends"
          v-if="userIsAuthenticated"
        >
          <v-icon class="ma-1" small left>supervisor_account</v-icon>
          My Friends
        </v-btn>

        <v-btn
          class="font-weight-regular text-capitalize"
          text
          v-for="item in menuItems_b"
          :key="item.title"
          :to="item.link"
        >
          <v-icon small class="ma-1" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>

        <v-btn
          class="font-weight-regular text-capitalize"
          text
          @click="onLogout"
          v-if="userIsAuthenticated"
          to="/login"
        >
          <v-icon class="ma-1" small left>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-layout row justify-center>
      <v-dialog v-model="friendList" max-width="600">
        <v-card>
          <div>
            <v-data-table
              :search="search"
              :headers="headers"
              :items="addedFriends"
              :page.sync="page"
              :items-per-page="5"
              class="elevation-1"
              @page-count="pageCount = $event"
              hide-default-footer
              no-data-text="You have no one as a friend yet."
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>My Friends</v-toolbar-title>

                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    hide-details
                  ></v-text-field>
                </v-toolbar>
              </template>
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.name">
                    <td>
                      <v-avatar size="36">
                        <img :src="item.friendPic" alt="John" />
                      </v-avatar>
                    </td>
                    <td>
                      <div v-if="item.friendGender === 'Male'">
                        {{ item.friendName }}
                        <sup
                          ><v-icon small dark color="primary"
                            >fa-mars</v-icon
                          ></sup
                        >
                      </div>

                      <div v-else>
                        {{ item.friendName }}
                        <sup
                          ><v-icon small dark color="pink"
                            >fa-venus</v-icon
                          ></sup
                        >
                      </div>
                    </td>
                    <td>
                      <div v-if="item.friendOnline">
                        <v-icon color="green">
                          mdi-wifi
                        </v-icon>
                      </div>

                      <div v-else>
                        <v-icon color="grey">
                          mdi-wifi-off
                        </v-icon>
                      </div>
                    </td>
                    <td>
                      <v-icon
                        color="primary"
                        @click="deleteFriend(item.friendId)"
                      >
                        message
                      </v-icon>
                    </td>

                    <td>
                      <v-icon
                        color="error"
                        @click="deleteFriend(item.friendId)"
                      >
                        delete
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>

              <template v-slot:no-results>
                Your search for "{{ search }}" found no results.
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-layout>

    <v-dialog v-model="dialog" persistent width="800px">
      <v-card>
        <v-card-title class="grey lighten-4 title primary--text headline">
          Update Profile
        </v-card-title>
        <v-container grid-list-sm class="pa-4 ma-0">
          <v-layout v-if="error" row justify-center>
            <v-flex xs12 sm8 md4 v-if="error">
              <div class="text-xs-center">
                <pass-wrong @invalidPass="onHit"></pass-wrong>
              </div>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex v-model="avatarImg" xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="100px" class="mr-3">
                  <img :src="avatarImg" alt="profile_pic" />
                  <!--//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png-->
                </v-avatar>
              </v-layout>
            </v-flex>

            <v-flex>
              <v-form ref="form2" v-model="valid" lazy-validation>
                <v-text-field
                  ref="text"
                  v-model="displayName"
                  :rules="nameRules"
                  placeholder="user name"
                ></v-text-field>
              </v-form>
            </v-flex>
            <v-flex xs12 sm4>
              <v-select
                v-model="gender"
                :items="dropdown_icon"
                label="Gender"
                class="mt-1 ml-5 pl-2"
              >
              </v-select>
            </v-flex>
            <v-flex xs6 sm4>
              <v-file-input
                v-model="pickPic"
                flat
                rounded
                hint="upload pic"
                outlined
                :rules="picRules"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an avatar"
                prepend-icon="mdi-camera"
                ref="fileInput"
                label="Select Pic"
                @change="onFilePicked"
              >
              </v-file-input>

              <!--v-btn
                raised
                class="primary mt-4 ml-5 text-capitalize"
                @click="onPickFile"
                >Upload Image
                </v-btn
              -->
            </v-flex>
            <!--v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
                mask="phone"
              ></v-text-field>
            </v-flex-->
            <v-flex xs12>
              <v-form ref="form1" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="userAbout"
                  :rules="signRules"
                  prepend-icon="notes"
                  placeholder="About Me"
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>

        <v-card-actions>
          <v-btn color="primary text-capitalize" @click="onPass"
            >Change Password</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn color="primary text-capitalize" @click="dialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="primary text-capitalize"
            :disabled="!valid"
            @click="onUpload"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent v-model="imgCropper" max-width="800px">
      <v-card class="black">
        <!--vue-cropper
          
            ref="cropper"
            
            :aspectRatio="1"
            :src="imageUrl"
            alt="userImage"
          >
          </vue-cropper-->

        <cropper
          classname="cropper"
          ref="cropper"
          maxWidth="80"
          maxHeight="80"
          :src="imageUrl"
          :stencilProps="{
            aspectRatio: 1
          }"
          @change="change"
        >
        </cropper>

        <div class="text-center">
          <v-btn
            @click="cropImage"
            class="mx-2 ma-3"
            fab
            small
            dark
            color="transparent"
          >
            <v-icon dark>mdi-upload</v-icon>
          </v-btn>

          <v-btn
            @click="imgCropper = false"
            class="mx-2 ma-3"
            fab
            small
            dark
            color="transparent"
          >
            <v-icon dark>cancel</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog1" width="400px">
      <v-card>
        <v-card-title class="grey lighten-4 title primary--text headline">
          Reset Password
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            @submit.prevent="submit"
            v-model="valid"
            lazy-validation
          >
            <v-text-field
              v-model="oldPassword"
              :rules="passwordRules"
              prepend-icon="lock"
              name="password"
              label="Enter current Password"
              :append-icon="show1 ? 'visibility_off' : 'visibility'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              prepend-icon="lock"
              name="password"
              label="Enter new Password"
              :append-icon="show1 ? 'visibility_off' : 'visibility'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              :error-messages="emailMatchError()"
              prepend-icon="lock"
              name="confirm_password"
              label="Confirm Password"
              :append-icon="show1 ? 'visibility_off' : 'visibility'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
              required
            >
            </v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary text-capitalize" @click="onPass"
                >Cancel</v-btn
              >
              <v-btn
                color="primary text-capitalize"
                :disabled="!valid"
                @click="onResetPassword"
                >Reset Password</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </nav>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
//import vueCustomScrollbar from "vue-custom-scrollbar";

//import Vuebar from 'vuebar';
//import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
//import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';

export default {
  components: {
    Cropper

    //vueCustomScrollbar

    //PerfectScrollbar
  },

  mounted() {},
  data: () => ({
    canvas: null,
    imgCropper: false,
    oldPassword: "",
    password: "",
    confirmPassword: "",
    valid: false,
    show: false,
    show1: false,
    friendList: false,
    friendGender: null,
    displayName: "",
    gender: "",
    userAbout: "",
    imageCrop: null,
    image: null,
    pickPic: null,
    imageUrl: null,
    avatarImg: null,
    dialog: false,
    dialog1: false,
    search: "",
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers: [
      {
        text: "Name",
        sortable: false,
        value: "friendName"
      }
    ],
    addedFriends: [],
    dropdown_icon: [
      { text: "Male", callback: () => console.log("male") },
      { text: "Female", callback: () => console.log("female") }
    ],
    picRules: [
      value =>
        !value ||
        value.size < 5000000 ||
        "Avatar size should be less than 5 MB!"
    ],
    nameRules: [
      v => !!v || "Name is required"
      //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    signRules: [
      v => !!v || "Name is required"
      //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    passwordRules: [v => !!v || "Password is required."],
    confirmPasswordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 6) || "Minimum characters in password must be 6."
    ]
  }),

  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    menuItems_a() {
      let menuItems = [];
      if (this.userIsAuthenticated) {
        menuItems = [
          { icon: "person", title: "My Profile", link: "#" }
          //{icon: 'logout', title: 'Logout', link: '/login'}
        ];
        //console.log(menuItems[0]);
      }
      return menuItems;
    },
    menuItems_b() {
      let menuItems = [
        { icon: "fa-user-plus", title: "Sign up", link: "/signup" },
        { icon: "lock_open", title: "Login", link: "/login" }
      ];
      if (this.userIsAuthenticated) {
        menuItems = [
          //{ icon: "supervisor_account", title: "Friends", link: "/dashboard" },
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
    },

    async deleteFriend(friendId) {
      alert(friendId);
      await this.$store
        .dispatch("deleteFriend", {
          userId: this.$store.getters.user.userId,
          friendId: friendId
        })
        .then(
          function() {
            let pos = this.addedFriends
              .map(function(e) {
                return e.friendId;
              })
              .indexOf(friendId);
            alert(pos);
            this.addedFriends.splice(pos, 1);
          }.bind(this)
        );
    },

    logScrollLayout(scrollLayout) {
      console.log("scrollLayout:", scrollLayout);
    },
    onHit() {
      console.log("Dismissed Alert");
      this.$store.dispatch("clearError");
    },
    emailMatchError() {
      return this.password === this.confirmPassword
        ? ""
        : "Password must match";
    },
    simulateClick() {
      const profileData = {
        displayName: this.displayName,
        gender: this.gender,
        userAbout: this.userAbout,
        image: this.image
      };
      this.$store.dispatch("userInfo", profileData);
      this.displayName = this.$store.getters.user.displayName;
      this.gender = this.$store.getters.user.gender;
      this.userAbout = this.$store.getters.user.userAbout;
      this.imageUrl = this.$store.getters.user.userImage;
      this.avatarImg = this.imageUrl;
    },
    onDialogueOpen() {
      const profileData = {
        displayName: this.displayName,
        gender: this.gender,
        userAbout: this.userAbout,
        image: this.image
      };
      this.$store.dispatch("userInfo", profileData);
      this.displayName = this.$store.getters.user.displayName;
      this.gender = this.$store.getters.user.gender;
      this.userAbout = this.$store.getters.user.userAbout;
      this.imageUrl = this.$store.getters.user.userImage;
      this.avatarImg = this.imageUrl;
      this.dialog = !this.dialog;
    },
    onPass() {
      this.dialog1 = !this.dialog1;
    },
    onLogout() {
      this.$store.dispatch("logOutUserUp");
    },
    //onPickFile() {
    //this.$refs.fileInput.click();
    //},
    onFilePicked() {
      //alert(this.pickPic.name);
      console.log(this.pickPic);
      if (this.pickPic != null) {
        const files = this.pickPic;

        //let filename = files.name;

        const fileReader = new FileReader();

        fileReader.addEventListener("load", () => {
          this.imageUrl = fileReader.result;

          this.pickPic = null;
          //this.$refs.cropper.replace(this.imageUrl);
        });

        this.imgCropper = true;
        fileReader.readAsDataURL(files);
        this.image = files;
        this.imageCrop = files.name;
      }
    },
    change({ coordinates, canvas }) {
      console.log(coordinates, canvas);
      console.log(this.$refs.cropper);
      this.canvas = canvas;

      //this.imageUrl = canvas.toDataURL();
      //this.avatarImg = this.imageUrl;
    },

    cropImage() {
      //this.imageUrl = this.$refs.cropper.canvas.toDataURL();
      this.imageUrl = this.canvas.toDataURL();
      this.avatarImg = this.imageUrl;
      this.imgCropper = false;
      this.image = this.canvas.toDataURL();
      this.image = this.cropImgFile(this.image, this.imageCrop);
      this.imageUrl = null;
    },

    cropImgFile(dataurl, filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    onUpload() {
      // Native form submission is not yet supported
      const profileData = {
        displayName: this.displayName,
        gender: this.gender,
        userAbout: this.userAbout,
        image: this.image
      };

      if (this.$refs.form2.validate() && this.$refs.form1.validate()) {
        this.$store.dispatch("userPicUpload", profileData);
        this.dialog = false;
      }

      //},
      //onUpload() {
      //  const fd = new FormData();
      //  fd.append('image', t  his.image, this.image.name);
      //  axios.post('', fd)
      //    .then(res => {
      //      console.log(res);
      //    });
      //}
    },
    onResetPassword() {
      if (this.$refs.form.validate()) {
        const userPass = {
          oldPassword: this.oldPassword,
          password: this.confirmPassword
        };
        //console.log(typeof newUser);
        this.$store.dispatch("resetPasswd", userPass);
        this.dialog1 = false;
      }
    }
  },
  watch: {
    user(value) {
      if (value) {
        console.log("###Profile Updated######");
      }
    }
  }
};
//color navbar #B71C1C
</script>
<style>
.scroll-area {
  position: relative;
  margin: auto;
}

.cropper {
  height: 420px;
}
</style>
