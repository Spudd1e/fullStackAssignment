<template>
  <div
    v-if="isFollowing"
    @click="unfollowUser"
    class="w-full rounded-lg bg-violet-800 p-2 text-center text-lg text-white hover:cursor-pointer flex items-center justify-center hover:bg-violet-700"
  >
    <font-awesome-icon icon="user-minus" />
  </div>
  <div
    v-if="!isFollowing"
    @click="followUser"
    class="w-full rounded-lg p-2 bg-violet-800 text-center text-lg text-white hover:cursor-pointer flex items-center justify-center hover:bg-violet-700"
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
