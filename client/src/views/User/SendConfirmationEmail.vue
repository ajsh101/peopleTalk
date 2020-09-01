<template>
  <div>
    <send-mail></send-mail>
  </div>
</template>

<script>
import SendConfirmationEmail from "@/components/User/SendConfirmationEmail.vue";
export default {
  components: {
    "send-mail": SendConfirmationEmail
  }
};
</script>
