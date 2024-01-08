<template>
    <div v-if="this.user.first_name" class="flex flex-col max-h-full w-full items-center text-center text-black p-4">
        <div class="flex rounded-t-lg p-2f w-1/4 justify-evenly items-center bg-slate-700">
            <div class="flex ">
                        <h1>{{ this.user.first_name + " " + this.user.last_name }}|</h1>
                        <h2 class="mr-2 text-blue-400">@{{ this.user.username }}</h2>
            </div>
            <FollowButton v-if="!personalProfile" :isFollowing="following" :author="this.user.user_id" />
        </div>
        <h2 class="bg-slate-300 w-1/2 p-4">@{{ this.user.username }}</h2>
        <p class="bg-slate-300 w-1/2 p-4">Followers {{ this.user.followers.length }}</p>
        <p class="bg-slate-300 w-1/2 p-4">Following {{ this.user.following.length }}</p>
        <PostList class="bottom-0 bg-slate-400 p-4 pt-0 rounded-md" v-show="this.user.posts.length !== 0"
            :posts="this.user.posts" />
    </div>
</template>
<script>
import { userService } from '../../services/user.service';
import FollowButton from '../components/Buttons/FollowButton.vue';
import Post from '../components/Post.vue';
import PostList from '../components/PostList.vue';
export default {
    inject: ['emitter'],
    data() {
        return {
            user: {},
            personalProfile: false,
            user_id: null,
            following: false,
            loggedUser: localStorage.getItem("user_id")
        };
    },
    mounted() {
        this.emitter.on('updateProfile', () => {
            this.getId()
            this.getUser(this.user_id)
        })

        this.getId()
        this.getUser(this.user_id)
    },
    watch: {
        $route: function () {
            this.emitter.emit('updateProfile')
        }
    },
    unmounted() {
        this.emitter.off("updateProfile")
    },
    methods: {
        getId() {
            this.user_id = this.$route.params.user_id
            if (this.$route.params.user_id === localStorage.getItem("user_id")) {
                this.$router.push('/profile')
            }
            if (this.$route.path === "/profile") {
                this.user_id = localStorage.getItem("user_id")
                this.personalProfile = true;
            }

        },
        getUser(id) {
            let result = [];
            userService.getSingleUser(id)
                .then((user) => {
                    this.user = user;
                    user.followers.forEach(element => {
                        result.push((element.user_id).toString())
                    })
                    this.following = result.includes(localStorage.getItem("user_id"))
                })
                .catch((error) => {
                    console.log(this.error)
                    this.error = error
                    this.$router.push('/NotFound')
                })
        }
    },
    components: { Post, PostList, FollowButton }
}
</script>