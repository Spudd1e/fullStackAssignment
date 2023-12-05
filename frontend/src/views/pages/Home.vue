<template>
    <div class="main">
        <!-- <PostView v-if="newPost" :type="'newPost'" :edit_id="null" edit_text="" @close="newPost = false" /> 
        <PostView v-if="editPost" :type="'editPost'" v-model:edit_id="this.editId" v-model:edit_text="this.editText" @close="editPost = false" /> -->


        <div class="column">
            <h1>Feed</h1>
            <button v-if="isLoggedIn"  @click="newPost">New Post</button>
            <div class="feedCol">
                <Feed :followingList="followingList"  />

            </div>
        </div>
        <div class="column searchCol">
            <UserSearch :followingList="followingList" />
        </div>
    </div>
</template>

<script>

import Feed from '../components/Feed.vue'
import PostView from '../components/PostView.vue';
import UserSearch from '../components/UserSearch.vue';
import { userService } from '../../services/user.service';


export default {
    inject: ['emitter'],
    data() {
        return {
            followingList: [],
            isLoggedIn: localStorage.getItem("user_id")
        }
    },
    mounted() {

        this.emitter.emit("log")

        this.emitter.on("updateFollowing", () => {
            this.getFollowing()
        })
        this.emitter.emit("loadFeed")
    },
    unmounted(){
        this.emitter.off("updateFollowing")
    },
    methods:{
        newPost(){
            this.emitter.emit("newPost")
        },
        getFollowing(){
            if (localStorage.getItem("user_id")) {
                userService.getSingleUser(localStorage.getItem("user_id"))
                    .then(user => {
                        this.followingList = []
                        user.following.forEach(user => {
                            this.followingList.push(user.user_id)
                        })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
    },
    components: { Feed, UserSearch, PostView }
}
</script>

<style>
.column {
    border: 1px solid black;
    width: 50%;
    z-index: -1;
    position: sticky;
}

.feedCol,
.searchCol {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80%;
    overflow-y: 100vh;
    overflow: auto;
}

.column {
    flex: 2;
}

.searchCol {
    flex: 1;
}

.main {
    width: 100vw;
    display: flex;
    height: 95vh;
    position: sticky;
    top: 5vh;
}</style>