<template>
  <h1 class="text-bold p-5 text-2xl underline">Login</h1>
  <div class="w-1/3 max-md:w-1/2 text-center">
    <form @submit.prevent="handleSubmit" class="flex flex-col">
      <div
        id="userInput"
        class="rounded-lg border-2 border-gray-200 p-1 text-left"
        @click="focus('username')"
      >
        <h2 for="username" class="p-2 text-lg">Username</h2>
        <input
          type="text"
          name="username"
          v-model="username"
          id="username"
          autocomplete="off"
          class="bg-inherit p-1 focus:outline-none focus:ring-0 focus:ring-offset-0"
          @focus="loginFocus('userInput')"
          @blur="loginBlur('userInput')"
        />
      </div>
      <div v-if="submitted && !username">Username required</div>
      <div v-else><br /></div>

      <div
        @click="focus('password')"
        id="passwordInput"
        class="rounded-lg border-2 border-gray-200 p-1 text-left"
      >
        <h2 for="password" class="p-1 text-lg">Password</h2>

        <div class="flex w-full items-center">
          <input
            type="password"
            name="password"
            id="password"
            maxlength="32"
            v-model="password"
            autocomplete="off"
            class="w-full border-0 bg-inherit p-2 focus:outline-none focus:ring-0 focus:ring-offset-0"
            @focus="loginFocus('passwordInput')"
            @blur="loginBlur('passwordInput')"
          />
          <div class="justify-self-end pr-2" @click="togglePassView">
            <font-awesome-icon icon="eye" v-if="passShow" />
            <font-awesome-icon icon="eye-slash" v-else />
          </div>
        </div>
      </div>
      <div v-if="submitted && !password">Password required</div>
      <div v-else-if="error && password == '' && username == ''">
        {{ error }}
      </div>
      <div v-else><br /></div>

      <button
        class="w-3/4 self-center rounded-lg bg-violet-700 p-2 text-white transition hover:bg-violet-600 dark:bg-violet-800 dark:hover:bg-violet-700"
      >
        Login
      </button>
    </form>
  </div>
</template>
<script>
import { userService } from "../../../services/user.service";

export default {
  inject: ["emitter"],
  emits: ["close"],
  data() {
    return {
      username: "",
      password: "",
      passShow: false,
      submitted: false,
      error: null,
    };
  },
  methods: {
    focus(location) {
      document.getElementById(location).focus();
    },
    loginFocus(value) {
      let element = document.getElementById(value);

      element.className = element.className.replace(
        "border-gray-200",
        "border-violet-800",
      );
    },
    loginBlur(value) {
      let element = document.getElementById(value);
      element.className = element.className.replace(
        "border-violet-800",
        "border-gray-200",
      );
    },
    togglePassView() {
      const field = document.getElementById("password");
      if (field.type === "password") {
        field.type = "text";
        this.passShow = true;
      } else {
        field.type = "password";
        this.passShow = false;
      }
    },
    handleSubmit(e) {
      this.submitted = true;
      const { username, password } = this;
      if (!(username && password)) {
        return;
      }
      userService
        .login(username, password)
        .then((result) => {
          console.log("Auth Successful");
          this.emitter.emit("log");
          this.$emit("close");
        })
        .catch((error) => {
          this.error = error;
          this.submitted = false;
          this.username = "";
          this.password = "";
        });
    },
  },
};
</script>
