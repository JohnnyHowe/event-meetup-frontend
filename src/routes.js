import { createWebHashHistory, createRouter } from 'vue-router'

import EventsPage from "@/components/events/EventsPage.vue";
import EventPage from "@/components/events/EventPage.vue";
import CreateEvent from "@/components/events/CreateEvent.vue";
import ModifyEvent from "@/components/events/ModifyEvent.vue";
import UserEvents from "@/components/events/MyEvents.vue";

import RegisterPage from "@/components/user/RegisterPage.vue";
import LoginPage from "@/components/user/LoginPage.vue";
import UserProfile from "@/components/user/MyUserProfile.vue";
import EditMyUserProfile from "@/components/user/EditMyProfile.vue";

import store from "@/store";


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: EventsPage },

        { path: "/register", component: RegisterPage },
        { path: "/login", component: LoginPage },
        { path: "/profile", component: UserProfile, meta: { requiresAuth: true } },
        { path: "/profile/edit", component: EditMyUserProfile, meta: { requiresAuth: true } },

        { path: "/events", component: EventsPage },
        { path: "/events/mine", component: UserEvents, meta: { requiresAuth: true } },
        { path: "/events/:id", component: EventPage },
        { path: "/events/add", component: CreateEvent, meta: { requiresAuth: true } },
        { path: "/events/:id/edit", component: ModifyEvent, meta: { requiresAuth: true } },
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