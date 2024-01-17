<template>
  <form
    @submit.prevent="handleSubmit"
    autocomplete="off"
    class="w-1/2 bg-inherit text-left dark:text-white"
  >
    <h1 class="text-bold text-center text-xl underline">Create New User</h1>
    <div class="flex flex-col">
      <label for="firstName">First Name</label>
      <input
        class="rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
        type="text"
        name="firstName"
        v-model="firstName"
      />
      <div v-if="!firstName && submitted">Firstname required</div>
      <div v-else><br /></div>
    </div>
    <div class="flex flex-col">
      <label for="lastName">Last Name</label>

      <input
        class="rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
        type="text"
        name="lastName"
        v-model="lastName"
      />
      <div v-if="!lastName && submitted">Lastname required</div>
      <div v-else><br /></div>
    </div>
    <div class="flex flex-col">
      <label for="username">Username </label>

      <input
        class="rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
        type="text"
        name="username"
        v-model="username"
      />
      <div v-if="!username && submitted">Username required</div>

      <div v-else-if="error">Username already taken</div>
      <div v-else><br /></div>
    </div>
    <div class="flex flex-col">
      <label for="password">Password</label>

      <input
        class="password rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
        type="password"
        name="password"
        v-model="password"
      />
      <div>
        <input
          class="bg-inherit"
          type="checkbox"
          @click="togglePassView"
          name="passView"
        /><label for="passview">Show Password</label>
      </div>
      <div v-if="!validPassword && submitted">Password Invalid</div>
      <div v-else><br /></div>

      <label for="confirm">Confirm Password</label>

      <input
        class="password rounded-lg border bg-inherit p-1 ring-0 focus:outline-none dark:border-white"
        type="password"
        name="confirm"
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
</template>

<script>
import { userService } from "../../../services/user.service";
export default {
  inject: ["emitter"],

  data() {
    return {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPass: "",
      error: null,
      validUsername: true,
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
        } else {
          field.type = "password";
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
