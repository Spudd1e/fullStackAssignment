<template>
  <div
    v-if="post"
    class="flex h-[90vh] w-full flex-col items-center dark:text-white"
  >
    <div
      class="m-6 flex w-3/4 flex-col items-center rounded-lg bg-[#EEEEEE] p-2 dark:bg-[#2b2b2f]"
    >
      <router-link :to="'/users/' + post.author.user_id">
        <div class="flex w-full items-center justify-evenly rounded-t-lg p-2">
          <div class="flex">
            <h1 class="text-3xl max-sm:text-xl">
              {{ post.author.first_name + " " + post.author.last_name }}|
            </h1>
            <h1 class="mr-2 text-3xl text-violet-400 max-sm:text-xl">
              @{{ post.author.username }}
            </h1>
          </div>
        </div>
      </router-link>
      <div>
        <div>
          <p class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">
            {{ post.timestamp }}
          </p>
        </div>
        <div class="flex justify-evenly p-2">
  

          <p
            class="flex h-full flex-col rounded-lg bg-[#DDDDDD] p-2 text-center dark:bg-[#3b3b3f]"
          >
            <span> {{ post.likes.length }}</span>
            Likes
          </p>
        </div>
      </div>

      <div
        class="w-3/4 rounded-lg bg-[#EEEEEE] p-2 text-left dark:bg-[#2b2b2f]"
      >
        <h2 class="break-words text-center">{{ post.text }}</h2>
      </div>
      <EditPostButton
        v-if="post.author.user_id == loggedUser"
        :post_id="post.post_id"
        :post_text="post.text"
      />
    </div>
  </div>
</template>
<script>
import { postService } from "../../services/post.service";
import EditPostButton from "../components/EditPostButton.vue";

export default {
  inject: ["emitter"],
  data() {
    return {
      loggedUser: localStorage.getItem("user_id"),
      post: null,
      error: "",
    };
  },
  mounted() {
    this.emitter.on("updatePost", () => {
      this.getPost();
    });
    this.getPost();
  },
  methods: {
    getPost() {
      postService
        .getSinglePost(this.$route.params.id)
        .then((post) => {
          this.post = post;
          this.post.timestamp = this.formatDate(new Date(post.timestamp));
        })
        .catch((error) => (this.error = error));
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
  components: { EditPostButton },
};
</script>
