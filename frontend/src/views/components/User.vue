<template>
  <div
    class="mt-4 w-full self-center rounded-lg bg-[#EEEEEE] p-2 text-black dark:bg-[#2b2b2f] dark:text-white"
  >
    <router-link
      :to="'/users/' + user.user_id"
      class="flex justify-center max-md:flex-col"
    >
      <h1>
        {{ user.first_name + " " + user.last_name
        }}<span class="max-md:hidden">|</span>
      </h1>
      <h2 class="text-violet-400">@{{ user.username }}</h2>
    </router-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem("user_id"),
    };
  },
  props: ["user", "following"],
};
</script>
