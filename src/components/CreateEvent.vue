<template>
  <PageContent title="Create Event" type="form-wide">
    <p v-for="msg in errorMessages" v-bind:key="msg" id="errorMessage">
      {{ msg }}
    </p>
    <FormInputBar v-model="form.title" title="Title*" />
    <FormInputBar
      v-model="date"
      v-on:change="updateDate"
      title="Date (UTC)*"
      type="date"
    />
    <FormInputBar
      v-model="time"
      v-on:change="updateDate"
      title="Time*"
      type="time"
    />
    <FormInputBar v-model="form.capacity" title="Capacity" type="number" />
    <FormInputBar
      v-model="form.description"
      title="Description"
      type="textarea"
    />
    <FormInputBar v-model="form.url" title="URL" />
    <FormInputBar v-model="form.venue" title="Location" />
    <FormInputBar v-model="form.fee" title="Fee (NZD)" type="number" />

    <table>
      <td>
        <p style="text-align: left">Categories:</p>
      </td>
      <td style="padding-left: 30px; text-align: left">
        <tr v-for="option in categoryOptions" v-bind:key="option.name">
          <input
            v-model="option.enabled"
            v-on:change="updateEnabledCategories"
            type="checkbox"
          />
          {{
            option.name
          }}
        </tr>
      </td>
    </table>

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
      categoryOptions: [],
      errorMessages: [],
      date: "",
      time: "",
      form: {
        title: "",
        image: "",
        description: "",
        capacity: "",
        isOnline: "",
        url: "",
        venue: "",
        controlAttendance: "",
        fee: "0",
        categories: [],
      },
    };
  },
  methods: {
    onSubmit() {
      if (this.errorChecking()) {
        console.log(this.form);
      }
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
      api.events
        .categories()
        .then((res) => {
          let cs = new Array(res.data.length - 1);
          for (const index in res.data) {
            let category = res.data[index];
            cs[category.id - 1] = {
              name: category.name,
              enabled: false,
              id: category.id,
            };
          }
          this.categoryOptions = cs;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    errorChecking() {
      // I know this is dumb but oh well
      this.errorMessages = [];

      // Title
      if (this.form.title == "") this.errorMessages.push("Title must exist");

      // Categories
      if (this.form.categories.length == 0)
        this.errorMessages.push("At least one category required");

      // Date
      if (this.form.date == "")
        this.errorMessages.push("A date in the future is required");

      return this.errorMessages.length == 0;
    },
    getDateTimeObject() {
      const parts = this.date.split("-");
      const d = new Date(+parts[0], parts[1] - 1, +parts[2], 12);
      const timeParts = this.time.split(":");
      d.setHours(timeParts[0]);
      d.setMinutes(timeParts[1]);
      return d;
    },
    updateDate() {
      try {
        const isoDate = this.getDateTimeObject().toISOString();
        this.form.date = isoDate.substring(0, isoDate.length - 1).replace("T", " ");
      } catch {
        // pass
      }
    },
    updateEnabledCategories() {
      this.form.categories = this.getEnabledCategories();
    },
    getEnabledCategories() {
      let categories = [];
      for (let o of this.categoryOptions) {
        if (o.enabled) {
          categories.push(o.id);
        }
      }
      return categories;
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
