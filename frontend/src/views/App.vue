<template>
  <div
    class=":flex-col bg-[#F5F5F5] transition-colors dark:bg-[#1b1b1f]"
    :key="isLoggedIn"
  >
    <div
      class="sticky top-0 flex h-[15vh] w-full flex-col items-center justify-center"
    >
      <h1
        class="h-[30%] rounded-md text-center text-xl text-black underline decoration-violet-700 decoration-4 transition-colors dark:text-white max-md:text-lg"
      >
        CHIRRUP!
      </h1>

      <nav
        class="flex h-[70%] w-3/4 items-center justify-evenly rounded-xl text-center text-black dark:text-white"
      >
        <div class="w-1/6">
          <router-link to="/">
            <div
              class="w-full rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
            >
              <font-awesome-icon icon="house" />
              <p class="max-sm:hidden">Home</p>
            </div>
          </router-link>
        </div>

        <div class="w-1/6">
          <div
            class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
            @click="search"
          >
            <font-awesome-icon icon="search" />
            <p class="max-sm:hidden">Search</p>
          </div>
        </div>

        <div v-if="isLoggedIn" class="w-1/6">
          <div>
            <router-link to="/profile">
              <div
                class="w-full rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
              >
                <font-awesome-icon icon="user" />
                <p class="max-sm:hidden">Profile</p>
              </div>
            </router-link>
          </div>
        </div>

        <div v-if="!isLoggedIn" class="w-1/6">
          <div>
            <div
              class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
              @click="login"
            >
              <font-awesome-icon icon="sign-in" />
              <p class="max-sm:hidden">Login</p>
            </div>
          </div>
        </div>

        <div v-if="!isLoggedIn" class="w-1/6">
          <div
            @click="handleNewUser"
            class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
          >
            <font-awesome-icon icon="user-plus" />
            <p class="max-sm:hidden">Sign Up</p>
          </div>
        </div>

        <div v-else @click="logout" class="w-1/6">
          <div
            class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
          >
            <font-awesome-icon icon="sign-out" />
            <p class="max-sm:hidden">Logout</p>
          </div>
        </div>
        <div
          @click="toggleDarkMode"
          class="flex cursor-pointer items-center justify-center rounded-lg bg-inherit text-4xl transition dark:text-violet-800 max-sm:text-lg"
        >
          <font-awesome-icon v-if="prefersDark" icon="toggle-on" />
          <font-awesome-icon v-else icon="toggle-off" />
        </div>
      </nav>
    </div>
    <div class="animate-slide-fade">
      <ModalView
        v-if="postModalVisible"
        :modalType="modalType"
        v-model:text="this.editText"
        v-model:id="this.edit_id"
        :info="info"
        @close="handleClose"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import { usePreferredDark } from "@vueuse/core";

import { userService } from "../services/user.service";
import ModalView from "./components/ModalView.vue";
export default {
  inject: ["emitter"],

  data() {
    return {
      isLoggedIn: localStorage.getItem("user_id"),
      postModalVisible: false,
      modalType: null,
      editText: "",
      edit_id: null,
      info: null,
      prefersDark: localStorage.getItem("theme") == "dark",
    };
  },
  inject: ["emitter"],
  methods: {
    search() {
      this.postModalVisible = true;
      this.modalType = "userSearch";
    },
    handleNewUser() {
      (this.postModalVisible = true), (this.modalType = "newUser");
    },
    handleClose() {
      this.postModalVisible = false;
      (this.modalType = null), (this.editText = ""), (this.edit_id = null);
    },
    logout() {
      if (this.$route.path == "/profile") {
        localStorage.setItem("profileId", localStorage.getItem("user_id"));
      }
      userService.logout().then((response) => {
        localStorage.removeItem("postDrafts");
        this.isLoggedIn = localStorage.getItem("user_id");
        this.handleClose();

        if (this.$route.path == "/profile") {
          this.$router.push("/users/" + localStorage.profileId);
        }
      });
    },
    login() {
      this.modalType = "login";
      this.postModalVisible = true;
    },
    toggleDarkMode() {
      if (this.prefersDark) {
        localStorage.theme = "light";
      } else {
        localStorage.theme = "dark";
      }
      this.changeTheme();
    },
    changeTheme() {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        this.prefersDark = true;
      } else {
        document.documentElement.classList.remove("dark");
        this.prefersDark = false;
      }
    },
  },
  mounted() {
    const isDark = usePreferredDark;
    if (isDark && localStorage.theme == "dark") {
      localStorage.setItem("theme", "dark");
    }
    this.changeTheme();

    this.emitter.on("userSearch", this.search);
    this.emitter.emit("loadFeed");
    this.emitter.on("login", this.login);
    this.emitter.on("newPost", ([text, id]) => {
      this.modalType = "newPost";
      this.editText = text;
      this.edit_id = id;
      this.postModalVisible = true;
    });

    this.emitter.on("log", () => {
      this.isLoggedIn = localStorage.getItem("user_id");
      if (this.$route.path == "/users/" + this.isLoggedIn) {
        this.$router.push("/profile");
      }
    });

    this.emitter.on("draftView", () => {
      this.modalType = "draftView";
      this.postModalVisible = true;
    });

    this.emitter.on("editPost", ([text, post_id]) => {
      this.edit_id = post_id;
      this.editText = text;
      this.modalType = "editPost";
      this.postModalVisible = true;
    });
    this.emitter.on("showFollowers", ([followerList]) => {
      this.modalType = "followerView";
      this.info = followerList;
      this.postModalVisible = true;
    });
    this.emitter.on("showFollowing", ([followingList]) => {
      this.modalType = "followingView";
      this.info = followingList;
      this.postModalVisible = true;
    });
  },
  unmounted() {
    this.emitter.off("close");
    this.emitter.off("login");
    this.emitter.off("newPost");
    this.emitter.off("editPost");
    this.emitter.off("log");
    this.emitter.off("showFollowers");
    this.emitter.off("showFollowing");
    this.emitter.off("draftView");
  },
  components: { ModalView },
};
</script>
