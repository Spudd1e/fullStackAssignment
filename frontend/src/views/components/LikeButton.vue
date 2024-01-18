<template>
  <div
    class="flex w-1/12 items-center justify-evenly rounded-lg bg-[#DDDDDD] p-2 transition-colors hover:cursor-pointer hover:bg-[#CCCCCC] dark:bg-[#3b3b3f] hover:dark:bg-[#4b4b4f] max-sm:w-1/4 max-sm:p-1"
    @click="toggleLike"
  >
    <div class="w-5/12 max-sm:w-1/3">
      <font-awesome-icon
        icon="thumbs-up"
        v-if="liked"
        class="text-violet-400 transition-colors"
      />

      <font-awesome-icon
        icon="thumbs-up"
        class="text-[#999999] transition-colors dark:text-white"
        v-else
      />
    </div>
    <div class="5/12 dark:text-white text-black transition-colors">
      <p>{{ likes }}</p>
    </div>
  </div>
</template>

<script>
import { socialService } from "../../services/social.service";

export default {
  props: ["liked", "post_id", "likes"],
  inject: ["emitter"],
  methods: {
    toggleLike() {
      if (this.$props.liked == true) {
        this.handleUnlike();
      } else {
        this.handleLike();
      }
    },
    handleLike() {
      if (localStorage.getItem("user_id")) {
        socialService
          .likePost(this.$props.post_id)
          .then((response) => {
            this.emitter.emit("updateProfile");
            this.emitter.emit("updateLike" + this.$props.post_id);
          })
          .catch((error) => {});
      } else {
        this.emitter.emit("login");
      }
    },
    handleUnlike() {
      if (localStorage.getItem("user_id")) {
        socialService
          .unlikePost(this.$props.post_id)
          .then((response) => {
            this.emitter.emit("updateProfile");
            this.emitter.emit("updateLike" + this.$props.post_id);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.emitter.emit("login");
      }
    },
  },
};
</script>
