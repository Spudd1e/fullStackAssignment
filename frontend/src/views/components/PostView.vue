<template>
    <div class="postModal">
        <div class="newPost">
            <div class="inputSection">
                <h1 v-if="type === 'newPost'">New Post</h1>
                <h1 v-if="type === 'editPost'">Edit Post</h1>

                <p class="characterCount">{{ length }} / 250</p>
                <textarea v-model="postText" @input="length = postText.length" maxlength="250"></textarea>
                <div v-if="length > 250">Character limit reached</div>
            </div>
            <div class="postOptions">
                <button v-if="type === 'newPost'">Save to drafts</button>
                <button v-if="type === 'newPost'" @click="handlePost">Post</button>
                <button v-if="type === 'editPost'" @click="handleEdit">Update</button>
                <button @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { postService } from "../../services/post.service"
export default {
    inject: ["emitter"],
    props: ["type", "edit_id", "text"],
    data() {
        return {
            post_id: this.$props.edit_id,
            postText: this.$props.text,
            length: this.$props.text.length,
        }
    },
    methods: {
        handlePost() {
            let text = this.postText
            postService.addNewPost(text)
                .then(response => {
                    this.emitter.emit("loadFeed")
                    this.$emit('close')

                })
                .catch(error => {
                    alert(error)
                })


        }, handleEdit() {
            let id = this.post_id
            let text = this.postText
            postService.updatePost(this.post_id, this.postText)
                .then((response) => {
                    this.emitter.emit("loadFeed")
                    this.$emit('close');
                })

                .catch((error) => {
                    console.log(error)
                })
        }
    }
}

</script>

<style>
.inputSection {
    width: 50%;
    height: 75%
}

.newPost {
    background: white;
    border-radius: 15px;
    width: 50%;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

}

textarea {
    width: 100%;
    height: 50%;
    align-self: center;
    resize: none;
    font-family: Arial, Helvetica, sans-serif
}

.characterCount {
    text-align: right;
    color: grey;
    font-size: small;
    padding: 0;
    margin: 0;
}

.postModal {
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1000;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>

