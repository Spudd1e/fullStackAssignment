<template>
    <div class="userCard">
        <router-link :to="'/users/' + user.user_id" >

        <h1>{{ user.first_name + " " + user.last_name }}</h1>
        <h2> {{ user.username }}</h2>
        </router-link>
        <FollowButton v-if="(user.user_id != isLoggedIn) && isLoggedIn" :author="user.user_id" :isFollowing="following" />

    </div>
</template>
<script>
import FollowButton from './FollowButton.vue';

export default {
    data(){
        return{
            isLoggedIn : localStorage.getItem("user_id")
        }
    },
    props: ["user", "following"],
    components: { FollowButton }
}
</script>

<style>

.userCard {
    background-color: grey;
    width: 100%;
    border-radius: 15px;
    margin-top: 1%;
}
.userCard:last-of-type{
    margin-bottom: 1%;
}
</style>