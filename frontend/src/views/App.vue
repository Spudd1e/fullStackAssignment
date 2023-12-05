<template>
  <div>
    <nav>
      <router-link class="navButton" to="/">
        <p>Home</p>
      </router-link>
      <router-link v-if="isLoggedIn" class="navButton" to="/profile">
        <p>Profile</p>
      </router-link>
      <router-link v-if="!isLoggedIn" class="navButton" to="/login">
        <p>Login</p>
      </router-link>
      <div v-else @click="logout" class="navButton">
        <p>Logout</p>
      </div>
    </nav>
    <div class="mainContainer">
      <PostView v-if="postModalVisible" :type="modalType" v-model:text="this.editText" v-model:edit_id="this.edit_id" @close="postModalVisible = false" />
      <router-view />
    </div>
  </div>
</template>

<script>



import { userService } from '../services/user.service'
import PostView from './components/PostView.vue'
export default {
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
        logout() {
            userService.logout()
                .then(response => {
                this.emitter.emit("log", false);
                this.emitter.emit("loadFeed");
                this.$router.push("/");
            });
        }
    },
    mounted() {
        this.emitter.emit("loadFeed")

        this.emitter.on("newPost", () => {
          this.modalType = "newPost";
          this.editText = "";
          this.edit_id = "";
          this.postModalVisible = true;
        })

        this.emitter.on("editPost", ([text, post_id]) => {
            this.edit_id = post_id
            this.editText = text
            this.modalType = "editPost"
            this.postModalVisible = true;
        })

        this.emitter.on("log", () => {
          this.isLoggedIn = localStorage.getItem("user_id")
        });
    },
    unmounted() {

        this.emitter.off("log")
        this.emitter.off("newPost")
        this.emitter.off("editPost")
    },
    components: { PostView }
}


</script>

<style>
body {
  font-family: Arial, Helvetica, sans-serif;
  height: 100vh;
  padding: 0;
  margin: 0;
}

nav {
  position: sticky;
  top: 0;
  height: 5vh;
  background-color: white;
  justify-content: space-evenly;
  display: flex;
  border: 1px solid black;
  border-radius: 15px;
}

.navButton {
  background-color: rgb(92, 92, 92);
  padding: 10px;
  border-radius: 25px;
  width: 10%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  text-decoration: none;
}

.navButton p {
  color: white;
  font-size: 20px;
  margin: 0;
  padding: 0;
}

.navButton:hover {
  background-color: rgb(30, 30, 30);
  transition: 0.2s;
  cursor: pointer;
}

.mainContainer {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  flex-direction: column;
}
</style>