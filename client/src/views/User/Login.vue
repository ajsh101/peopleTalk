<template>
  <div>
    <user-login></user-login>
  </div>
</template>

<script>
import Login from "@/components/User/Login.vue";
export default {
  components: {
    "user-login": Login
  }
};
</script>
