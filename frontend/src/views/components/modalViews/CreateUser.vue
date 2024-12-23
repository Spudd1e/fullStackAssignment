<template>
  <div class="flex h-[10%] items-center">
    <h1 class="text-bold text-center text-xl underline max-sm:text-lg">
      Create New User
    </h1>
  </div>
  <div
    class="flex h-[80%] w-full flex-col items-center justify-center max-md:text-sm"
  >
    <form
      @submit.prevent="handleSubmit"
      autocomplete="off"
      class="h-[80%] w-3/4 justify-self-center bg-inherit text-left dark:text-white max-sm:text-xs"
    >
      <div class="flex flex-col">
        <input
          class="rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
          type="text"
          name="firstName"
          placeholder="Forename"
          v-model="firstName"
        />
        <div v-if="!firstName && submitted">Firstname required</div>
        <div v-else><br /></div>
      </div>
      <div class="flex flex-col">
        <input
          class="rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
          type="text"
          name="lastName"
          placeholder="Surname"
          v-model="lastName"
        />
        <div v-if="!lastName && submitted">Lastname required</div>
        <div v-else><br /></div>
      </div>
      <div class="flex flex-col">
        <input
          class="rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
          type="text"
          name="username"
          @input="error = null"
          placeholder="Username"
          v-model="username"
        />
        <div v-if="!username && submitted">Username required</div>

        <div v-else-if="error">Username already taken</div>
        <div v-else><br /></div>
      </div>
      <div class="flex flex-col">
        <div class="flex w-full items-center rounded-lg border">
          <input
            class="password w-[100%] bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
            type="password"
            name="password"
            maxlength="32"
            @input="validatePassword"
            placeholder="Password"
            v-model="password"
          />
          <div class="justify-self-end pr-2" @click="togglePassView">
            <font-awesome-icon icon="eye" v-if="passShow" />
            <font-awesome-icon icon="eye-slash" v-else />
          </div>
        </div>
        <div class="text-sm max-sm:text-xs" v-if="!validPassword && submitted">
          <p>Password must have at least:</p>
          <p>- 8 characters</p>
          <p>- 1 upper AND lower case character</p>
          <p>- 1 number</p>
          <p>- 1 symbol of #@£$%^&*()=!</p>
        </div>
        <div v-else><br /></div>

        <input
          class="password rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
          type="password"
          name="confirm"
          maxlength="32"
          placeholder="Confirm Password"
          v-model="confirmPass"
          @input="checkMatch"
        />
        <div v-if="!passConfirm && submitted">Password does not match</div>
        <div v-else><br /></div>
      </div>
      <button
        class="w-full rounded-lg bg-violet-700 p-4 text-center text-white hover:bg-violet-600 dark:bg-violet-800 dark:hover:bg-violet-700"
      >
        Create
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
      firstName: "",
      lastName: "",
      confirmPass: "",
      error: null,
      validUsername: true,
      passShow: false,
      submitted: false,
      validPassword: false,
      passConfirm: false,
    };
  },
  methods: {
    togglePassView() {
      const fields = document.getElementsByClassName("password");
      for (let field of fields) {
        if (field.type === "password") {
          field.type = "text";
          this.passShow = true;
        } else {
          field.type = "password";
          this.passShow = false;
        }
      }
    },
    handleSubmit() {
      this.submitted = true;

      if (this.validatePassword()) {
        this.validPassword = true;
      } else {
        return;
      }

      if (this.checkMatch()) {
        this.passConfirm = true;
      } else {
        return;
      }
      if (this.firstName == "") {
        this.firstName = null;
        return;
      }
      if (this.lastName == "") {
        this.lastName = null;
        return;
      }

      userService
        .addNewUser(this.firstName, this.lastName, this.username, this.password)
        .then(() => {
          userService.login(this.username, this.password).then((result) => {
            console.log("Auth Successful");
            this.$router.push("/profile");
            this.emitter.emit("log", true);
            this.$emit("close");
          });
        })
        .catch((error) => {
          console.log(error);
          this.error = error;
          this.submitted = false;
        });
    },
    validatePassword() {
      if (this.submitted) this.checkMatch();
      const re =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@£$%^&*()=!])[A-Za-z\d#@£$%^&*()=!]{8,32}$/;
      if (re.test(this.password)) {
        this.validPassword = true;
        return true;
      } else {
        this.validPassword = false;
        return false;
      }
    },
    checkMatch() {
      if (this.confirmPass === this.password) {
        this.passConfirm = true;
        return true;
      } else {
        this.passConfirm = false;
        return false;
      }
    },
  },
};
</script>

<style></style>
