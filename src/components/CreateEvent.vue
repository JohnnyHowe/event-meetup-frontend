<template>
  <PageContent title="Create Event" type="form-wide">
    <p id="errorMessage">{{ errorMessage }}</p>
    <FormInputBar v-model="form.title" title="Title" />
    <FormInputBar v-model="form.date" title="Date" type="date" />
    <FormInputBar v-model="form.capacity" title="Capacity" type="number" />
    <FormInputBar v-model="form.description" title="Description" type="textarea" />

    <!-- <FormInputBar v-model="form.isOnline" title="Is Online" /> -->
    <FormInputBar v-model="form.url" title="URL" />
    <FormInputBar v-model="form.venue" title="Location" />

    <FormInputBar v-model="form.fee" title="Fee (NZD)" type="number" />
    <button v-on:click="onSubmit">Submit</button>
  </PageContent>
</template>
<script>
import PageContent from "@/components/PageContent.vue";
import FormInputBar from "@/components/FormInputBar.vue";
// import api from "@/api";
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
          title: "",
          categories: "",
          date: "",
          image: "",
          description: "",
          capacity: "",
          isOnline: "",
          url: "",
          venue: "",
          controlAttendance: "",
          fee: "0",
      },
    };
  },
  methods: {
    onSubmit() {
        console.log(this.form)
    //   api.users
    //     .login(this.form)
    //     .then(() => {
    //       this.errorMessage = "";
    //       this.$router.push("events");
    //     })
    //     .catch((e) => {
    //       this.errorMessage = e.response.statusText;
    //     });
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
