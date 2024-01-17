<template>
  <div
    class="flex w-full justify-center self-center overflow-hidden overflow-y-scroll rounded-lg"
  >
    <ul :key="posts" class="flex w-3/4 flex-col items-center rounded-lg">
      <li v-for="post in posts" class="w-full">
        <Post
          :details="post"
          :following="following.includes(post.author.user_id)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import Post from "./Post.vue";
export default {
  props: {
    following: {
      type: Array,
      required: false,
      default: [],
    },
    posts: {
      type: Array,
      required: true,
    },
  },
  components: { Post },
};
</script>
