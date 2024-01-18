<template>
  <div
    class="mb-6 w-full self-center rounded-md transition bg-[#EEEEEE] p-4 text-black hover:scale-105 dark:bg-[#2b2b2f] dark:text-white"
  >
    <div class="flex w-full items-center justify-between">
      <div
        class="flex w-fit items-center rounded-md bg-[#DDDDDD] transition-colors text-black dark:text-white p-2 dark:bg-[#3b3b3f] max-sm:w-full max-sm:justify-between"
      >
        <router-link
          :to="'/users/' + details.author.user_id"
          class="flex items-center text-center"
        >
          <div class="mr-2 flex  flex-col max-sm:text-sm">
            <div class="flex items-center justify-center text-center">
              <h1 class="text-sm">
                {{ details.author.first_name + " " + details.author.last_name }}
              </h1>
              <h1
                class="text-xs text-violet-600 hover:underline dark:text-violet-400"
              >
                @{{ details.author.username }}
              </h1>
            </div>
            <p class="text-sm text-gray-500 max-sm:text-xs">
              {{ formatDate(new Date(details.timestamp)) }}
            </p>
          </div>
        </router-link>

        <div>
          <FollowButton
            v-if="!ownPost && isLoggedIn && !profilePage"
            :isFollowing="following"
            :author="details.author.user_id"
          />
        </div>
      </div>

      <EditPostButton
        v-if="ownPost"
        :post_id="details.post_id"
        :post_text="details.text"
      />
    </div>

    <router-link :to="'/posts/' + details.post_id" :siFollowing="following">
      <div>
        <p class="break-words pt-2 text-lg max-sm:text-sm">
          {{ details.text }}
        </p>
      </div>
    </router-link>
    <div class="flex w-full">
      <div class="flex h-fit w-full items-center p-2 pb-0 pl-0">
        <LikeButton
          :post_id="details.post_id"
          :liked="liked"
          :likes="details.likes.length"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EditPostButton from "./EditPostButton.vue";
import FollowButton from "./FollowButton.vue";
import LikeButton from "./LikeButton.vue";

export default {
  inject: ["emitter"],
  data() {
    return {
      ownPost: false,
      liked: false,
      isLoggedIn: localStorage.getItem("user_id"),
      profilePage: false,
    };
  },
  mounted() {
    if (this.$route.path !== "/") {
      this.profilePage = true;
    }
    this.emitter.on("updateLike" + this.details.post_id, () => {
      this.updateLikes();
      this.emitter.emit("loadFeed");
    });

    if (this.details.author.user_id == this.isLoggedIn) {
      this.ownPost = true;
    }
    this.updateLikes();
  },
  unmounted() {
    this.emitter.off("updateLike" + this.details.post_id);
  },
  methods: {
    updateLikes() {
      this.$props.details.likes.forEach((like) => {
        if (like.user_id == localStorage.getItem("user_id")) {
          this.liked = true;
        }
      });
    },

    formatDate(date) {
      let day = date.getDate().toString().padStart(2, "0");
      let month = date.getMonth() + 1;
      month = month.toString().padStart(2, "0");
      let year = date.getFullYear();
      let hour = date.getHours().toString().padStart(2, "0");
      let minutes = date.getMinutes().toString().padStart(2, "0");

      return day + "/" + month + "/" + year + " at " + hour + ":" + minutes;
    },
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
    following: {
      required: false,
      type: Boolean,
    },
  },
  components: { LikeButton, FollowButton, EditPostButton },
};
</script>
