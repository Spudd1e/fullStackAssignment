<template>
    <div v-if="this.user.first_name">
        <h1>{{ this.user.first_name + " " + this.user.last_name }}</h1>
        <h2>@{{ this.user.username }}</h2>
        <p>Followers {{ this.user.followers.length }}</p>
        <p>Following {{ this.user.following.length }}</p>
        <ul>
            <li v-for="post in this.user.posts">
                <Post :details="post" />
            </li>
        </ul>
    </div>
</template>
<script>
import { userService } from '../../services/user.service';
import Post from '../components/Post.vue';
export default {
    inject:['emitter'],
    data() { 
        return {
            user: {},
            personalProfile: false,
            user_id: null
        };
    },
    watch:{
        $route(){
            this.getId()
            this.getUser(this.user_id)
        }

    },
    mounted() {
        this.emitter.on('updateProfile', () => {
            this.getUser(this.user_id)
        })
        this.getId()
        this.getUser(this.user_id)
        
    },
    unmounted(){
        this.emitter.off("updateProfile")
    },
    methods:{
        getId(){
            this.user_id = this.$route.params.user_id
            if(this.$route.params.user_id === localStorage.getItem("user_id")){
            this.$router.push('/profile')
        }
            if(this.$route.path === "/profile"){
            this.user_id = localStorage.getItem("user_id")
            this.personalProfile = true;
        }  

        },
        getUser(id){
            userService.getSingleUser(id)
            .then((user) => {
                this.user = user;
            })
            .catch((error) => {
                console.log(this.error)
                this.error = error
                this.$router.push('/NotFound')
            })
        }
    },
    components: { Post }
}
</script>