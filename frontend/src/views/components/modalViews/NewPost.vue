<template>
  <div class="flex h-[10%] items-center">
    <h1 class="p-5">New Post</h1>
  </div>

  <div class="flex h-[80%] w-full flex-col items-center justify-center p-2">
    <div class="flex h-full w-full flex-col items-center justify-center">
      <div class="h-[60%] w-3/4">
        <p class="text-right text-sm font-light max-sm:text-xs">
          {{ charCount }} / 400
        </p>
        <textarea
          class="h-[90%] w-full resize-none rounded-xl bg-[#EEEEEE] p-2 focus:border focus:border-black focus:outline-none focus:outline-1 dark:bg-[#2b2b2f] dark:focus:border-white max-md:w-full max-sm:text-xs"
          v-model="postText"
          maxlength="400"
          @input="charCount = postText.length"
        ></textarea>

        <div v-if="charCount >= 400" class="max-sm:text-xs">
          Character limit Reached!
        </div>
        <div v-else class="max-sm:text-xs"><br /></div>
      </div>
      <div
        class="flex h-[40%] w-full flex-col items-center justify-center p-2 max-sm:text-sm"
      >
        <div class="flex-row items-center justify-evenly">
          <button
            class="m-2 w-fit rounded-lg bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-[#2b2b2f] hover:dark:bg-[#3b3b3f]"
            @click="saveDraft"
          >
            Save to drafts
          </button>
          <button
            class="m-2 w-fit rounded-lg bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-[#2b2b2f] hover:dark:bg-[#3b3b3f]"
            @click="viewDrafts"
          >
            View Drafts
          </button>
        </div>
        <div class="w-full pt-2">
          <button
            @click="handlePost"
            class="w-3/4 rounded-lg bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-violet-800 hover:dark:bg-[#3b3b3f]"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postService } from "../../../services/post.service";

export default {
  inject: ["emitter"],
  emits: ["close"],
  data() {
    return {
      charCount: 0,
      postText: this.text,
    };
  },
  mounted() {
    if (this.text) this.charCount = this.text.length;
  },
  props: {
    text: {
      required: false,
      type: String,
    },
    id: {
      required: false,
      type: Number,
    },
  },
  methods: {
    handlePost() {
      let text = this.postText;
      postService
        .addNewPost(text)
        .then((response) => {
          this.deleteDraft();
          this.emitter.emit("loadFeed");
          this.$emit("close");
        })
        .catch((error) => {
          alert(error);
        });
    },
    deleteDraft() {
      if (this.id) {
        let drafts = this.getDrafts();
        let index = drafts.findIndex((draft) => draft.id == this.id);
        drafts.splice(index, 1);
        localStorage.setItem("postDrafts", JSON.stringify(drafts));
      }
    },
    getDrafts() {
      if (localStorage.getItem("postDrafts") != null) {
        let drafts = JSON.parse(localStorage.getItem("postDrafts"));

        return drafts;
      } else {
        return [];
      }
    },
    saveDraft() {
      let drafts = this.getDrafts();

      if (this.postText != null)
        drafts.push({ text: this.postText, id: drafts.length + 1 });
      localStorage.setItem("postDrafts", JSON.stringify(drafts));
      this.postText = null;
      this.charCount = 0;
    },
    viewDrafts() {
      this.emitter.emit("viewDrafts");
    },
  },
};
</script>
