<template>
  <PageContent title="My Events">
    <!-- Organizing -->
    <div class="section-header">
      <button v-if="!hideOrg" v-on:click="hideOrg=true">Hide</button>
      <button v-else v-on:click="hideOrg=false">Show</button>
      I'm Organizing {{ organizing.length }} Events
      <div v-show="!hideOrg">
        <div
          v-for="event in organizing"
          v-bind:key="event.eventId"
          class="event"
        >
          <EventsPage_Event v-bind:eventData="event" />
        </div>
      </div>
    </div>
    <br/>
    <br/>
    <!-- Pending -->
    <div class="section-header">
      <button v-if="!hidePend" v-on:click="hidePend=true">Hide</button>
      <button v-else v-on:click="hidePend=false">Show</button>
      I Wish to Attend (Pending) {{ pending.length }} Events
      <div v-show="!hidePend">
        <div
          v-for="event in pending"
          v-bind:key="event.eventId"
          class="event"
        >
          <EventsPage_Event v-bind:eventData="event" />
        </div>
      </div>
    </div>
    <br/>
    <br/>
    <!-- Attending -->
    <div class="section-header">
      <button v-if="!hideAtt" v-on:click="hideAtt=true">Hide</button>
      <button v-else v-on:click="hideAtt=false">Show</button>
      I'm Attending (Accepted) {{ attending.length }} Events
      <div v-show="!hideAtt">
        <div
          v-for="event in attending"
          v-bind:key="event.eventId"
          class="event"
        >
          <EventsPage_Event v-bind:eventData="event" />
        </div>
      </div>
    </div>
  </PageContent>
</template>
<script>
import PageContent from "@/components/other/PageContent.vue";
import EventsPage_Event from "@/components/events/EventsPage_EventCard.vue";
import api from "@/api";
/**
 * Show all the events that the user with prop userId is related to.
 *  - Events they organize
 *  - Events they're attending (accepted)
 *  - Events they with to attend (pending)
 */
export default {
  components: { PageContent, EventsPage_Event },
  props: ["userId"],
  data() {
    return {
      hideOrg: false,
      hidePend: false,
      hideAtt: false,
      organizing: [],
      attending: [],
      pending: [],
    };
  },
  mounted() {
    this.loadEvents();
  },
  methods: {
    async loadEvents() {
      let res = await api.events.get();

      // Get full data of the events
      for (let shortInfo of res.data) {
        api.events.getOne(shortInfo.eventId).then(async (oneRes) => {
          const eventData = oneRes.data;
          const attendeeRes = await api.events.attendees.get(shortInfo.eventId);

          let status;
          for (let attendee of attendeeRes.data) {
            if (attendee.attendeeId == this.userId) {
              status = attendee.status;
              break;
            }
          }
          // Now add to appropriate list
          if (eventData.organizerId == this.userId) {
            this.organizing.push(eventData);
          } else if (status === "accepted") {
            this.attending.push(eventData);
          } else if (status === "pending") {
            this.pending.push(eventData);
          }
        });
      }
    },
  },
};
</script>
<style scoped>
.section-header {
  text-align: left;
  font-size: 18px;
  margin-bottom: 0px;
}
</style>