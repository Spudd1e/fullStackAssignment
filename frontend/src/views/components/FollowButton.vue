<template>
  <div
    v-if="isFollowing"
    @click="unfollowUser"
    class="w-30 w-fit rounded-lg bg-violet-900 p-2 text-center text-sm text-white hover:cursor-pointer hover:bg-violet-700"
  >
    <b>Following</b>
  </div>
  <div
    v-if="!isFollowing"
    @click="followUser"
    class="w-30 w-fit rounded-lg bg-violet-900 p-2 text-center text-sm text-white hover:cursor-pointer hover:bg-violet-700"
  >
    <p>Follow</p>
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
