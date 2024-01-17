<template>
  <div class="flex h-3/4 w-full flex-col items-center p-5">
    <h1>New Post</h1>
    <div class="h-3/4 w-3/4">
      <p class="text-right text-sm font-light">{{ charCount }} / 400</p>
      <textarea
        class="h-[calc(75%-1.5rem)] w-full resize-none rounded-xl bg-[#EEEEEE] p-2 focus:border focus:border-black focus:outline-none focus:outline-1 dark:bg-[#2b2b2f] dark:focus:border-white"
        v-model="postText"
        maxlength="400"
        @input="charCount = postText.length"
      ></textarea>
      <div v-if="charCount >= 400">Character limit Reached</div>
      <div v-else><br /></div>
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
      <button
        @click="handlePost"
        class="m-2 w-fit rounded-lg bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-[#2b2b2f] hover:dark:bg-[#3b3b3f]"
      >
        Post
      </button>
    </div>
  </div>
</template>

<script>
import { postService } from "../../../services/post.service";

export default {
  inject: ["emitter"],
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
        return JSON.parse(localStorage.getItem("postDrafts"));
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
