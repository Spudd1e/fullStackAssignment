<template>
  <div>
    <button
      class="w-fit rounded-lg p-2 text-violet-600 transition hover:bg-[#DDDDDD] dark:text-violet-400 hover:dark:bg-[#3b3b3f]"
      @click="handleEditPost"
    >
      Edit
    </button>
  </div>
</template>
<script>
export default {
  inject: ["emitter"],
  props: ["post_text", "post_id"],
  methods: {
    handleEditPost() {
      this.emitter.emit("editPost", [
        this.$props.post_text,
        this.$props.post_id,
      ]);
    },
  },
};
</script>
