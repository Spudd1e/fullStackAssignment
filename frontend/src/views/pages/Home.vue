<template>
    <div class="w-full flex max-h-screen ">
        <div class="flex flex-col w-full">
            <button v-if="isLoggedIn"  @click="newPost" class="p-2 rounded-lg shadow-lg shadow-black drop-shadow-sm  bg-slate-800 text-white w-fit self-center m-2">New Post</button>
            <Feed class="mt-2" :followingList="followingList"  />
        </div>
    </div>
</template>

<script>

import Feed from '../components/Feed.vue';
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

