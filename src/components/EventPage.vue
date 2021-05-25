<template>
  <PageContent v-bind:title="eventData.title">
    <button v-on:click="editEvent" style="width: 100%" v-if="actingAsOrganizer">
      Edit Event
    </button>
    <img v-if="imgSrc != null" style="width: 100%" v-bind:src="imgSrc" />
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
          attendeeString
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
      <tr v-if="organizer != null">
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
import router from "@/routes";
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
      imgSrc: null,
      showAttendees: true,
      showSimilar: true,
      eventId: this.$route.params.id,
      categoryString: null,
      dateString: null,
      feeString: null,
      attendeesString: null,
      eventData: {},
      attendees: [],
      organizer: null,
      similarEvents: [],
      actingAsOrganizer: false,
    };
  },
  mounted() {
    this.loadEventInfo();
    window.scrollTo(0, 0);
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

      this.setIsActingAsOrganizer();
      this.loadImage();
      this.setDateString();
      this.setCategoriesString();
      this.setFeeString();
      this.loadAttendees();
      this.loadSimilarEvents();
    },
    editEvent() {
      router.push(`/events/${this.eventId}/edit`);
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
      api.events.attendees.get(this.eventId).then((e) => {
        this.attendees = e.data;
      });
    },
    async loadSimilarEvents() {
      let ids = [];
      for (let id of this.eventData.categories) {
        ids.push(parseInt(id));
      }
      let res = await api.events.get({ categoryIds: ids });

      // Load full event data
      let fullEvents = [];
      let responses = 0;
      for (let event of res.data) {
        api.events
          .getOne(event.eventId)
          .then((res2) => {
            fullEvents.push(res2.data);

            responses += 1;
            if (responses == res.data.length) {
              this.onAllEventsLoaded(fullEvents);
            }
          })
          .catch(() => {
            responses += 1;
            if (responses == res.data.length) {
              this.onAllEventsLoaded(fullEvents);
            }
          });
      }
    },
    onAllEventsLoaded(events) {
      let sorted = [];
      for (let event of events) {
        if (
          new Date(event.date) >= new Date() &&
          event.id != this.eventData.id
        ) {
          sorted.push(event);
        }
      }
      this.similarEvents = sorted;
    },
    loadImage() {
      api.events.images.getSafeURL(this.eventId).then((res) => {
        this.imgSrc = res;
      });
    },
    setIsActingAsOrganizer() {
      this.actingAsOrganizer = store.loggedInAs(this.organizer.attendeeId);
    },
  },
  computed: {
    attendeeString() {
      if (this.eventData.capacity == null) {
        if (this.eventData.attendeeCount != null) {
          return this.eventData.attendeeCount;
        } else {
          return "0";
        }
      } else {
        if (this.eventData.attendeeCount != null) {
          return (
            this.eventData.attendeeCount + " out of " + this.eventData.capacity
          );
        } else {
          return "0 out of " + this.eventData.capacity;
        }
      }
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