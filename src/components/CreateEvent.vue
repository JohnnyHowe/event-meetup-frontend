<template>
  <PageContent title="Create Event" type="form-wide">
    <p id="errorMessage">{{ errorMessage }}</p>
    <FormInputBar v-model="form.title" title="Title" />
    <FormInputBar v-model="form.date" title="Date" type="date" />
    <FormInputBar v-model="form.capacity" title="Capacity" type="number" />
    <FormInputBar
      v-model="form.description"
      title="Description"
      type="textarea"
    />

    <table>
      <td>
        <p style="text-align: left">Categories:</p>
      </td>
      <td style="padding-left:30px; text-align:left">
        <tr v-for="option in categoryOptions" v-bind:key="option">
          <input type="checkbox">
          {{option}}
        </tr>
      </td>
    </table>

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
    } else {
      this.loadCategories();
    }
  },
  data: function () {
    return {
      categoryOptions: ["hoes", "Joes", "bows"],
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
      console.log(this.form);
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
    loadCategories() {
      api.events.categories().then((res) => {
        let cs = new Array(res.data.length - 1);
        for (const index in res.data) {
          let category = res.data[index];
          cs[category.id - 1] = category.name;
        }
        this.categoryOptions = cs;
      }).catch((e) => {
        console.log(e)
      });
    }
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
