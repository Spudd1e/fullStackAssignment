<template>
  <div class="w-fit rounded-md bg-[#DDDDDD] dark:bg-[#3b3b3f] hover:bg-[#CCCCCC] cursor-pointer dark:text-white p-2 dark:hover:bg-[#2b2b2f]">
    <button @click="deletePost">Delete</button>
  </div>
</template>
<script>
import { postService } from "../../services/post.service";

export default {
  inject: ["emitter"],
  props: {
    post_id: {
      required: true,
      type: Number,
    },
  },
  data() {
    return {
      id: this.post_id,
    };
  },
  methods: {
    deletePost() {
      let post_id = this.id;
      postService.deletePost(post_id).then((response) => {
        this.emitter.emit("updateProfile");
        this.emitter.emit("loadFeed");
        if (this.$route.matched[0].path == "/posts/:id") {
          this.$router.push("/");
        }

        this.emitter.emit("deleted");
      });
    },
  },
};
</script>
