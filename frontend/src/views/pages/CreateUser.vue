<template>
    <form @submit.prevent="handleSubmit" autocomplete="off">
    <h1>Create New User</h1>
        <label for="firstName">First Name</label>
        <br/>
        <input type="text" name="firstName" v-model="firstName" />
        <div v-if="!firstName && submitted">Firstname required</div>
        <br/>
        <label for="lastName">Last Name</label>
        <br/>
        <input type="text" name="lastName" v-model="lastName" />
        <div v-if="!lastName && submitted">Lastname required</div>
        <br/>
        <label for="username">Username </label>
        <br />
        <input type="text" name="username" v-model="username" />
        <div v-if="!username && submitted">Username required</div>
        <div v-if="error">Username already taken</div>
        <br />
        <label for="password">Password </label>
        <br />
        <input type="password" name="password" class="password" v-model="password" />
        <input type="checkbox" @click="togglePassView" name="passView" /><label for="passview">Show Password</label>
        <div v-if="!validPassword && submitted">Password Invalid</div>
        <br />
        <label for="confirm">Confirm </label>
        <br />
        <input type="password" name="confirm" class="password" v-model="confirmPass" />
        <div v-if="!passConfirm && submitted">Password does not match</div>
        <br />
        <button>Create</button>
    </form>
</template>

<script>
import { userService } from '../../services/user.service';
export default {
    inject:["emitter"],

    data() {
        return {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
            confirmPass: '',
            error: '',
            validUsername: true,
            submitted: false,
            validPassword: false,
            passConfirm: false,
        }

    }, methods: {
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
        handleSubmit() {
            this.submitted = true;
            
            if(this.validatePassword()){
                this.validPassword = true
            }else{
                return
            }

            if(this.checkMatch()){
                this.passConfirm = true
            }else{
                return 
            }

            userService.addNewUser(this.firstName,this.lastName,this.username,this.password)
            .then(response => {
                alert("User " + response.user_id + " has been created")

                
            }).then(() => {
                userService.login(this.username, this.password)
                .then(result => {
                    console.log("Auth Successful")  
                    this.$router.push('/')
                    this.emitter.emit("log", true)
                })
            })
            .catch(error => {
                this.error = error
                this.submitted = false
            })

            



        },
        validatePassword() {
            const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/
            if (re.test(this.password)) {
                this.validPassword = true
                return true
            } else {
                this.validPassword = false
                return false
            }
        },
        checkMatch() {
            if (this.confirmPass === this.password) {
                this.passConfirm = true
                return true
            } else {
                this.passConfirm = false;
                return false
            }
        }
    }
}

</script>

<style>

</style>
