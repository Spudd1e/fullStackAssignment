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
                <p>Date: {{ post.timestamp}}</p>
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
                this.post.timestamp = this.formatDate(new Date(post.timestamp))
            })
            .catch(error => this.error = error)
    },
    methods: {
        formatDate(date){
            let day = date.getDate().toString().padStart(2, "0")
            let month = date.getMonth().toString().padStart(2, "0")
            let year = date.getFullYear();
            let hour = date.getHours().toString().padStart(2, "0")
            let minutes = date.getMinutes().toString().padStart(2, "0")

            return day + "/" + month + "/" + year + " at " + hour + ":" + minutes

        }   
    }
}
</script>
