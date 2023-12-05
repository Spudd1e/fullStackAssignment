<template>
    <div v-if="post" class="postDetails">
        <div class="userDetails">
            <div class="authorDetails">
                <h1>{{ post.author.first_name + " " + post.author.last_name }}</h1>
                <h2 class="userButton">@{{ post.author.username }}</h2>
                <p>User Id: {{ post.author.user_id }}</p>
            </div>
            <div>
                <p>Post Id: {{ post.post_id }}</p>
                <p>Likes: {{ post.likes.length }}</p>
                <p>Date: {{ new Date(post.timestamp).toString().slice(0, -31) }}</p>
            </div>
        </div>
        <br />
        <br />
        <br />

        <h2>{{ post.text }}</h2>

    </div>
</template>
<script>
import { postService } from '../../services/post.service';

export default {

    data() {
        return {
            post: null,
            error: ''
        }
    }, created() {
        postService.getSinglePost(this.$route.params.id)
            .then((post) => {
                this.post = post
            })
            .catch(error => this.error = error)
    }
}
</script>
