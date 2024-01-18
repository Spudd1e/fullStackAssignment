<template>
  <PostList v-if="posts.length > 0" :posts="posts" :following="followingList" />
  <div
    v-if="posts.length == 0 && postsRetrieved"
    class="flex h-fit w-full items-center justify-center rounded-lg p-2 text-black dark:text-white"
  >
    <div class="flex w-3/4 items-center bg-[#DDDDDD] dark:bg-[#2b2b2f] rounded-lg p-2">
      <h2  v-if="followingList.length == 0" class="w-1/2 text-lg text-center">Follow users to see posts in your feed</h2>
      <h2 v-else class="w-1/2 text-lg text-center">Nobody has posted yet</h2>
      <div class="w-1/2 text-center">
        <div
          class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#CCCCCC] dark:hover:bg-[#3b3b3f] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
          @click="search"
        >
          <font-awesome-icon icon="search" />
          <p class="max-sm:hidden">Find Users</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!postsRetrieved" class="h-full"></div>
</template>

<script>
import Post from "./Post.vue";
import { postService } from "../../services/post.service";
import PostList from "./PostList.vue";

export default {
  props: ["followingList"],
  inject: ["emitter"],
  mounted() {
    this.emitter.on("loadFeed", () => this.getFeed());
  },
  unmounted() {
    this.emitter.off("loadFeed");
  },
  methods: {
    search() {
      this.emitter.emit("userSearch");
    },
    getFeed() {
      this.emitter.emit("updateFollowing");

      postService
        .getFeed()
        .then((posts) => {
          this.posts = posts;
          this.postsRetrieved = true;
        })
        .catch((error) => {
          this.error = error;
        });
    },
  },
  data() {
    return {
      posts: [],
      postsRetrieved: false,
      following: [],
    };
  },
  components: { Post, PostList },
};
</script>
