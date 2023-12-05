

<template>
    <div class="feed">
        <ul :key=posts>
            <li v-for="post in posts">
                <Post class="feed-post" :details="post" :following="followingList.includes(post.author.user_id)" />
            </li>
        </ul>
    </div>
</template>

<script>
import Post from './Post.vue';
import { postService } from '../../services/post.service'


export default {
    props:['followingList'],
    inject: ['emitter'],
    mounted() {
        this.emitter.on("loadFeed", () => this.getFeed())

    },
    unmounted(){
        this.emitter.off("loadFeed")
    },
    methods:{
        getFeed(){
            this.emitter.emit("updateFollowing")

            postService.getFeed()
                .then(posts => {
                    this.posts = posts;

                })
                .catch(error => {
                    this.error = error
                })
        }
    },
    data() {
        return {
            posts: [],
            following: []
        };
    },
    components: { Post }
}

</script>

<style>
.postLink,
.postLink:visited,
.postLink:active {
    text-decoration: none;
    color: black;
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.feed {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
}

.feed-post {
    margin-top: 4vh
}

@media only screen and (max-width: 600px) {
    .feed {
        width: 585px;
    }

    .feed>.post>.userInfo h1 {
        font-size: 24px;
    }

    .feed>.post>.userInfo p {
        font-size: 12px;
    }

    .feed>.post>.postText p {
        font-size: 16px;
    }
}
</style>