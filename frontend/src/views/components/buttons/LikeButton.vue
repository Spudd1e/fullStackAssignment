<template>
    <div>
        <img class="h-10" @click="unlikePost" v-if="liked" src="../../../../Assets/Liked.png" />
        <img class="h-10" @click="likePost" v-else src="../../../../Assets/thumbsUp.png" />
    </div>
</template>

<script>

import { socialService } from '../../../services/social.service'

export default {
    props: ['liked', 'post_id'],
    inject: ['emitter'],
    data() {
        return {

        }
    },
    methods: {
        likePost() {
            if (localStorage.getItem("user_id")) {
                socialService.likePost(this.$props.post_id)
                    .then((response) => {
                        this.emitter.emit("updateProfile")
                        this.emitter.emit("updateLike")
                    }).catch(error => {
                        
                    })

            }else{
                this.emitter.emit("login")
            }
        }
        , unlikePost() {
            if (localStorage.getItem("user_id")) {
                socialService.unlikePost(this.$props.post_id)
                    .then((response) => {
                        this.emitter.emit("updateProfile")
                        this.emitter.emit("updateLike", [this.$props.post_id, false])
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                this.emitter.emit("login")
            }
        }
    }
}

</script>