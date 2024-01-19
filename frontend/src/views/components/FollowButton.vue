<template>
  <div
    v-if="isFollowing"
    @click="unfollowUser"
    class="flex w-full items-center justify-center rounded-lg bg-violet-500 p-2 text-center text-lg text-white transition hover:cursor-pointer hover:bg-violet-700 dark:bg-violet-800 dark:hover:bg-violet-700"
  >
    <font-awesome-icon icon="user-minus" />
  </div>
  <div
    v-if="!isFollowing"
    @click="followUser"
    class="flex w-full items-center justify-center rounded-lg bg-violet-500 p-2 text-center text-lg text-white transition hover:cursor-pointer hover:bg-violet-700 dark:bg-violet-800"
  >
    <font-awesome-icon icon="user-plus" />
  </div>
</template>
<script>
import { socialService } from "../../services/social.service";

export default {
  props: ["isFollowing", "author"],
  inject: ["emitter"],
  data() {
    return {};
  },
  methods: {
    followUser() {
      socialService.followUser(this.$props.author).then((response) => {
        this.emitter.emit("updateProfile");
        this.emitter.emit("loadFeed");
      });
    },
    unfollowUser() {
      socialService.unFollowUser(this.$props.author).then((response) => {
        this.emitter.emit("updateProfile");

        this.emitter.emit("loadFeed");
      });
    },
  },
};
</script>
