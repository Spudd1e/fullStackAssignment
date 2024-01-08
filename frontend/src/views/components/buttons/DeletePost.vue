<template>
    <div>
        <button @click="deletePost">Delete</button>
    </div>

</template>
<script>
import { postService } from '../../../services/post.service';
export default{
    props:['post_id'],
    inject:['emitter'],
    data(){
        return{
            id: this.$props.post_id
        }
    },
    methods:{
        deletePost(){
            let post_id = this.id
            postService.deletePost(post_id)
            .then((response) => {
                this.emitter.emit("updateProfile")
                this.emitter.emit("loadFeed")
                this.emitter.emit("deleted")
            })
        }
    }
}

</script>