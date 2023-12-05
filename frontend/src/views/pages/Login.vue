<template>
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit" autocomplete="off">
        <label for="username">Username </label>
        <input type="text" name="username" v-model="username" />
        <div v-show="submitted && !username">Username required</div>
        <br />
        <label for="password">Password </label>
        <input type="password" name="password" class="password" v-model="password" /><input name="showPass" type="checkbox" @click="togglePassView" /> <label for="showPass">Show Password</label>
        <div v-show="submitted && !password">Password required</div>
        <br />
        <div v-show="error">{{ error }}</div>
        <button>Login</button>

    </form>
    <router-link class="createNewAccountButton" to="/newUser">Create New Account</router-link>


</template>


<script>

import { userService } from '../../services/user.service';
export default {
    inject:["emitter"],
    data() {
        return {
            username: "",
            password: "",
            submitted: false,
            error : '',
        }
    },
    methods: {
        togglePassView(){
            const fields = document.getElementsByClassName("password")
            for(let field of fields){
                if(field.type === "password"){
                    field.type = "text"
                }else{
                    field.type = "password"
                }
            }
        },


        handleSubmit(e) {
            this.submitted = true;
            const { username, password} = this
            if (!(username && password)) {
                return;
            }
            userService.login(username, password)
            .then(result => {
                console.log("Auth Successful")
                this.$router.push('/')

            })
            .catch(error => {
                this.error = error
                this.submitted = false;
            })




        }
    }
}
</script>

<style>
.createNewAccountButton{
    text-decoration: none;
    background-color: darkgray;
    padding: 20px;
    border-radius: 15px;

}
.createNewAccountButton:visited{
    color: inherit;
}
.createNewAccountButton:active{
    color: white;
}
.createNewAccountButton:hover{
    background-color: #2c3840;
    color: white;
}


</style>