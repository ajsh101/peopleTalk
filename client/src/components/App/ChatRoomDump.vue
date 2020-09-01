<template>
  <v-container grid-list-xl text-xs-center>
    <v-layout row wrap justify-end v-if="privateWin">
      <v-flex xs12 sm5 md5 offset-xs0 offset-lg2>
        <v-card>
          <v-card v-if="privateWin">
            <div>
              <template>
                <v-row align="center">
                  <v-list :dense="dense" :three-line="threeLine" :nav="nav" :avatar="avatar">
                    <v-subheader>Messages</v-subheader>
                    <v-list-item-group v-model="item" color="primary">
                      <v-list-item v-for="(item, i) in items" :key="i">
                        <v-list-item-avatar v-if="avatar">
                          <v-img :src="item.avatar"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-html="item.title"></v-list-item-title>
                          <v-list-item-subtitle v-if="twoLine || threeLine" v-html="item.subtitle"></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-row>
              </template>
            </div>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
            </div>
          </v-card>
        </v-card>
      </v-flex>
    </v-layout>

    <v-tooltip top color="primary">
      <template v-slot:activator="{ on }">
  <!--v-btn color="white" small bottom right fixed icon v-on="on" @click="privateWinToggle">
    <v-icon color="red">chat</v-icon>
  </v-btn-->
</template>
      <span>Direct Messages</span>
    </v-tooltip>
  </v-container>
</template>

<script>
export default {
  components: {},
  data: () => ({
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
    threeLine: true,
    nav: true,
    avatar: true,
    dialog: false,
    privateWin: false,
    addedFriends: [],
    right: null
  }),
  methods: {
    async privateWinToggle() {
      if (this.privateWin === false) {
        /* 
          #this needs to be uncommented later
          await this.$store.dispatch("updateFriendList", {
          userId: this.$store.getters.user.userId
        });
        */
      }
      /*
        #this needs to be uncommented later
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
</script>