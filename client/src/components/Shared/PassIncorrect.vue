<template>
  <!--div>
    
    <v-chip color="red" close @input="onPush" :value="true" text-color="white">
      The current password entered is wrong. Plese provide correct password.
    </v-chip>
  </div-->

  <v-card>
    <v-snackbar v-model="snackbar" top>
      The current password entered is wrong. Plese provide correct password.
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
      this.$emit("invalidPass");
    }
  }
};
</script>
