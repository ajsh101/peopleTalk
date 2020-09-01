<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="pa-0 ma-0">
        <v-layout v-if="error">
          <v-flex xs12 sm8 md4 v-if="error">
            <div class="text-xs-center">
              <app-alert @dismissed="onDismissed"></app-alert>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid class="pa-0 ml-0">
        <v-layout row justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-card-text>
                <h2 class="ma-0 pl-3 headline primary--text">Sign Up</h2>
                <v-form
                  ref="form"
                  @submit.prevent="submit"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="User.email"
                    :rules="emailRules"
                    prepend-icon="person"
                    name="usrEmail"
                    label="Enter email"
                    type="email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="User.name"
                    :rules="nameRules"
                    prepend-icon="person"
                    name="usrName"
                    label="Choose username"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="User.password"
                    :rules="passwordRules"
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    required
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="User.confirmPassword"
                    :rules="confirmPasswordRules"
                    id="confirm_password"
                    prepend-icon="lock"
                    name="confirm_password"
                    label="Confirm Password"
                    :append-icon="show1 ? 'visibility_off' : 'visibility'"
                    :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1"
                    required
                  >
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div>
                  <v-btn
                    to="/login"
                    flat
                    class="font-weight-medium text-capitalize"
                    small
                    color="primary"
                    >Already got an Account?</v-btn
                  >
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!valid"
                  @click="submit"
                  class="subheading text-capitalize"
                  color="primary"
                  >Sign Up
                  <app-loading></app-loading>
                  <app-notify
                    v-model="show"
                    @closeNotification="onClose"
                  ></app-notify>
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-flex> </v-flex>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: vm => ({
    show: false,
    valid: true,
    show1: false,
    User: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },

    nameRules: [
      v => !!v || "Name is required",
      //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      v => (v && v.length >= 4) || "Name must be minimum of 4 letters.",
      v => (v && v.length <= 8) || "Maximum 8 letter are allowed."
    ],

    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid"
    ],
    passwordRules: [v => !!v || "Password is required."],
    confirmPasswordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 6) || "Minimum characters in password must be 6.",
      confirmPassword =>
        confirmPassword === vm.User.password || "Password must match."
    ]
  }),
  props: {
    source: String
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        const newUser = {
          email: this.User.email,
          username: this.User.name,
          password: this.User.password
        };
        //console.log(typeof newUser);
        this.$store.dispatch("signUserUp", newUser);
      }
    },
    onDismissed() {
      console.log("Dismissed Alert");
      this.$store.dispatch("clearError");
    },
    onClose() {
      this.$store.dispatch("clearNotification");
      this.$router.push("/login");
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  watch: {
    user(value) {
      if (value) {
        this.show = true;
        this.$store.dispatch("unsetUser");
        //this.$router.push('/login');
      }
    }
  }
};
</script>
