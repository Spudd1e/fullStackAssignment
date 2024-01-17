<template>
  <div
    class="flex justify-center  w-full overflow-y-auto
     rounded-lg"
  >
    <ul :key="posts" class="flex flex-col w-3/4 items-center rounded-lg ">
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
