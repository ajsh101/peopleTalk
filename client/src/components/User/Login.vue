<template>
  <v-app id="inspire" style="background: #eee;">
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
      <v-container class="pa-0 ml-3" fluid fill-height>
        <v-layout row justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-card-text>
                <div
                  class="font-weight-light headline text-capitalize primary--text"
                  color="#0C755B"
                >
                  Login
                </div>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    class="mt-0"
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
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <div>
                  <v-btn
                    to="/signup"
                    text
                    class="font-weight-regular subheading text-capitalize"
                    color="#0C755B"
                    small
                    >Need an Account?</v-btn
                  >
                  <v-btn
                    to="/forgotPassword"
                    text
                    class="font-weight-regular subheading text-capitalize"
                    color="#0C755B"
                    small
                    >Forget Password</v-btn
                  >
                </div>
                <v-spacer></v-spacer>
                <div>
                  <v-btn
                    :disabled="!valid"
                    @click="submit"
                    class="font-weight-regular subheading text-capitalize white--text"
                    color="#0C755B"
                    >Login</v-btn
                  >
                </div>
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
  data: () => ({
    totalOnlineUsers: [],
    totalUserLength: null,
    valid: false,
    User: {
      name: "",
      password: ""
    },
    nameRules: [
      v => !!v || "Name is required"
      //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    passwordRules: [
      v => !!v || "Passoword is required"
      //v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ]
  }),
  props: {
    source: String
  },
  created: function() {},
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        const loginUser = {
          username: this.User.name,
          password: this.User.password
        };
        this.$store.dispatch("loginUserUp", loginUser);
      }
    },
    onHit() {
      //console.log("Dismissed Alert");
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
        this.$router.push("/dashboard");

        console.log("###Somone trying to login######");
      }
    }
  }
};
</script>
