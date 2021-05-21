<template>
  <CardButton v-on:click="gotoEventPage">
    <table id="main-table">
      <td id="text-col">
        <p id="title">{{ eventData.title }}</p>
        {{ timeString }}, {{ date.toDateString() }} <br />
        Organizer: {{ eventData.organizerFirstName }} {{ eventData.organizerLastName
        }}<br />
        Attendees: {{ eventData.numAcceptedAttendees }} / {{ eventData.capacity }}<br />
        Categories: {{ eventData.categories }}
      </td>
    </table>
  </CardButton>
</template>
<script>
import CardButton from "@/components/CardButton.vue";
import api from "@/api";
export default {
  components: {
    CardButton,
  },
  props: {
    eventData: String,
  },
  mounted: function () {
    this.loadEventInfo();
  },
  methods: {
    gotoEventPage() {
      //   router.push({ path: `eventData./${this.event.eventId}` });
    },
    loadEventInfo() {
      this.getEventImage();
    },
    getEventImage() {
      api.events.images
        .get(this.eventData.eventId)
        .then((res) => {
          console.log(res);
          // OwO got image
        })
        .catch((e) => {
          // Cannot get the image, use default image
          // console.log(e)
          console.log(`${e.response.status} Error getting image for event ${this.eventData.eventId}`)
        });
    },
  },
  computed: {
    date: function () {
      return new Date(this.$props.eventData.date);
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
#eventData.img {
  /* padding: 10px; */
  margin: 0px;
  height: 135px;
}
</style>