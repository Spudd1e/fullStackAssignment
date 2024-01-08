<template>
    <div v-if="isFollowing" @click="unfollowUser" class="p-2 bg-black text-sm text-white rounded-full w-30 text-center">
        <b>Following</b>
    </div>
    <div v-if="!isFollowing" @click="followUser" class="p-2 bg-black text-sm text-white rounded-full w-30 text-center">
        <p>Follow</p>
    </div>
</template>
<script>

import { socialService } from '../../../services/social.service';


export default {
    props: ['isFollowing', 'author'],
    inject: ['emitter'],
    data() {
        return {

        }
    }, methods: {
        followUser() {
            socialService.followUser(this.$props.author)
                .then(response => {
                    this.emitter.emit("updateProfile")
                    this.emitter.emit("loadFeed")
                })
        }
        , unfollowUser() {
            socialService.unFollowUser(this.$props.author)
                .then(response => {
                    this.emitter.emit("updateProfile")

                    this.emitter.emit("loadFeed")
                })
        }
    }
}

</script>