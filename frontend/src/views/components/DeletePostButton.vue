<template>
  <div
    class="w-fit cursor-pointer rounded-md bg-[#DDDDDD] p-2 hover:bg-[#CCCCCC] dark:bg-[#3b3b3f] dark:text-white dark:hover:bg-[#2b2b2f]"
  >
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
