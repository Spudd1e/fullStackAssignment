<template>
  <h1 class="text-bold text-center text-xl underline max-sm:text-lg">
    Create New User
  </h1>
  <div class="flex h-[80%] w-full flex-col items-center justify-center">
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
            class="password w-[90%] bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
            type="password"
            name="password"
            placeholder="Password"
            v-model="password"
          />
          <div class="w-[10%] justify-self-end" @click="togglePassView">
            <font-awesome-icon icon="eye" v-if="!passShow" />
            <font-awesome-icon icon="eye-slash" v-if="passShow" />
          </div>
        </div>
        <div v-if="!validPassword && submitted">Password Invalid</div>
        <div v-else><br /></div>

        <input
          class="password rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
          type="password"
          name="confirm"
          placeholder="Confirm Password"
          v-model="confirmPass"
        />
        <div v-if="!passConfirm && submitted">Password does not match</div>
        <div v-else><br /></div>
      </div>
      <button
        class="w-full rounded-lg bg-violet-900 p-4 text-center hover:bg-violet-800"
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

      userService
        .addNewUser(this.firstName, this.lastName, this.username, this.password)
        .then((response) => {
          alert("User " + response.user_id + " has been created");
        })
        .then(() => {
          userService.login(this.username, this.password).then((result) => {
            console.log("Auth Successful");
            this.$router.push("/");
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
      const re =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
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
