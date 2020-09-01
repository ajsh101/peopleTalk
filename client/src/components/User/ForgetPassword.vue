<template>
  <v-app id="inspire">
    <div class="pa-4 ma-4 text-xs-center">
      <v-container class="pa-0 ma-0">
        <v-layout v-if="error" row justify-center>
          <v-flex xs12 sm8 md4 v-if="error">
            <div class="text-xs-center">
              <login-alert-error @invalidLogin="onHit"></login-alert-error>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
      <br />
      <h2 class="display-3 font-weight-light">Reset Password</h2>
      <br />
      <p class="display-2 font-weight-thin">Entered the registered email.</p>
      <br />
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
        <p class="display-1 font-weight-light"></p>
        <br /><br />
        <v-btn :disabled="!valid" @click="submit" color="primary"
          >Send Password Reset Link
          <app-loading></app-loading>
          <pass-changed
            v-model="show"
            @closeNotification="onClose"
          ></pass-changed>
        </v-btn>
      </v-form>
    </div>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    show: false,
    valid: true,
    User: {
      username: ""
    },

    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid"
    ]
  }),
  props: {
    source: String
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        const userEmail = {
          username: this.User.email
        };
        //console.log(typeof newUser);
        this.$store.dispatch("forgetUserPassword", userEmail);
      }
    },
    onDismissed() {
      console.log("Dismissed Alert");
      this.$store.dispatch("clearError");
    },
    onClose() {
      this.$store.dispatch("clearNotification");

      this.$router.push("/login");
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
        //this.$router.push('/login');
      }
    }
  }
};
</script>
