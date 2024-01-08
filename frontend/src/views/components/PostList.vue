<template>
    <div class="w-full self-center overflow-y-scroll overflow-hidden">
        <ul :key=posts>
            <li v-for="post in posts" class="last-of-type:mb-10 first-of-type:mt-0 flex justify-center">
                <Post :details="post" :following="following.includes(post.author.user_id)" />
            </li>
        </ul>
    </div>
</template>

<script>
import Post from './Post.vue';
export default {
    data() {
        return {

        }
    },
    props: {
        following: {
            type : Array,
            required: false,
            default: []
        },
        posts: {
            type : Array,
            required: true
        }
    },
    components: { Post }
}


</script>