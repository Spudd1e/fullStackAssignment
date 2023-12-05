<template>
    <h1>Search</h1>
    <input type="text" @input="searchUsers" v-model="search" />
    <ul :key="users">
        <li v-for="user in users">
            <User :user="user" :key="user" :following="followingList.includes(user.user_id)" />
        </li>
    </ul>
</template>

<script>
import { socialService } from "../../services/social.service"
import { userService } from "../../services/user.service";
import User from "./User.vue";


export default {
    inject:["emitter"],
    props:['followingList'],
    data() {
        return {
            search: "",
            users: [],
        };
    },
    mounted(){
        this.emitter.on("updateFollowing", () => {
            this.searchUsers();
        })
    },
    unmounted(){
        this.emitter.off("updateFollowing")
    },
    methods: {
        searchUsers() {
            socialService.search(this.search)
                .then((response) => {
                    this.users = response
                })
        },
        getFollowing() {
            if (localStorage.getItem('user_id')) {
                userService.getSingleUser(localStorage.getItem("user_id"))
                    .then(user => {
                        this.following = []
                        user.following.forEach(user => {
                            this.following.push(user.user_id)
                        })
                    })
            }
        }
    },
    components: { User, User }
}

</script>

