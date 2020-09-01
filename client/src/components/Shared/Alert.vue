<template>
  <!--div>
    <v-chip color="red" close @input="onClose" :value="true" text-color="white">
      Email or Username already registerd. Please login to continue.
    </v-chip>
  </div-->
  <v-card>
    <v-snackbar v-model="snackbar" top>
      Email or Username already registerd. Please login to continue.
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
    onClose() {
      this.$emit("dismissed");
    }
  }
};
</script>
