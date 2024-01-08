<template>
    <div class="p-4 mt-6 rounded-md text-black dark:text-white w-4/5 self-center shadow-lg shadow-gray-400 bg-gray-200 dark:bg-[#2b2b2f] dark:shadow-none">
        <div class="flex w-full justify-between items-center">

            <div class="flex items-center  rounded-md  max-w-fit">
                <router-link :to="'/users/' + details.author.user_id">

                    <div class="flex flex-col mr-2">
                        <div class="flex ">
                            <h1>{{ details.author.first_name + " " + details.author.last_name }}|</h1>
                            <h2 class="mr-2 text-violet-400">@{{ details.author.username }}</h2>
                        </div>
                        <p class="text-xs text-gray-500">{{ formatDate(new Date(details.timestamp)) }}</p>
                    </div>
                </router-link>
                <FollowButton v-if="!ownPost && isLoggedIn && !profilePage" :isFollowing="following"
                    :author="details.author.user_id" />
            </div>

            <EditPost v-if="ownPost" :post_id="details.post_id" :post_text="details.text" />

        </div>

        <router-link :to="'/posts/' + details.post_id">

            <div class="postText">
                <p>{{ details.text }}</p>
            </div>
        </router-link>

        <div class="h-fit flex items-center">
            <LikeButton v-if="!ownPost" :post_id=details.post_id :liked="liked" />
            <p v-if="ownPost">Likes: </p>
            <p> {{ details.likes.length }}</p>
        </div>

    </div>
</template>

<script>

import EditPost from './buttons/EditPost.vue'
import FollowButton from './buttons/FollowButton.vue';
import LikeButton from './buttons/LikeButton.vue';


export default {
    inject: ["emitter"],
    data() {
        return {
            ownPost: false,
            liked: false,
            isLoggedIn: localStorage.getItem("user_id"),
            profilePage: false
        };
    },
    mounted() {
        if (this.$route.path !== '/') {
            this.profilePage = true;
        }
        this.emitter.on("updateLike", result => {
            this.updateLikes()
            this.emitter.emit("loadFeed")
        })

        if (this.details.author.user_id == this.isLoggedIn) {
            this.ownPost = true
        }
        this.updateLikes()

    },
    unmounted() {
        this.emitter.off("updateLike")
    },
    methods: {
        updateLikes() {
            this.$props.details.likes.forEach(like => {
                if (like.user_id == localStorage.getItem("user_id")) {
                    this.liked = true
                }
            })
        },


        formatDate(date) {
            let day = date.getDate().toString().padStart(2, "0")
            let month = date.getMonth().toString().padStart(2, "0")
            let year = date.getFullYear();
            let hour = date.getHours().toString().padStart(2, "0")
            let minutes = date.getMinutes().toString().padStart(2, "0")

            return day + "/" + month + "/" + year + " at " + hour + ":" + minutes

        }
    },
    props: ["details", "following"],
    components: { LikeButton, FollowButton, EditPost, DeletePost, LikeButton }
}

</script>
