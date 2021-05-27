<template>
  <PageContent v-bind:title="eventData.title">
    <button
      v-on:click="editEvent"
      style="width: 100%"
      v-if="actingAsOrganizer && !old"
    >
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
        <strong>Requires Attendance Control:</strong>
        {{
          eventData.requiresAttendanceControl == 1
        }}
      </tr>
      <tr>
        <br />
        <br />
      </tr>
      <div v-if="!actingAsOrganizer && !amAttending && !eventFull & !old">
        <p class="error">{{ attendanceError }}</p>
        <button
          v-if="eventData.requiresAttendanceControl"
          v-on:click="requestAttendance"
        >
          Request Attendance
        </button>
        <button v-else v-on:click="requestAttendance">
          Register Attendance
        </button>
        <br />
        <br />
      </div>
      <tr v-if="organizer != null">
        <strong>Organizer:</strong>
        <UserCard v-bind:userData="organizer" />
      </tr>
      <tr v-if="amAttending">
        <br />
        <br />
        <strong>You</strong>
        <p class="error">{{ cancelAttendanceError }}</p>
        <UserCard v-bind:userData="me">
          <strong>Status: {{ me.status }}</strong>
          <button v-if="me.status !== 'rejected' && !old" v-on:click="cancelAttendance">Cancel Attendance</button>
        </UserCard>
      </tr>
      <tr>
        <br />
        <br />
      </tr>
      <tr v-if="pending.length > 0">
        <strong>Pending:</strong>
        <button v-if="showPending" v-on:click="showPending = false">
          Hide
        </button>
        <button v-else v-on:click="showPending = true">Show</button>
        <div v-if="showPending">
          <UserCard
            style="margin-bottom: 10px"
            v-for="user in pending"
            v-bind:key="user.attendeeId"
            v-bind:userData="user"
          />
        </div>
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
import PageContent from "@/components/other/PageContent.vue";
import EventsPage_EventCard from "@/components/events/EventsPage_EventCard.vue";
import UserCard from "@/components/user/UserCard.vue";
import router from "@/routes";
import api from "@/api";
import store from "@/store";
import { getPretty, getDateObject } from "@/utils/date";
export default {
  components: {
    PageContent,
    UserCard,
    EventsPage_EventCard,
  },
  data: function () {
    return {
      attendanceError: "",
      isOld: true,
      amAttending: false,
      me: null,
      imgSrc: null,
      showAttendees: true,
      showPending: true,
      showSimilar: true,
      eventId: this.$route.params.id,
      categoryString: null,
      dateString: null,
      feeString: null,
      attendeesString: null,
      eventData: {},
      attendees: [],
      pending: [],
      organizer: null,
      similarEvents: [],
      actingAsOrganizer: false,
      eventFull: true,
      cancelAttendanceError: "",
    };
  },
  mounted() {
    this.loadEventInfo();
    window.scrollTo(0, 0);
  },
  methods: {
    setDefault() {
      this.attendanceError = "";
      this.isOld = true;
      this.amAttending = false;
      this.me = null;
      this.imgSrc = null;
      this.showAttendees = true;
      this.showPending = true;
      this.showSimilar = true;
      this.eventId = this.$route.params.id;
      this.categoryString = null;
      this.dateString = null;
      this.feeString = null;
      this.attendeesString = null;
      this.eventData = {};
      this.attendees = [];
      this.pending = [];
      this.organizer = null;
      this.similarEvents = [];
      this.actingAsOrganizer = false;
      this.eventFull = true;
      this.cancelAttendanceError = "";
    },
    async loadEventInfo() {
      this.setDefault();
      let res = await api.events.getOne(this.eventId);
      this.eventData = res.data;

      this.organizer = {
        firstName: this.eventData.organizerFirstName,
        lastName: this.eventData.organizerLastName,
        attendeeId: this.eventData.organizerId,
      };

      if (getDateObject(this.eventData.date) < new Date()) {
        this.old = true;
      }

      // is full?
      this.eventFull = false;
      if (this.eventData.capacity) {
        if (this.eventData.capacity == this.eventData.attendeeCount) {
          this.eventFull = true;
        }
      }

      this.setIsActingAsOrganizer();
      this.loadImage();
      this.setDateString();
      this.setCategoriesString();
      this.setFeeString();
      this.loadAttendees();
      this.loadSimilarEvents();
    },
    requestAttendance() {
      this.attendanceError = "";
      if (!store.isLoggedIn()) {
        router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
      } else {
        api.events.attendees
          .add(this.eventId)
          .then(() => {
            this.loadEventInfo();
          })
          .catch((e) => {
            this.attendanceError = e.response.statusText;
          });
      }
    },
    editEvent() {
      router.push(`/events/${this.eventId}/edit`);
    },
    setDateString() {
      this.dateString = getPretty(this.eventData.date);
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
      this.me = null;
      this.amAttending = false;
      this.attendees = [];
      this.pending = [];
      api.events.attendees.get(this.eventId).then((e) => {
        for (let a of e.data) {
          if (store.isLoggedIn()) {
            if (a.attendeeId == store.userStore.user.id) {
              this.amAttending = true;
              this.me = a;
              continue;
            }
          }

          if (!this.amAttending) {
            if (a.status === "accepted") {
              this.attendees.push(a);
            } else if (a.status === "pending") {
              this.pending.push(a);
            }
          }
        }
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
    isLoggedIn() {
      return store.isLoggedIn();
    },
    cancelAttendance() {
      api.events.attendees
        .remove(this.eventId)
        .then(() => {
          this.loadEventInfo();
        })
        .catch((e) => {
          this.cancelAttendanceError = e.response.statusText;
        });
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
.error {
  color: red;
  text-align: left;
  margin-bottom: 0px;
}
</style>