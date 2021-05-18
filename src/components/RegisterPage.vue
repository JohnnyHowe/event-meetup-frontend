<template>
  <PageContent title="Register" type="form-wide">
    <p id="errorMessage">{{ errorMessage }}</p>
    <FormInputBar v-model="form.firstName" title="First name" />
    <FormInputBar v-model="form.lastName" title="Last name" />
    <FormInputBar v-model="form.email" title="Email" />
    <FormInputBar v-model="form.password" title="Password" type="password" />
    <button v-on:click="onSubmit">Register</button>
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
      errorMessage: "",
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
      api.users
        .register(this.form)
        .then(() => {
          this.errorMessage = "";
          this.$router.push("events")
        })
        .catch((e) => {
          this.errorMessage = e.response.statusText;
        });
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