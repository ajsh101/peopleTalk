<template>
  <div>
    <user-already-online></user-already-online>
  </div>
</template>

<script>
import UserAlreadyOnline from "@/components/User/UserAlreadyOnline.vue";
export default {
  components: {
    "user-already-online": UserAlreadyOnline
  }
};
</script>
