<template>
  <!--
    <div>
    
    <v-chip color="red" close @input="onPush" :value="true" text-color="white">
      Invalid Email or Passowrd. Please register if you dont have account.
    </v-chip>
  </div>
  -->

  <v-card>
    <v-snackbar v-model="snackbar" top>
      Invalid Email or Passowrd. Please register if you dont have account.
      <v-btn color="pink" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    snackbar: true
  }),
  methods: {
    onPush() {
      this.$emit("invalidLogin");
    }
  }
};
</script>
