<template>
  <chat-window :showAddRoom="showAddRoom" :currentUserId="currentUserId" :rooms="rooms" :messages="messages" />
</template>


<script>

import ChatWindow from 'vue-advanced-chat'
  import 'vue-advanced-chat/dist/vue-advanced-chat.css'

  export default {
    components: {
      ChatWindow
    },
    data() {
      return {
        showAddRoom: false,
        rooms: [],
        messages: [],
        currentUserId: 1234
      }
    }
  }
</script>
