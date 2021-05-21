<template>
  <PageContent title="Events">
    <div>
      <!-- Search bar -->
      <table class="grow">
        <td class="grow">
          <input class="grow" type="text" placeholder="Search..." />
        </td>
        <td>
          <button type="button">Search</button>
        </td>
      </table>
      <!-- Other filters -->
      <table class="filter-table">
        <tr></tr>
      </table>

      <!-- Show the events -->
      <div v-for="event in events" v-bind:key="event.eventId" class="event">
        <EventsPage_Event v-bind:eventData="event" />
      </div>
    </div>
  </PageContent>
</template>
<script>
import EventsPage_Event from "@/components/EventsPage_EventCard.vue";
import PageContent from "@/components/PageContent.vue";
import api from "@/api";
export default {
  components: {
    EventsPage_Event,
    PageContent,
  },
  data: function () {
    return {
      events: [],
      filters: {
        searchString: "",
      },
    };
  },
  mounted() {
    this.loadEvents();
  },
  methods: {
    loadEvents() {
      api.events
        .get({
          q:
            this.filters.searchString === "" ? null : this.filters.searchString,
        })
        .then((res) => {
          this.events = res.data;
          // this.events = [res.data[0]];
        });
    },
    search() {
      this.loadEvents();
    },
  },
};
</script>
<style scoped>
.event {
  margin: 5px;
}
.search-button {
  background-color: var(--primary-faded);
}
.filter-table {
  width: 100%;
  /* border: 1px solid black; */
}
.grow {
    width: 100%;
}
</style>