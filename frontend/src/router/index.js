import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../services/authentication.service";

import Home from "../views/pages/Home.vue";

import NotFound from "../views/pages/NotFound.vue";
import SinglePost from "../views/pages/SinglePost.vue";
import Profile from "../views/pages/Profile.vue";


const routes = [
  {
    path: "/",
    component: Home,
    name: "home",
  },
  { path: "/posts/:id", component: SinglePost },
  {
    path: "/users/:user_id",
    component: Profile,
    name: "userProfile",
    beforeEnter: auth.ifAuthenticated,
  },
  {
    path: "/profile",
    component: Profile,
    name: "profile",
    props: { userId: localStorage.getItem("user_id") },
    beforeEnter: auth.ifAuthenticated,
  },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
