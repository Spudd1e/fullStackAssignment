<template>
  <PostList v-if="posts.length > 0" :posts="posts" :following="followingList" />
  <div v-if="posts.length == 0 && postsRetrieved" class="h-full">
    <p class="text-black dark:text-white">
      Follow users to see posts in your feed
    </p>
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
