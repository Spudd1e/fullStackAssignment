<template>
  <div class="flex h-3/4 w-3/4 flex-col items-center max-md:w-full">
    <label for="userSearch" class="text-lg">Search User</label>
    <input
      class="mb-2 w-3/4 rounded-md bg-inherit p-1 ring-1 ring-gray-400 focus:outline-none dark:ring-white"
      autocomplete="off"
      type="text"
      name="userSearch"
      @input="searchUsers"
      v-model="search"
    />

    <div class="w-11/12 overflow-hidden overflow-y-scroll">
      <ul :key="users">
        <li
          v-for="user in users"
          class="last-of-type:mb-10"
          @click="handleSelect"
        >
          <User :user="user" :key="user" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { socialService } from "../../services/social.service";

import User from "./User.vue";

export default {
  inject: ["emitter"],
  props: ["followingList"],
  data() {
    return {
      search: "",
      users: [],
    };
  },
  mounted() {
    this.emitter.on("updateFollowing", () => {
      this.searchUsers();
    });
    this.searchUsers();
  },
  unmounted() {
    this.emitter.off("updateFollowing");
  },
  methods: {
    handleSelect() {
      this.$emit("close");
    },
    searchUsers() {
      socialService.search(this.search).then((response) => {
        this.users = response;
      });
    },
  },
  components: { User },
};
</script>
