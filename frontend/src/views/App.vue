<template>
  <div class="flex h-screen bg-[#F5F5F5] dark:bg-[#1b1b1f]" :key="isLoggedIn">
    <div class="p-4 h-full w-1/5">
      <nav
        class="flex flex-col items-center justify-evenly text-center sticky top-0 text-black dark:text-white h-full p-2 rounded-xl border ">

        <h1 class="justify-self-start text-xl rounded-md mt-10 decoration-purple-800 underline decoration-4">
          CHIRRUP!</h1>

        <div class="pt-5 pb-5 w-3/4">
          <router-link to="/">
            <div class="hover:bg-gray-400 w-full rounded-lg p-2 transition">
              <font-awesome-icon icon="house" />
              <p>Home</p>
            </div>
          </router-link>
        </div>


        <div class="pt-5 pb-5 w-3/4">
          <div class="hover:bg-gray-400 w-full rounded-lg p-2 transition cursor-pointers" @click="search">
            <font-awesome-icon icon="search"  />
            <p>Search</p>
          </div>
        </div>


        <div v-if="isLoggedIn" class="pt-5 pb-5 w-3/4">
          <div>
            <router-link to="/profile">
              <div class="hover:bg-gray-400 w-full rounded-lg p-2 transition">
              <font-awesome-icon icon="user"/>
                <p>Profile</p>
              </div>
            </router-link>
          </div>
        </div>


        <div v-if="!isLoggedIn" class="pt-5 pb-5 w-3/4">
          <div @click="handleLogin" class="hover:bg-gray-400 w-full rounded-lg p-2 transition cursor-pointer">
            <font-awesome-icon icon="sign-in" />

            <p>Login</p>
          </div>
        </div>


        <div v-if="!isLoggedIn" class="pt-5 pb-5 w-3/4">
          <div @click="handleNewUser" class="hover:bg-gray-400 w-full rounded-lg p-2 transition cursor-pointer">
            <p>Sign Up</p>
          </div>
        </div>


        <div v-else @click="logout" class="pt-5 pb-5 w-3/4">
          <div class="hover:bg-gray-400 w-full rounded-lg p-2 transition cursor-pointer">
            <font-awesome-icon icon="sign-out" />
            <p>Logout</p>
          </div>
        </div>
        <div class="p-10">
        </div>
      </nav>
    </div>
    <PostView v-if="postModalVisible" :modalType="modalType" v-model:text="this.editText" v-model:id="this.edit_id"
      @close="handleClose" />

    <router-view />
  </div>
</template>


<script>

import { usePreferredDark } from '@vueuse/core'

import { userService } from '../services/user.service'
import PostView from './components/PostView.vue'
export default {
  inject: ['emitter'],
  data() {
    return {
      isLoggedIn: localStorage.getItem("user_id"),
      postModalVisible: false,
      modalType: null,
      editText: "",
      edit_id: null
    };
  },
  inject: ["emitter"],
  methods: {
    search() {
      this.postModalVisible = true
      this.modalType = "userSearch"
    },
    handleNewUser() {
      this.postModalVisible = true,
        this.modalType = "newUser"
    },
    handleClose() {
      this.postModalVisible = false;
      this.modalType = null,
        this.editText = "",
        this.edit_id = null
    },
    logout() {
      userService.logout()
        .then(response => {
          this.emitter.emit("log");
          this.emitter.emit("loadFeed");
          this.$router.push("/");
        });
    },
    handleLogin() {
      this.emitter.emit("login")
    }

  },
  mounted() {
    const isDark = usePreferredDark
    if (isDark) {
      document.getElementById('html').className = "dark"
    }


    this.emitter.emit("loadFeed")
    this.emitter.on('close', this.handleClose)
    this.emitter.on("newPost", () => {
      this.modalType = "newPost";
      this.postModalVisible = true;
    })

    this.emitter.on("editPost", ([text, post_id]) => {
      this.edit_id = post_id
      this.editText = text
      this.modalType = "editPost"
      this.postModalVisible = true;
    })
    this.emitter.on('login', () => {
      this.modalType = 'login'
      this.postModalVisible = true;
    })



    this.emitter.on("log", () => {
      this.isLoggedIn = localStorage.getItem("user_id")
    });
  },
  unmounted() {

    this.emitter.off("log")
    this.emitter.off('close')
    this.emitter.off("newPost")
    this.emitter.off("editPost")
  },
  components: { PostView }
}


</script>
