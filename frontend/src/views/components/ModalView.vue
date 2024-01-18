<template>
  <div
    class="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="flex h-3/4 w-3/4 animate-slide flex-col items-center justify-center rounded-lg bg-white text-center dark:bg-[#1b1b1f] dark:text-white"
    >
      <NewPost
        v-if="modalType === 'newPost'"
        :text="text"
        :id="id"
        @close="handleClose"
      />
      <EditPost
        v-if="modalType === 'editPost'"
        :text="text"
        :id="post_id"
        @close="handleClose"
      />
      <UserSearch v-if="modalType === 'userSearch'" @close="handleClose" />

      <Login v-if="modalType === 'login'" @close="handleClose" />
      <CreateUser v-if="modalType === 'newUser'" @close="handleClose" />
      <!-- Show Drafts -->
      <div v-if="modalType === 'draftView'" class="flex h-full w-full flex-col">
        <div class="h-[10%]">
          <h1 class="p-5 text-xl max-sm:text-lg">Drafts</h1>
        </div>

        <div
          class="flex h-[80%] w-3/4 justify-center self-center overflow-hidden overflow-y-scroll"
        >
          <ul
            v-if="this.drafts != null && this.drafts.length > 0"
            class="w-full text-left max-sm:text-sm"
          >
            <li
              v-for="draft in this.drafts"
              class="mb-2 rounded-lg border border-white p-2"
              @click="selectDraft(draft.text, draft.id)"
            >
              <p>{{ draft.text }}</p>
            </li>
          </ul>
          <p v-else>No Drafts</p>
        </div>
      </div>

      <!--Show Followers-->
      <div
        v-if="modalType === 'followerView'"
        class="flex h-3/4 w-full flex-col items-center p-5"
      >
        <h1 class="p-2 text-xl font-bold underline">Followers</h1>
        <div
          class="flex h-full w-3/4 flex-row items-center overflow-hidden overflow-y-scroll"
        >
          <ul class="w-full">
            <li v-for="user in info" @click="handleClose">
              <User :user="user" :key="user" />
            </li>
          </ul>
        </div>
      </div>
      <!--Show Following-->
      <div
        v-if="modalType === 'followingView'"
        class="flex h-3/4 w-full flex-col items-center p-5"
      >
        <h1 class="p-2 text-lg font-bold underline">Following</h1>
        <div
          class="flex h-full w-3/4 justify-center overflow-hidden overflow-y-scroll"
        >
          <ul class="w-full">
            <li v-for="user in info" @click="handleClose">
              <User :user="user" :key="user" />
            </li>
          </ul>
        </div>
      </div>
      <!--Option Buttons-->
      <div
        class="flex h-[10%] w-3/4 items-center justify-evenly max-sm:text-sm"
      >
        <button
          class="w-fit rounded-lg bg-[#EEEEEE] p-2 hover:bg-[#EEEEEE] dark:bg-[#2b2b2f] hover:dark:bg-[#3b3b3f]"
          v-if="modalType === 'draftView'"
          @click="back"
        >
          Back
        </button>
        <button
          class="w-fit rounded-lg bg-[#EEEEEE] p-2 hover:bg-[#DDDDDD] dark:bg-[#2b2b2f] hover:dark:bg-[#3b3b3f]"
          @click="handleClose"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UserSearch from "./UserSearch.vue";
import CreateUser from "../components/modalViews/CreateUser.vue";
import NewPost from "./modalViews/NewPost.vue";
import EditPost from "./modalViews/EditPost.vue";
import Login from "./modalViews/Login.vue";
import PostList from "./PostList.vue";
import User from "./User.vue";
import Post from "./Post.vue";

export default {
  inject: ["emitter"],
  //props: ["modalType", "id", "text"],
  props: {
    info: {
      type: Array,
      required: false,
    },
    modalType: {
      type: String,
      required: true,
      validator(value) {
        return [
          "newPost",
          "editPost",
          "login",
          "userSearch",
          "newUser",
          "draftView",
          "followerView",
          "followingView",
        ].includes(value);
      },
    },
    id: {
      type: Number,
      required: false,
      default: null,
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      drafts: JSON.parse(localStorage.getItem("postDrafts")),
      post_id: this.$props.id,
      showMessage: false,
      deleted: false,
      submitted: false,
      password: "",
      username: "",
      error: null,
    };
  },
  mounted() {
    this.emitter.on("viewDrafts", () => {
      this.drafts = JSON.parse(localStorage.getItem("postDrafts"));
      this.emitter.emit("draftView");
    });
  },
  unmounted() {
    this.emitter.off("viewDrafts");
  },
  methods: {
    handleClose() {
      this.$emit("close");
      if (this.$route.path == "/login") {
        this.$router.push("/");
      }
    },
    back() {
      this.emitter.emit("newPost", [null, null]);
    },
    selectDraft(text, id) {
      this.emitter.emit("newPost", [text, id]);
    },
  },
  components: {
    UserSearch,
    CreateUser,
    NewPost,
    EditPost,
    Login,
    PostList,
    User,
    Post,
  },
};
</script>
