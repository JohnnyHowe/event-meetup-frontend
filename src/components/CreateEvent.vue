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
    <FormInputBar
      v-model="form.description"
      title="Description*"
      type="textarea"
    />
    <FormInputBar
      v-model="hasMaxCapacity"
      title="Has Max Capacity"
      type="checkbox"
    />
    <FormInputBar
      v-if="hasMaxCapacity"
      v-model="capacity"
      title="Capacity"
      type="number"
    />

    <FormInputBar v-model="form.isOnline" title="Is Online" type="checkbox" />
    <FormInputBar v-if="form.isOnline" v-model="form.url" title="URL*" />
    <FormInputBar
      v-if="!form.isOnline"
      v-model="form.venue"
      title="Location*"
    />
    <FormInputBar v-model="form.fee" title="Fee (NZD)*" type="number" />
    <FormInputBar
      v-model="form.requiresAttendanceControl"
      title="Requires Attendance Control"
      type="checkbox"
    />
    <table class="grow">
      <td>
        <p style="text-align: right; width: 150px">Categories:</p>
      </td>
      <td style="padding-left: 4px; text-align: left">
        <div class="container">
          <div
            v-for="option in categoryOptions"
            v-bind:key="option.name"
            class="filter-options"
          >
            {{ option.name }}
            <input
              v-model="option.enabled"
              v-on:change="updateEnabledCategories"
              type="checkbox"
            />
          </div>
        </div>

        <!-- <tr v-for="option in categoryOptions" v-bind:key="option.name">
          <input
            v-model="option.enabled"
            v-on:change="updateEnabledCategories"
            type="checkbox"
          />
          {{
            option.name
          }}
        </tr> -->
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
    this.loadCategories();
  },
  data: function () {
    return {
      categoryOptions: [],
      errorMessages: [],
      date: "",
      time: "",
      capacity: "10",
      hasMaxCapacity: false,
      form: {
        title: "",
        description: "",
        categoryIds: [],
        date: "",
        isOnline: false,
        url: "",
        venue: "",
        requiresAttendanceControl: false,
        fee: "0",
      },
    };
  },
  methods: {
    onSubmit() {
      let form = this.convertTypes();
      if (this.errorChecking(form)) {
        this.errorMessages = [];
        api.events
          .add(form)
          .then(() => {
            this.$router.push("/events");
          })
          .catch((e) => {
            this.errorMessages = [e.response.statusText];
          });
      }
    },
    async loadCategories() {
      let data = await store.getCategories();
      let cs = new Array(data.length - 1);
      for (const id in data) {
        let name = data[id];
        cs[id - 1] = {
          name,
          enabled: false,
          id,
        };
      }
      this.categoryOptions = cs;
    },
    convertTypes() {
      const form = Object.assign({}, this.form);
      if (this.hasMaxCapacity) {
        form.capacity = parseInt(this.capacity);
      }
      form.fee = parseFloat(form.fee);
      form.isOnline = form.isOnline === "true" || form.isOnline === true;
      form.requiresAttendanceControl =
        form.requiresAttendanceControl === "true";
      return form;
    },
    errorChecking(form) {
      // I know this is dumb but oh well
      this.errorMessages = [];

      // Title
      if (form.title == "") this.errorMessages.push("Title must exist");

      // Date
      if (form.date == null || form.date == "") {
        this.errorMessages.push("A full date and time is required");
      } else if (this.getDateTimeObject() < new Date()) {
        this.errorMessages.push("Date and time must be in future");
      }

      // Capacity
      if (this.hasMaxCapacity && !form.capacity)
        this.errorMessages.push("Capacity cannot be empty if event has max");

      // URL
      if (form.isOnline && form.url.length == 0)
        this.errorMessages.push("Online events must have a URL");

      // Venue
      if (!form.isOnline && form.venue.length == 0)
        this.errorMessages.push("In person events must have a venue");

      // Categories
      if (form.categoryIds.length == 0)
        this.errorMessages.push("At least one category required");

      // fee 
      if (parseFloat(form.fee) < 0)
        this.errorMessages.push("Fee cannot be negative");

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
        this.form.date = isoDate
          .substring(0, isoDate.length - 1)
          .replace("T", " ");
      } catch {
        // pass
      }
    },
    updateEnabledCategories() {
      this.form.categoryIds = this.getEnabledCategories();
    },
    getEnabledCategories() {
      let categories = [];
      for (let o of this.categoryOptions) {
        if (o.enabled) {
          categories.push(parseInt(o.id));
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
.container {
  display: flex;
  flex-wrap: wrap;
}
.filter-options {
  white-space: nowrap;
  padding-left: 15px;
}
</style>
