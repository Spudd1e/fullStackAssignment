import {createRouter, createWebHistory} from 'vue-router'
import { auth } from '../services/authentication.service'

import Home from '../views/pages/Home.vue'
import Login from '../views/pages/Login.vue'
import NotFound from '../views/pages/NotFound.vue'
import CreateUser from '../views/pages/CreateUser.vue'
import SinglePost from '../views/components/SinglePost.vue'
import Profile from '../views/pages/Profile.vue'

const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/newUser', component: CreateUser},
    {path: '/posts/:id', component:SinglePost },
    {path: '/users/:user_id', component:Profile},
    {path: '/profile', component: Profile, beforeEnter: auth.ifAuthenticated },
    {path: '/:pathMatch(.*)*', component: NotFound}

]

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router;