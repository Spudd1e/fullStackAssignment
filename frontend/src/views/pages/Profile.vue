<template>
  <div v-if="this.user.first_name" class="flex h-[90vh] w-full flex-col items-center text-black dark:text-white">
    <div class="m-6 flex w-3/4 flex-col items-center rounded-lg bg-[#EEEEEE] p-5 dark:bg-[#2b2b2f]">
      <div class="flex w-full items-center max-md:flex-col justify-center p-2 pb-5">
        <div class="flex max-md:flex-col max-md:items-center">
          <h1 class="text-3xl max-md:text-xl max-md:border-b-2 ">
            {{ this.user.first_name + " " + this.user.last_name }}<span class="max-md:hidden">|</span>
          </h1>
          <h1 class="mr-2 text-3xl max-md:text-xl text-violet-400">
            @{{ this.user.username }}
          </h1>
        </div>
        <div v-if="!personalProfile && loggedUser" class="flex max-md:w-1/2 w-1/4 justify-center">
          <div class="w-1/2">
          <FollowButton :isFollowing="following" :author="this.user.user_id" />
          </div>
        </div>
      </div>
      <div class="w-full items-center justify-evenly flex">

        <div class="flex w-[calc(70%/3)] items-center justify-center">
          <p class=" w-full flex flex-col p-1 justify-evenly items-center dark:bg-[#3b3b3f] rounded-lg">
            <span class="rounded-lg ">{{
              this.user.posts.length
            }}</span>
            Posts

          </p>
        </div>


        <div class="flex w-[calc(70%/3)] items-center justify-center">
          <p class="cursor-pointer rounded-lg w-full flex-col p-1 flex items-center justify-evenly transition  dark:bg-[#3b3b3f] dark:hover:bg-[#4b4b4f]"
            @click="showFollowers">
            <span class="rounded-lg  ">{{
              this.user.followers.length
            }}</span>
            Followers

          </p>
        </div>
        <div class="flex w-[calc(70%/3)]  items-center justify-center">
          <p class="cursor-pointer rounded-lg flex-col p-1 w-full flex items-center justify-evenly transition dark:bg-[#3b3b3f] dark:hover:bg-[#4b4b4f]"
            @click="showFollowing">
            <span class="rounded-lg ">{{
              this.user.following.length
            }}</span>
            Following

          </p>
        </div>

      </div>
    </div>

    <p class="p-2 underline decoration-black dark:decoration-white">
      <span v-if="personalProfile">Your </span><span v-else-if="this.user.first_name.slice(-1).toLowerCase() != 's'">{{
        this.user.first_name }}'s
      </span>
      <span v-else>{{ this.user.first_name }}' </span>Posts
    </p>
    <PostList  v-show="this.user.posts.length !== 0" :posts="this.user.posts" />
  </div>

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
      } else {
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
