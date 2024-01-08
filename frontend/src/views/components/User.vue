<template>
    <div class="mt-4 self-center bg-slate-800 rounded-lg p-2  text-white w-full" >
        <router-link :to="'/users/' + user.user_id">

        <h1>{{ user.first_name + " " + user.last_name }}</h1>
        <h2> {{ user.username }}</h2>
        </router-link>

    </div>
</template>
<script>
import FollowButton from './buttons/FollowButton.vue';

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