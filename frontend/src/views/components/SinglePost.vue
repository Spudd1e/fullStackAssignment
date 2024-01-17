<template>
  <div v-if="post" class="flex w-[80vw] flex-col items-center dark:text-white">
    <div
      class="m-6 flex w-1/2 flex-col items-center rounded-lg bg-[#EEEEEE] p-2 dark:bg-[#2b2b2f]"
    >
      <router-link :to="'/users/' + post.author.user_id">
        <div class="flex w-full items-center justify-evenly rounded-t-lg p-2">
          <div class="flex">
            <h1 class="text-3xl">
              {{ post.author.first_name + " " + post.author.last_name }}|
            </h1>
            <h1 class="mr-2 text-3xl text-violet-800">
              @{{ post.author.username }}
            </h1>
          </div>
        </div>
      </router-link>
      <div class="flex justify-evenly">
        <p class="p-4">
          Post Id:
          <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">{{
            post.post_id
          }}</span>
        </p>
        <p class="p-4">
          Date:
          <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">{{
            post.timestamp
          }}</span>
        </p>
        <p class="p-4">
          Likes:
          <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">
            {{ post.likes.length }}</span
          >
        </p>
      </div>
      <EditPostButton
        v-if="post.author.user_id == loggedUser"
        :post_id="post.post_id"
        :post_text="post.text"
      />
    </div>
    <div class="w-3/4 rounded-lg bg-[#EEEEEE] p-2 text-left dark:bg-[#2b2b2f]">
      <h2>{{ post.text }}</h2>
    </div>
  </div>
  <router-view />
</template>
<script>
import { postService } from "../../services/post.service";
import EditPostButton from "./EditPostButton.vue";

export default {
  data() {
    return {
      loggedUser: localStorage.getItem("user_id"),
      post: null,
      error: "",
    };
  },
  created() {
    postService
      .getSinglePost(this.$route.params.id)
      .then((post) => {
        this.post = post;
        this.post.timestamp = this.formatDate(new Date(post.timestamp));
      })
      .catch((error) => (this.error = error));
  },
  methods: {
    formatDate(date) {
      let day = date.getDate().toString().padStart(2, "0");
      let month = date.getMonth() + 1 
      month = month.toString().padStart(2, "0");
      let year = date.getFullYear();
      let hour = date.getHours().toString().padStart(2, "0");
      let minutes = date.getMinutes().toString().padStart(2, "0");
      return day + "/" + month + "/" + year + " at " + hour + ":" + minutes;
    },
  },
  components: { EditPostButton },
};
</script>
