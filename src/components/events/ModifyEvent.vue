<template>
  <PageContent title="Modify Event" type="form-wide">
    <p v-for="msg in errorMessages" v-bind:key="msg" id="errorMessage">
      {{ msg }}
    </p>
    <FormInputBar v-model="form.title" title="Title*" />
    <FormInputBar
      v-model="date"
      v-on:change="updateDate"
      title="Date (NZ time)*"
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
    <FormInputBar v-model="newImage" title="New Image" type="checkbox" />
    <FormInputBar
      v-if="newImage"
      v-on:change="fileChange"
      title="Image*"
      type="file"
      accept=".png,.jpg,.jpeg,.giff"
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
      </td>
    </table>

    <br />
    <button class="grow" v-on:click="onSubmit">Submit</button>
    <br />
    <br />
    <br />
    <div v-click-outside="hidePrompt">
      <button
        v-on:click="deletePrompt = deletePrompt = true"
        class="grow"
        v-bind:id="deleteId"
      >
        Delete
      </button>
      <br />
      <br />
      <button
        v-if="deletePrompt"
        v-on:click="deleteEvent"
        class="grow"
        id="delete-button"
      >
        Are you sure?
      </button>
    </div>
  </PageContent>
</template>
<script>
import PageContent from "@/components/other/PageContent.vue";
import FormInputBar from "@/components/other/FormInputBar.vue";
import {checkDate, checkTime } from "@/utils/errorChecking";
import api from "@/api";
import store from "@/store";
import router from "@/routes";
import { getInputFormatString, getDateObject } from "@/utils/date";
export default {
  components: {
    PageContent,
    FormInputBar,
  },
  mounted: function () {
    this.loadIniialData();
  },
  data: function () {
    return {
      deletePrompt: false,
      newImage: false,
      id: null,
      image: null,
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
  computed: {
    deleteId() {
      return this.deletePrompt ? "delete-button-pressed" : "delete-button";
    },
  },
  methods: {
    hidePrompt() {
      this.deletePrompt = false;
    },
    deleteEvent() {
      api.events.remove(this.id).then(() => {
        this.$router.push("/events");
      });
    },
    async onSubmit() {
      let form = this.convertTypes();
      if (this.errorChecking(form)) {
        this.errorMessages = [];
        api.events
          .put(this.id, form)
          .then((res) => {
            if (this.newImage) {
              this.trySendImage(res.data.eventId);
            }
            this.$router.push("/events");
          })
          .catch((e) => {
            this.errorMessages = [e.response.statusText];
          });
      }
    },
    async loadIniialData() {
      this.id = this.$route.params.id;
      api.events.getOne(this.id).then(async (res) => {
        this.eventData = res.data;
        // Are we definitely the organizer?
        if (!store.loggedInAs(this.eventData.organizerId)) {
          router.push("/events");
        }

        this.form.title = this.eventData.title;
        this.form.description = this.eventData.description;
        this.form.hasMaxCapacity = this.eventData.hasMaxCapacity == 1;
        this.form.isOnline = this.eventData.isOnline == 1;
        this.form.venue = this.eventData.venue;
        this.form.url = this.eventData.url;
        this.form.fee = this.eventData.fee;
        this.form.requiresAttendanceControl =
          this.eventData.requiresAttendanceControl == 1;
        this.capacity = this.eventData.capacity;

        // categories
        await this.loadCategories();
        for (let id of this.eventData.categories) {
          this.categoryOptions[id - 1].enabled = true;
        }
        this.updateEnabledCategories();

        // Are we allowed here?
        if (getDateObject(this.eventData.date) < new Date()) {
          router.push(`/events/${this.id}`);
        }

        const simple = getInputFormatString(this.eventData.date);
        this.date = simple.date;
        this.time = simple.time;

        this.updateDate();
      });
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
      return 0;
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

      // Desc
      if (form.description == "")
        this.errorMessages.push("Description must exist");

      // Date
      this.errorMessages = this.errorMessages.concat(checkDate(this.date))
      this.errorMessages = this.errorMessages.concat(checkTime(this.time))

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
    updateDate() {
      this.form.date = `${this.date} ${this.time}:00.000`;
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
    async trySendImage(id) {
      api.events.images.put(id, this.image);
    },
    fileChange(e) {
      this.image = e.target.files[0];
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
#delete-button {
  color: black;
  background-color: #f55;
}
#delete-button-pressed {
  color: black;
}
</style>
