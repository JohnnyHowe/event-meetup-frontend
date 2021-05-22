<template>
  <CardButton v-on:click="gotoEventPage">
    <table id="main-table">
      <td id="text-col">
        <p id="title">{{ eventData.title }}</p>
        {{ timeString }}, {{ date.toDateString() }} <br />
        Organizer: {{ eventData.organizerFirstName }}
        {{ eventData.organizerLastName }}<br />
        Attendees: {{ eventData.numAcceptedAttendees }} / {{ eventData.capacity
        }}<br />
        Categories: {{ eventData.categories }}
      </td>
    </table>
  </CardButton>
  <!-- <img v-bind:src="imgSrc" v-bind:alt="eventData.eventId" /> -->
</template>
<script>
import CardButton from "@/components/CardButton.vue";
import api from "@/api";
export default {
  components: {
    CardButton,
  },
  props: ["eventData"],
  data: function () {
    return {
      imgSrc: `data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
        9TXL0Y4OHwAAAABJRU5ErkJggg==`,
    };
  },
  mounted: function () {
    // this.loadEventInfo();
  },
  methods: {
    gotoEventPage() {
      //   router.push({ path: `eventData./${this.event.eventId}` });
    },
    loadEventInfo() {
      this.getEventImage();
    },
    getEventImage() {
      api.events.images.get(this.eventData.eventId).then((res) => {
        this.imgSrc = `data:${res.headers["content-type"]};base64,${btoa(unescape(encodeURIComponent(res.data)))}`;
      });
      // .catch((e) => {
      //   // Cannot get the image, use default image
      //   // console.log(e)
      //   console.log(`${e.response.status} Error getting image for event ${this.eventData.eventId}`)
      // });
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
</style>