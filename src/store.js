import { reactive } from "vue";

export default reactive({
    error: null,
    authToken: null,
    user: null,

    isLoggedIn() {
        return this.authToken;
    },

    login(authToken, user) {
        this.authToken = authToken;
        this.user = user;
    },

    logout() {
        this.authToken = null;
    },
});