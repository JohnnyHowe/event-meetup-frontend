<template>
  <PageContent title="Register" type="form-wide">
    <p v-for="msg in errorMessages" v-bind:key="msg" id="errorMessage">
      {{ msg }}
    </p>
    <p id="errorMessage">{{ errorMessage }}</p>
    <FormInputBar v-model="form.firstName" title="First name" />
    <FormInputBar v-model="form.lastName" title="Last name" />
    <FormInputBar v-model="form.email" title="Email" />
    <FormInputBar v-model="form.password" title="Password" type="password" />
<input type="file" accept=".png,.jpg,.jpeg,.giff" />
    <br />
    <br />
    <button v-on:click="onSubmit">Register</button>
    <br />
    <br />
    <button v-on:click="gotoLoginPage">
      Already a user? <strong>Login</strong>
    </button>
  </PageContent>
</template>
<script>
import PageContent from "@/components/PageContent.vue";
import FormInputBar from "@/components/FormInputBar.vue";
import api from "@/api";
export default {
  components: {
    PageContent,
    FormInputBar,
  },
  data: function () {
    return {
      errorMessages: [],
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit() {
      if (this.checkFields()) {
        api.users
          .register(this.form)
          .then(() => {
            this.errorMessage = "";
            this.$router.push("events");
          })
          .catch((e) => {
            this.errorMessages = [e.response.statusText];
          });
      }
    },
    checkFields() {
      this.errorMessages = [];
      // fname
      if (!this.form.firstName)
        this.errorMessages.push("First name is required");
      // lname
      if (!this.form.lastName)
        this.errorMessages.push("Last name is required");
      // email
      if (!/^[^\s@]+@[^\s@]+$/.test(this.form.email))
        this.errorMessages.push("Email format invalid");
      // password
      if (this.form.password.length < 8)
        this.errorMessages.push("Password must have at least 8 characters");
      return this.errorMessages.length == 0;
    },
    gotoLoginPage() {
      this.$router.push("login");
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