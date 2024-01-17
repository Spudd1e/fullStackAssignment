<template>
  <div
    v-if="this.user.first_name"
    class="flex h-full w-[80vw] flex-col items-center text-black dark:text-white"
  >
    <div
      class="m-6 flex w-3/4 flex-col items-center rounded-lg bg-[#EEEEEE] p-2 dark:bg-[#2b2b2f]"
    >
      <div class="flex w-full items-center justify-evenly p-2">
        <div class="flex">
          <h1 class="text-3xl">
            {{ this.user.first_name + " " + this.user.last_name }}|
          </h1>
          <h1 class="mr-2 text-3xl text-violet-700">
            @{{ this.user.username }}
          </h1>
        </div>
        <div
          v-if="!personalProfile && loggedUser"
          class="flex w-1/12 justify-center"
        >
          <FollowButton :isFollowing="following" :author="this.user.user_id" />
        </div>
      </div>
      <div class="flex w-full justify-evenly">
        <div class="flex w-[calc(80%/4)] items-center justify-center">
          <p
            class="cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:hover:bg-[#3b3b3f]"
            @click="showFollowers"
          >
            Followers:
            <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">{{
              this.user.followers.length
            }}</span>
          </p>
        </div>
        <div class="flex w-[calc(80%/4)] items-center justify-center">
          <p
            class="cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:hover:bg-[#3b3b3f]"
            @click="showFollowing"
          >
            Following:
            <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">{{
              this.user.following.length
            }}</span>
          </p>
        </div>
        <div class="flex w-[calc(80%/4)] items-center justify-center">
          <p class="p-2">
            Posts:
            <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">{{
              this.user.posts.length
            }}</span>
          </p>
        </div>
        <div class="jsutify-center flex w-[calc(80%/4)] items-center">
          <p class="p-2">
            Likes:
            <span class="rounded-lg bg-[#DDDDDD] p-2 dark:bg-[#3b3b3f]">{{
              this.totalLikes
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <p class="p-2 underline decoration-black dark:decoration-white">
      <span v-if="personalProfile">Your </span
      ><span v-else-if="this.user.first_name.slice(-1).toLowerCase() != 's'"
        >{{ this.user.first_name }}'s
      </span>
      <span v-else>{{ this.user.first_name }}' </span>Posts
    </p>
    <PostList
      class="rounded-md"
      v-show="this.user.posts.length !== 0"
      :posts="this.user.posts"
    />
  </div>
  <router-view />
</template>
<script>
import { userService } from "../../services/user.service";
import FollowButton from "../components/FollowButton.vue";
import Post from "../components/Post.vue";
import PostList from "../components/PostList.vue";
export default {
  inject: ["emitter"],
  props: {
    userId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      totalLikes: 0,
      user: {},
      personalProfile: this.userId || false,
      user_id:
        this.$route.params.user_id ||
        localStorage.getItem("user_id") ||
        localStorage.getItem("profileId"),
      following: false,
      loggedUser: localStorage.getItem("user_id"),
    };
  },
  mounted() {
    console.log("mounted");
    localStorage.setItem("profileId", this.user_id);
    if (this.loggedUser == this.user_id) {
      this.personalProfile = true;
    }
    this.emitter.on("updateProfile", () => {
      this.loggedUser = localStorage.getItem("user_id");
      if (this.$route.path == "/profile" && !this.loggedUser) {
        this.$router.push("/users/" + localStorage.getItem("profileId"));
      }

      this.user_id =
        this.$route.params.user_id ||
        this.loggedUser ||
        localStorage.getItem("profileId");
        
      if (this.$route.path != "/profile" && this.loggedUser == this.user_id) {
        this.$router.push("/profile");
      }
      if (this.user_id != this.loggedUser) {
        this.personalProfile = false;
      }else{
        this.personalProfile = true;
      }

      this.getUser(this.user_id);
    });
    this.getUser(this.user_id);
  },
  watch: {
    $route: function () {
      this.emitter.emit("updateProfile");
    },
  },
  unmounted() {
    this.emitter.off("updateProfile");
  },
  methods: {
    showFollowers() {
      this.emitter.emit("showFollowers", [this.user.followers]);
    },
    showFollowing() {
      this.emitter.emit("showFollowing", [this.user.following]);
    },
    getUser(id) {
      let result = [];
      userService
        .getSingleUser(id)
        .then((user) => {
          this.user = user;
          user.followers.forEach((element) => {
            result.push(element.user_id.toString());
          });
          this.totalLikes = 0;
          this.following = result.includes(localStorage.getItem("user_id"));
          user.posts.forEach((post) => {
            this.totalLikes = this.totalLikes + post.likes.length;
          });
        })
        .catch((error) => {
          this.$router.push("/NotFound");
        });
    },
  },
  components: { Post, PostList, FollowButton },
};
</script>
