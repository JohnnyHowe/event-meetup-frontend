import { createWebHashHistory, createRouter } from 'vue-router'
import EventsPage from "@/components/EventsPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";


export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: EventsPage },
        { path: "/events", component: EventsPage },
        { path: "/register", component: RegisterPage },
    ],
})