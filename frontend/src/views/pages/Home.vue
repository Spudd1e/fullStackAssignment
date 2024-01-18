<template>
  <div class="h-[85vh] w-screen flex-col items-center">
    <div class="flex h-full w-full flex-col items-center justify-start">
      <div class="flex w-3/4 items-center justify-center dark:text-white">
        <button
          v-if="isLoggedIn"
          @click="newPost"
          class="m-2 w-full rounded-lg bg-violet-800 p-4 transition hover:bg-violet-900"
        >
          New Post
        </button>
        <button
          v-if="isLoggedIn"
          class="m-2 w-fit rounded-lg bg-[#EEEEEE] p-1 transition hover:bg-[#DDDDDD] dark:bg-[#2b2b2f] hover:dark:bg-[#3b3b3f]"
          @click="viewDrafts"
        >
          View Drafts
        </button>
      </div>

      <Feed class="mt-2" :followingList="followingList" />
    </div>
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
    viewDrafts() {
      this.emitter.emit("draftView");
    },
  },
  components: { Feed, UserSearch, ModalView },
};
</script>
