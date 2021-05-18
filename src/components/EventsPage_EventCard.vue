<template>
  <CardButton v-on:click="gotoEventPage">
    <table id="main-table">
      <td id="text-col">
        <p id="title">{{ event.title }}</p>
        {{ timeString }}, {{ date.toDateString() }} <br />
        Organizer: {{ event.organizerFirstName }} {{ event.organizerLastName
        }}<br />
        Attendees: {{ event.numAcceptedAttendees }} / {{ event.capacity }}<br />
        Categories: {{ event.categories }}
      </td>
    </table>
  </CardButton>
</template>
<script>
import CardButton from "@/components/CardButton.vue";
// import api from "@/api";
export default {
  components: {
    CardButton,
  },
  props: {
    event,
  },
  mounted: function () {
    this.loadEventInfo();
  },
  methods: {
    gotoEventPage() {
      //   router.push({ path: `events/${this.event.eventId}` });
    },
    loadEventInfo() {
      this.getEventImage();
    },
    getEventImage() {
      // api.events.images
      //   .get(0)
      //   .then((res) => {
      //     console.log(res)
      //     // OwO got image
      //   })
      //   .catch((e) => {
      //     console.log(e)
      //     // Cannot get the image, use default image
      //   });
    },
  },
  computed: {
    date: function () {
      return new Date(this.$props.event.date);
    },
    /**
     * Get a string repsenenting the time in the format [h]h:mm[am|pm]
     * e.g. 6:05pm
     */
    timeString: function () {
      let postFix = this.date.getHours() <= 11 ? "am" : "pm";
      let minutes = this.date.getMinutes().toString();
      if (minutes.length == 1) minutes = "0" + minutes;
      return `${this.date.getHours() % 13}:${minutes}${postFix}`;
    },
  },
};
</script>
<style scoped>
#main {
}
#main-table {
  width: 100%;
  height: 100%;
  vertical-align: top;
}
#text-col {
  width: 100%;
}
#title {
  font-size: 20px;
}
#event-img {
  /* padding: 10px; */
  margin: 0px;
  height: 135px;
}
</style>