import { reactive } from "vue";

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
        return this.authToken;
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

    isLoggedIn() {
        return this.userStore.isLoggedIn();
    }
});

store.userStore.load();
export default store;