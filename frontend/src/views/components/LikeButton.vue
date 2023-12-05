<template>
    <div >
        <p @click="unlikePost" v-if="liked">Unlike</p>
        <p @click="likePost" v-else>Like</p>
    </div>
</template>

<script>

import { socialService } from '../../services/social.service';

export default {
    props: ['liked', 'post_id'],
    inject:['emitter'],
    data(){
        return{

        }
    },
    methods: {
        likePost() {
            socialService.likePost(this.$props.post_id)
            .then((response) => { 
                this.emitter.emit("updateLike", [this.$props.post_id, true])
            })
            .catch((error) => {
                console.log(error)
            })
        }
        ,unlikePost(){
            socialService.unlikePost(this.$props.post_id)
            .then((response) => {
                this.emitter.emit("updateLike", [this.$props.post_id, false])
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }
}

</script>