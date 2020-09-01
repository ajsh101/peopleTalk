<template>
  <v-layout row justify-center>
    <v-dialog persistent v-model="$store.getters.notify" max-width="290">
      <v-card>
        <v-card-title class="success headline">Password Recovery.</v-card-title>
        <v-card-text>
          <p>A confirmation email is just sent to you.</p>
          <p>
            Please, click on the link provided in email to reset your password.
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="blue accent-3" @click.native.stop="onClick">
            <span>Login</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$emit("closeNotification");
    }
  }
};
</script>
