<template>
  <div v-if="!showMessage" class="flex h-3/4 w-full flex-col items-center p-5">
    <h1>Edit Post</h1>
    <div class="h-3/4 w-3/4">
      <p class="text-right text-sm font-light">{{ charCount }} / 400</p>
      <textarea
        class="h-[calc(75%-1.5rem)] w-full resize-none rounded-xl bg-[#EEEEEE] p-2 focus:border focus:outline-none dark:bg-[#2b2b2f] dark:focus:border-gray-200"
        v-model="postText"
        maxlength="500"
        @input="charCount = postText.length"
      ></textarea>
      <div v-if="charCount >= 500">Character limit Reached</div>
      <div v-else><br /></div>
      <button
        class="m-2 w-fit rounded-md bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-[#3b3b3f] hover:dark:bg-[#2b2b2f]"
        @click="handleEdit"
      >
        Update
      </button>
      <button
        class="m-2 w-fit rounded-md bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-[#3b3b3f] hover:dark:bg-[#2b2b2f]"
        @click="this.showMessage = true"
      >
        Delete
      </button>
    </div>
  </div>
  <div v-if="showMessage" class="flex h-full w-full flex-col items-center p-5">
    <div
      class="flex h-3/4 w-3/4 flex-col items-center justify-center text-center"
    >
      <div v-if="!deleted" class="flex flex-col items-center">
        <p class="p-2">Are you sure?</p>
        <DeletePostButton
          class="w-fit rounded-md bg-[#3b3b3f] p-2 hover:bg-[#2b2b2f]"
          :post_id="id"
        />
      </div>
      <div v-if="deleted" class="rounded-md bg-green-500 p-4">
        <h1>Post Deleted</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { postService } from "../../../services/post.service";
import DeletePostButton from "../DeletePostButton.vue";

export default {
  inject: ["emitter"],
  emits: ["close"],
  props: {
    text: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      postText: this.text,
      charCount: this.text.length,
      showMessage: false,
      deleted: false,
    };
  },
  mounted() {
    this.emitter.on("deleted", () => {
      this.deleted = true;
      setTimeout(this.$emit("close"), 2000);
    });
  },
  unmounted() {
    this.emitter.off("deleted");
  },
  methods: {
    handleEdit() {
      let id = this.id;
      let text = this.postText;
      postService
        .updatePost(id, text)
        .then((response) => {
          this.emitter.emit("loadFeed");
          this.emitter.emit("updateProfile");
          if (this.$route.matched[0].path == "/posts/:id") {
            this.emitter.emit("updatePost");
          }
          this.$emit("close");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: { DeletePostButton },
};
</script>
