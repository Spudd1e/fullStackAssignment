<template>
  <div
    class="flex h-screen w-screen bg-[#F5F5F5] dark:bg-[#1b1b1f]"
    :key="isLoggedIn"
  >
    <div
      class="h-full w-[20vw] border-r-[0.5px] border-[#1b1b1f] dark:border-[#3b3b3f]"
    >
      <nav
        class="sticky top-0 flex h-full w-full flex-col items-center justify-evenly rounded-xl p-2 text-center text-black dark:text-white"
      >
        <h1
          class="mt-10 justify-self-start rounded-md text-xl underline decoration-purple-800 decoration-4"
        >
          CHIRRUP!
        </h1>

        <div class="w-3/4 pb-5 pt-5">
          <router-link to="/">
            <div
              class="w-full rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
            >
              <font-awesome-icon icon="house" />
              <p>Home</p>
            </div>
          </router-link>
        </div>

        <div class="w-3/4 pb-5 pt-5">
          <div
            class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
            @click="search"
          >
            <font-awesome-icon icon="search" />
            <p>Search</p>
          </div>
        </div>

        <div v-if="isLoggedIn" class="w-3/4 pb-5 pt-5">
          <div>
            <router-link to="/profile">
              <div
                class="w-full rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
              >
                <font-awesome-icon icon="user"  />
                <p>Profile</p>
              </div>
            </router-link>
          </div>
        </div>

        <div v-if="!isLoggedIn" class="w-3/4 pb-5 pt-5">
          <div>

              <div
                class="w-full rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
              @click="login">
                <font-awesome-icon icon="sign-in"/>
                <p>Login</p>
              </div>

          </div>
        </div>

        <div v-if="!isLoggedIn" class="w-3/4 pb-5 pt-5">
          <div
            @click="handleNewUser"
            class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
          >
            <font-awesome-icon icon="user-plus" />
            <p>Sign Up</p>
          </div>
        </div>

        <div v-else @click="logout" class="w-3/4 pb-5 pt-5">
          <div
            class="w-full cursor-pointer rounded-lg p-2 transition hover:bg-[#DDDDDD] dark:bg-inherit hover:dark:bg-[#3b3b3f]"
          >
            <font-awesome-icon icon="sign-out" />
            <p>Logout</p>
          </div>
        </div>
        <div class="p-5"></div>
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
    };
  },
  inject: ["emitter"],
  methods: {
    handleLoginRoute() {
      if (this.$route.path == "/") {
        this.$router.push({ name: "homeLogin" });
      }
    },
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
      if(this.$route.path == '/profile'){
        localStorage.setItem('profileId', localStorage.getItem("user_id"))
      }
      userService.logout().then((response) => {
        localStorage.removeItem("postDrafts");
        this.isLoggedIn = localStorage.getItem("user_id");
        this.handleClose();
        this.emitter.emit("loadFeed");
        if(this.$route.path == '/profile'){
          this.emitter.emit('updateProfile')
        }
        
      });
    },
    login(){
      this.modalType = "login";
      this.postModalVisible = true;
    }
  },
  mounted() {
    const isDark = usePreferredDark;
    if (isDark) {
      document.getElementById("html").className = "dark";
    }
    
    this.emitter.emit("loadFeed");

    this.emitter.on("newPost", ([text, id]) => {
      this.modalType = "newPost";
      this.editText = text;
      this.edit_id = id;
      this.postModalVisible = true;
    });

    this.emitter.on("log", () => {
      this.isLoggedIn = localStorage.getItem("user_id")
      if(this.$route.path == '/users/' + this.isLoggedIn){
          this.$router.push('/profile')
        }
    })

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
    this.emitter.off("newPost");
    this.emitter.off("editPost");
    this.emitter.off("showFollowers");
    this.emitter.off("showFollowing");
    this.emitter.off("draftView");
  },
  components: { ModalView },
};
</script>
