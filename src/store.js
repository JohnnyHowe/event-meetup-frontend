import { reactive } from "vue";
import api from "@/api";

const userStore = {
    authToken: null,
    user: null,

    save() {
        localStorage.setItem("auth", this.authToken);
        localStorage.setItem("user", JSON.stringify(this.user));
    },

    load() {
        this.authToken = localStorage.getItem("auth");
        this.user = JSON.parse(localStorage.getItem("user"));
    },

    isLoggedIn() {
        return this.authToken != null && this.authToken !== "null";
    },

    login(authToken, user) {
        this.authToken = authToken;
        this.user = user;
        this.save()
    },

    logout() {
        this.authToken = null;
        this.user = null;
        this.save()
    },
}

const store = reactive({
    error: null,
    userStore,
    categories: null,    // list of all categories, index = id

    isLoggedIn() {
        return this.userStore.isLoggedIn();
    },

    async getCategories() {
        if (this.categories == null) {
            await this.loadCategories();
        }
        return this.categories;
    },

    async getCategoryNames(ids) {
        let names = [];
        let categories = await this.getCategories();
        for (let id of ids) {
            names.push(categories[id]);
        }
        return names;
    },

    async loadCategories() {
        let res = await api.events.categories();
        let categories = new Array(res.data.length);
        for (let category of res.data) {
            categories[category.id] = category.name;
        }
        this.categories = categories;
    }
});


store.userStore.load();
export default store;