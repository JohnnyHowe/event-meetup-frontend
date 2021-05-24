<template>
  <PageContent v-bind:title="eventData.title">
    <img
      style="width: 100%"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/HNL_Wiki_Wiki_Bus.jpg/440px-HNL_Wiki_Wiki_Bus.jpg"
    />
    <p style="text-align: justify">{{ eventData.description }}</p>
    <table class="data-table">
      <tr>
        <strong>When:</strong>
        {{
          dateString
        }}
      </tr>
      <tr>
        <strong>Categories:</strong>
        {{
          categoryString
        }}
      </tr>
      <tr>
        <strong>Attendees:</strong>
        {{
          eventData.attendeeCount
        }}
        out of
        {{
          eventData.capacity
        }}
      </tr>
      <tr v-if="eventData.isOnline">
        <strong>URL: </strong>
        <a v-bind:href="eventData.url">{{ eventData.url }}</a>
      </tr>
      <tr v-else>
        <strong>Venue:</strong>
        {{
          eventData.venue
        }}
      </tr>
      <tr>
        <strong>Fee:</strong>
        {{
          feeString
        }}
      </tr>
      <tr>
        <br />
        <br />
      </tr>
      <tr>
        <strong>Organizer:</strong>
        <UserCard v-bind:userData="organizer" />
      </tr>
      <tr>
        <br />
        <br />
      </tr>
      <tr v-if="attendees.length > 0">
        <strong>Attendees:</strong>
        <button v-if="showAttendees" v-on:click="showAttendees = false">
          Hide
        </button>
        <button v-else v-on:click="showAttendees = true">Show</button>
        <div v-if="showAttendees">
          <UserCard
            style="margin-bottom: 10px"
            v-for="user in attendees"
            v-bind:key="user.attendeeId"
            v-bind:userData="user"
          />
        </div>
      </tr>
      <tr>
        <br />
      </tr>
      <tr v-if="similarEvents.length > 0">
        <strong>Similar Events:</strong>
        <button v-if="showSimilar" v-on:click="showSimilar = false">
          Hide
        </button>
        <button v-else v-on:click="showSimilar = true">Show</button>

        <div class="event" v-if="showSimilar">
          <EventsPage_EventCard
            v-for="event in similarEvents"
            v-bind:key="event.eventId"
            v-bind:eventData="event"
          />
        </div>
      </tr>
    </table>
  </PageContent>
</template>
<script>
import PageContent from "@/components/PageContent.vue";
import EventsPage_EventCard from "@/components/EventsPage_EventCard.vue";
import UserCard from "@/components/UserCard.vue";
import api from "@/api";
import store from "@/store";
export default {
  components: {
    PageContent,
    UserCard,
    EventsPage_EventCard,
  },
  data: function () {
    return {
      showAttendees: true,
      showSimilar: true,
      eventId: this.$route.params.id,
      categoryString: null,
      dateString: null,
      feeString: null,
      attendeesString: null,
      eventData: {},
      attendees: [],
      organizer: {},
      similarEvents: [],
    };
  },
  mounted() {
    this.loadEventInfo();
    window.scrollTo(0, 0)
  },
  methods: {
    async loadEventInfo() {
      let res = await api.events.getOne(this.eventId);
      this.eventData = res.data;

      this.organizer = {
        firstName: this.eventData.organizerFirstName,
        lastName: this.eventData.organizerLastName,
        attendeeId: this.eventData.organizerId,
      };

      this.setDateString();
      this.setCategoriesString();
      this.setFeeString();
      this.loadAttendees();
      this.loadSimilarEvents();
    },
    setDateString() {
      const ms = Date.parse(this.eventData.date);
      const date = new Date();
      date.setTime(ms);
      this.dateString = date.toString();
    },
    setCategoriesString() {
      store.getCategoryNames(this.eventData.categories).then((e) => {
        this.categoryString = e.join(", ");
      });
    },
    setFeeString() {
      if (this.eventData.fee <= 0) {
        this.feeString = "Free";
      } else {
        this.feeString = "$" + this.eventData.fee;
      }
    },
    loadAttendees() {
      //   let ats = [];
      api.events.attendees.get(this.eventId).then((e) => {
        this.attendees = e.data;
        // for (let a of e.data) {
        //   if (a.attendeeId == this.eventData.organizerId) {
        //     this.organizer = a;
        //   } else {
        //     ats.push(a);
        //   }
        // }
        // this.attendees = ats;
      });
    },
    loadSimilarEvents() {
      let ids = [];
      for (let id of this.eventData.categories) {
        ids.push(parseInt(id));
      }
      api.events.get({ categoryIds: ids }).then((res) => {
        let ats = [];
        for (let a of res.data) {
          if (a.eventId == this.eventData.id) {
            this.organizer = a;
          } else {
            ats.push(a);
          }
        }
        this.similarEvents = ats;
      });
    },
  },
};
</script>
<style scoped>
.data-table {
  text-align: left;
  width: 100%;
}
</style>