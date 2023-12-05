<template>
    <div class="post">
        <router-link :to="'/users/' + details.author.user_id">
            <div class="userInfo">
                <h1>{{ details.author.first_name + " " + details.author.last_name }} |</h1>

                <h2> @{{ details.author.username }}</h2>

            </div>
        </router-link>
        <router-link :to="'/posts/' + details.post_id">

            <div class="postText">
                <p>{{ details.text }}</p>
            </div>
        </router-link>

            <div>
                <p>Likes {{ details.likes.length }}</p>
                <LikeButton v-if="!ownPost && isLoggedIn" :post_id=details.post_id :liked="liked" />
                <FollowButton v-if="!ownPost && isLoggedIn" :isFollowing="following" :author="details.author.user_id" />
            </div>
            <EditPost v-if="ownPost" :post_id="details.post_id" :post_text="details.text" />
            <DeletePost v-if="ownPost" :post_id="details.post_id" />

    </div>
</template>

<script>
import DeletePost from './DeletePost.vue';
import EditPost from './EditPost.vue';
import FollowButton from './FollowButton.vue';
import LikeButton from './LikeButton.vue';

export default {
    inject: ["emitter"],
    data() {
        return {
            ownPost: false,
            liked: null,
            isLoggedIn: localStorage.getItem("user_id")
        };
    },
    mounted() {
        this.emitter.on("updateLike", result => {
            if (this.$props.details.post_id == result[0]) {
                this.liked = result[1]
                this.emitter.emit("loadFeed")
            }
        })

        if (this.details.author.user_id == this.isLoggedIn) {
            this.ownPost = true
        }
        this.$props.details.likes.forEach(like => {
            if (like.user_id == localStorage.getItem("user_id")) {
                this.liked = true
            } else {
                this.liked = false;
            }
        })
    },
    unmounted() {
        this.emitter.off("updateLike")
    },
    props: ["details", "following"],
    components: { LikeButton, FollowButton, EditPost, DeletePost }
}

</script>

<style scoped>
.post {
    width: 100%;
    border: 1px solid black;
    border-radius: 15px;
    display: flex;
    flex-direction: column;

}

.userInfo h1 {
    font-size: 2vw;
    margin: 0;
}

.userInfo h2 {
    font-size: 1vw;
    margin: 0;
}

.userInfo {
    border-bottom: 2px solid black;
    width: fit-content;
    text-align: left;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.postText {
    width: 100%;
    display: flex;
    align-items: center;
    width: auto;
    margin: 0;
    flex-grow: 1;
    overflow-wrap: anywhere;
    hyphens: manual;
}

.postText p {
    margin: 0;
}
</style>
