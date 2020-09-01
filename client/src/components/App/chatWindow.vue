<template>
  <div class="text-center">
    <v-row justify="center" align="center">
      <v-container fluid>
        <v-dialog width="600" persistent overlay-opacity="100" v-model="privateWin" hide-overlay>
          <VueDragResize
            :isActive="true"
            :isResizable="false"
            :x="600"
            :y="100"
            :minw="199"
            :w="600"
          >
            <v-card class="mb-6" width="600" color="red">
              <v-system-bar color="orange" :height="heightSysBar">
                <v-icon>mdi-message</v-icon>
                <span>10 unread messages</span>
                <v-spacer></v-spacer>
                <v-icon>mdi-minus</v-icon>
                <v-btn class="ma-0" small right text dark color="red" v-on:click="privateWinToggle">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-system-bar>
              <v-row no-gutters>
                <v-col v-for="n in 2" :key="n" :cols="n === 1 ? 4 : 8">
                  <v-card v-if="n === 1" class="pa-2 overflow-y-auto" tile outlined>
                    <v-list height="300" :dense="dense" :nav="nav" :avatar="avatar">
                      <v-subheader>Messages</v-subheader>
                      <v-list-item-group v-model="item" color="primary">
                        <v-list-item
                          v-for="(item, i) in items"
                          :key="i"
                          v-on:click="chatHistory = !chatHistory"
                        >
                          <v-list-item-avatar v-if="avatar" class="ma-1">
                            <v-img :src="item.avatar"></v-img>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title v-html="item.title"></v-list-item-title>
                            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card>
                  <v-card v-else-if="n === 2">something here and here</v-card>
                </v-col>
              </v-row>
            </v-card>
          </VueDragResize>
        </v-dialog>
      </v-container>
    </v-row>

    <v-tooltip left color="primary">
      <template v-slot:activator="{ on }">
        <v-btn
          class="ma-5"
          v-on="on"
          right
          small
          bottom
          fab
          color="green"
          fixed
          v-on:click="privateWinToggle"
        >
          <v-badge>
            <template v-slot:badge>0</template>
            <v-icon>mdi-email</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <span text--color="red">Exit</span>
    </v-tooltip>
  </div>
</template>

<script>
import VueDragResize from "vue-drag-resize";
export default {
  components: {
    VueDragResize
  },
  data: () => ({
    listWidth: 400,
    listHeight: 500,
    offsetTop: 0,
    heightSysBar: 30,
    item: 5,
    items: [
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle:
          "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle:
          "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Birthday gift",
        subtitle:
          "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Recipe to try",
        subtitle:
          "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      }
    ],
    dense: true,
    nav: true,
    avatar: true,
    dialog: false,
    privateWin: false,
    addedFriends: [],
    right: null,
    chatHistory: false
  }),

  methods: {
    onScroll(e) {
      this.offsetTop = e.target.scrollTop;
    },

    async privateWinToggle() {
      /*
      if (this.privateWin === false) {
        
        
          await this.$store.dispatch("updateFriendList", {
          userId: this.$store.getters.user.userId
        });
        
      
      }
      
        
        if (this.$store.getters.friendsList != null) {
        this.addedFriends = this.$store.getters.friendsList;
        if (this.addedFriends[0] === null) {
          this.addedFriends = [];
        }
      }
      */
      this.privateWin = !this.privateWin;
    }
  }
};

//#27: <v-scroll:#scroll-target="onScroll">
</script>

