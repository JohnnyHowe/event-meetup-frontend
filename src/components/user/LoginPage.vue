<template>
  <PageContent title="Login" type="form">
    <p id="errorMessage">{{ errorMessage }}</p>
    <FormInputBar v-model="form.email" title="Email" />
    <FormInputBar v-model="form.password" title="Password" type="password" />
    <button v-on:click="onSubmit">Login</button>
    <br />
    <br />
    <button v-on:click="gotoRegisterPage">
      Not a user? <strong>Register</strong>
    </button>
  </PageContent>
</template>
<script>
import PageContent from "@/components/other/PageContent.vue";
import FormInputBar from "@/components/other/FormInputBar.vue";
import api from "@/api";
import store from "@/store";
export default {
  components: {
    PageContent,
    FormInputBar,
  },
  mounted: function () {
    if (store.isLoggedIn()) {
      console.log("Already logged in, re-routing to events");
      this.$router.push("events");
    }
  },
  data: function () {
    return {
      errorMessage: "",
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit() {
      api.users
        .login(this.form)
        .then(() => {
          this.errorMessage = "";
          this.$router.push("events");
        })
        .catch((e) => {
          this.errorMessage = e.response.statusText;
        });
    },
    gotoRegisterPage() {
      this.$router.push("register");
    },
  },
};
</script>
<style scoped>
.grow {
  width: 100%;
}
#errorMessage {
  color: red;
}
</style>