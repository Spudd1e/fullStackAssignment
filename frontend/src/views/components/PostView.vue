<template>
    <div class="postModal">
        <div class="newPost w-1/2 h1/2 flex flex-col items-center text-center justify-center bg-white">
            <!--Post New/Edit-->
            <div v-if="modalType === 'newPost' || modalType === 'editPost' && !showMessage"
                class=" p-5 w-full h-full flex flex-col items-center">
                <h1 v-if="modalType === 'newPost'">New Post</h1>
                <h1 v-if="modalType === 'editPost'">Edit Post</h1>
                <div class="w-3/4 h-3/4">
                    <p class="text-right font-light text-sm">{{ length }} / 500</p>
                    <textarea class="resize-none rounded-xl border w-full h-[calc(100%-1.5rem)] p-2" v-model="postText"
                        @input="length = postText.length" maxlength="500"></textarea>
                    <div v-if="length >= 500">Character limit reached</div>
                </div>
                <button class="p-2 border rounded-md m-2 w-fit bg-slate-300 hover:bg-slate-500" v-if="modalType === 'newPost'"
                    @click="handlePost">Post</button>
                    <div>
                    <button class="p-2 border rounded-full m-2 w-fit bg-slate-300 hover:bg-slate-500" v-if="modalType === 'editPost' && !showMessage"
                    @click="handleEdit">Update</button>
                <button class="p-2 border rounded-full m-2 w-fit bg-slate-300 hover:bg-slate-500" v-if="modalType === 'editPost' && !showMessage"
                    @click="showMessage = true">Delete</button>
                    </div>
            </div>
            <!--Login-->
            <div v-if="modalType === 'login' && !showMessage" class="text-left">
                <form @submit.prevent="handleSubmit" autocomplete="off" class="flex flex-col">
                    <div id="userInput" class="border-2 border-gray-200 rounded-md p-1 mb-4" @click="focus('username')">

                        <h2 for="username" class="p-2 text-lg">Username
                        </h2>
                        <input type="text" name="username" v-model="username" id="username"
                            class="focus:outline-none p-1 focus:ring-offset-0 focus:ring-0" @focus="loginFocus('userInput')"
                            @blur="loginBlur('userInput')" />



                    </div>
                    <div v-show="submitted && !username">Username required</div>

                    <div @click="focus('password')" id="passwordInput" class="border-2 border-gray-200 rounded-xl p-1">
                        <h2 for="password" class="p-1 text-lg">Password </h2>
                        <div>
                            <input type="password" name="password" id="password" v-model="password"
                                class="border-0 focus:ring-0 focus:ring-offset-0 focus:outline-none p-2"
                                @focus="loginFocus('passwordInput')" @blur="loginBlur('passwordInput')" />
                            <input name="showPass" type="checkbox" @click="togglePassView" class="p-1" />
                        </div>


                    </div>
                    <div v-show="submitted && !password">Password required</div>
                    <br />
                    <div v-show="error">{{ error }}</div>
                    <button>Login</button>
                </form>
            </div>
            <div v-if="showMessage" class="w-3/4 h-3/4 flex flex-col justify-center items-center text-center">
                <div v-if="!deleted" class="flex flex-col items-center">
                    <p class="p-2">Are you sure?</p>
                    <DeletePost class="p-2 bg-slate-300 hover:bg-slate-500 w-fit rounded-md" :post_id="id" />
                </div>
                <div v-if="deleted" class="p-4 bg-green-500 rounded-md">
                    <h1>Post Deleted</h1>
                </div>
            </div>
            <!--SEARCH-->
            <UserSearch v-if="modalType === 'userSearch' && !showMessage" @close="$emit('close')" />
            <!--Create User-->
            <CreateUser v-if="modalType ===  'newUser' && !showMessage" @close="$emit('close')" />

            <!--Option Buttons-->
            <div>
                <button class="p-2 border rounded-full m-2 w-fit bg-slate-300 hover:bg-slate-500" v-if="modalType === 'newPost'">Save to drafts</button>
                
                <button class="p-2 border rounded-full m-2 w-fit bg-slate-300 hover:bg-slate-500" v-if="modalType === 'editPost' && showMessage && !deleted"
                    @click="showMessage = false">Back</button>
                <button class="p-2 border rounded-full m-2 w-fit bg-slate-300 hover:bg-slate-500" @click="$emit('close')">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { postService } from "../../services/post.service"
import DeletePost from "./buttons/DeletePost.vue";
import { userService } from "../../services/user.service";
import UserSearch from "./UserSearch.vue";
import CreateUser from "../pages/CreateUser.vue";

export default {

    inject: ["emitter"],
    //props: ["modalType", "id", "text"],
    props: {
        modalType: {
            type: String,
            required: true,
            validator(value) {
                return [
                    "newPost",
                    "editPost",
                    "login",
                    "userSearch",
                    "newUser"
                ].includes(value);
            },
        },
        id: {
            type: Number,
            required: false,
            default: ""
        },
        text: {
            type: String,
            required: false,
            default: ""
        }
    },
    data() {
        return {
            post_id: this.$props.id,
            postText: this.$props.text,
            length: this.$props.text.length,
            showMessage: false,
            deleted: false,
            submitted: false,
            password: "",
            username: "",
            error: null
        }
    },
    mounted() {
        this.emitter.on('deleted', () => {
            this.deleted = true
            setTimeout(this.handleDeleteMessage, 2000)

        })
    },
    unmounted() {
        this.emitter.off('deleted')
    },
    methods: {
        focus(location) {
            document.getElementById(location).focus()
        },
        loginFocus(value) {
            let element = document.getElementById(value)
            console.log(element.className)
            element.className = element.className.replace("border-gray-200", "border-blue-400")
        },
        loginBlur(value) {
            let element = document.getElementById(value)
            element.className = element.className.replace("border-blue-400", "border-gray-200")
        },
        togglePassView() {
            const field = document.getElementById("password")
            if (field.type === "password") {
                field.type = "text"
            } else {
                field.type = "password"
            }
        },
        handleSubmit(e) {
            this.submitted = true;
            const { username, password } = this
            if (!(username && password)) {
                return;
            }
            userService.login(username, password)
                .then(result => {
                    console.log("Auth Successful")
                    this.emitter.emit('log')
                    this.$emit('close')

                })
                .catch(error => {
                    this.error = error
                    this.submitted = false;
                })
        },
        handlePost() {
            let text = this.postText;
            postService.addNewPost(text)
                .then(response => {
                    this.emitter.emit("loadFeed");
                    this.$emit("close");
                })
                .catch(error => {
                    alert(error);
                });
        },
        handleDeleteMessage() {
            this.$emit('close')
        },
        handleEdit() {
            let id = this.post_id;
            let text = this.postText;
            postService.updatePost(id, text)
                .then((response) => {
                    this.emitter.emit("loadFeed");
                    this.emitter.emit("updateProfile");
                    this.$emit("close");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },
    components: { DeletePost, UserSearch, CreateUser }
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

