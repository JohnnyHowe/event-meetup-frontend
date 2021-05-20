import { createWebHashHistory, createRouter } from 'vue-router'

import EventsPage from "@/components/EventsPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import CreateEvent from "@/components/CreateEvent.vue";

import store from "@/store";


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: EventsPage },

        { path: "/register", component: RegisterPage },
        { path: "/login", component: LoginPage },

        { path: "/events/new", component: CreateEvent },
        // { path: "/events", component: EventsPage },
    ],
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.isLoggedIn()) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
});

export default router;