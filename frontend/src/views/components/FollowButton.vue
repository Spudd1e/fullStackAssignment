<template>

    <div>
        <p v-if="isFollowing" @click="unfollowUser">Following</p>
        <p v-if="!isFollowing" @click="followUser">Follow</p>
    </div>

</template>
<script>

import { socialService } from '../../services/social.service';



export default {
    props:['isFollowing','author'],
    inject:['emitter'],
    data(){
        return{

        }
    },methods:{
        followUser(){
            socialService.followUser(this.$props.author)
            .then(response => {
                this.emitter.emit("loadFeed")
            })
        }
        ,unfollowUser(){
            socialService.unFollowUser(this.$props.author)
            .then(response => {
                this.emitter.emit("loadFeed")
            })
        }
    }
}

</script>