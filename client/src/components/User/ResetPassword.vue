<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="pa-0 ml-5">
        <v-layout v-if="error" row justify-center>
          <v-flex xs12 sm8 md4 v-if="error">
            <div class="text-xs-center">
              <login-alert-error @invalidLogin="onHit"></login-alert-error>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid class="pa-0 ma-0">
        <v-layout row justify-center>
          <div></div>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-card-text>
                <v-form
                  ref="form"
                  @submit.prevent="submit"
                  v-model="valid"
                  lazy-validation
                >
                  <h2 class="ma-0 pl-3 headline primary--text">
                    Reset Password
                  </h2>
                  <v-text-field
                    v-model="User.name"
                    :rules="nameRules"
                    prepend-icon="person"
                    name="login"
                    label="Username or email"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="User.password"
                    :rules="passwordRules"
                    id="password"
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
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!valid"
                  class="subheading text-capitalize"
                  @click="submit"
                  color="primary"
                  >Change Paasword
                  <app-loading></app-loading>
                  <pass-changed
                    v-model="show"
                    @closeNotification="onClose"
                  ></pass-changed>
                </v-btn>
              </v-card-actions>
            </v-card>
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
      password: "",
      confirmPassword: ""
    },
    nameRules: [
      v => !!v || "Name is required"
      //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
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
        const newPassword = {
          username: this.User.name,
          password: this.User.password
        };
        //console.log(typeof newUser);
        this.$store.dispatch("newPassword", newPassword);
      }
    },
    onDismissed() {
      console.log("Dismissed Alert");
      this.$store.dispatch("clearError");
    },
    onClose() {
      this.$store.dispatch("clearNotification");
      //this.$router.push("/login");
    },
    onHit() {
      console.log("Dismissed Alert");
      this.$store.dispatch("clearError");
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
        this.$router.push("/login");
      }
    }
  }
};
</script>
