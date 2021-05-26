<template>
  <PageContent title="My Events">
    <p class="section-header">I'm Organizing</p>
    <div v-for="event in organizing" v-bind:key="event.eventId" class="event">
      <EventsPage_Event v-bind:eventData="event" />
    </div>
    <p class="section-header">I'm Attending (accepted)</p>
    <p class="section-header">I Want to Attend (pending)</p>
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
            this.attending.push(eventData);
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
}
</style>