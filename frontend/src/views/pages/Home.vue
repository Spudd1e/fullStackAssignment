<template>
  <div class="flex max-h-screen w-[80vw] flex-col items-center">
    <div class="flex h-full w-full flex-col items-center">
      <button
        v-if="isLoggedIn"
        @click="newPost"
        class="m-2 w-3/4 rounded-lg bg-violet-900 p-2 text-white transition hover:bg-violet-900"
      >
        New Post
      </button>

      <Feed class="mt-2" :followingList="followingList" />
    </div>
    <router-view />
  </div>
</template>

<script>
import Feed from "../components/Feed.vue";
import ModalView from "../components/ModalView.vue";
import UserSearch from "../components/UserSearch.vue";
import { userService } from "../../services/user.service";

export default {
  inject: ["emitter"],
  data() {
    return {
      followingList: [],
      isLoggedIn: localStorage.getItem("user_id"),
    };
  },
  mounted() {
    this.emitter.on("updateFollowing", () => {
      this.getFollowing();
    });
    this.emitter.emit("loadFeed");
  },
  unmounted() {
    this.emitter.off("updateFollowing");
  },
  methods: {
    newPost() {
      this.emitter.emit("newPost", [null, null]);
    },
    getFollowing() {
      if (localStorage.getItem("user_id")) {
        userService
          .getSingleUser(localStorage.getItem("user_id"))
          .then((user) => {
            this.followingList = [];
            user.following.forEach((user) => {
              this.followingList.push(user.user_id);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  components: { Feed, UserSearch, ModalView },
};
</script>
