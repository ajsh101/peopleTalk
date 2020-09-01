<template>
  <div>
    <user-signup></user-signup>
  </div>
</template>

<script>
import Signup from "@/components/User/Signup.vue";
export default {
  components: {
    "user-signup": Signup
  }
};
</script>
