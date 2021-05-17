<template>
  <PageContent title="Events">
    <div>
      <!-- Search bar -->
      <!-- <b-input-group>
        <b-form-input v-model="filters.searchString"></b-form-input>
        <b-input-group-append>
          <b-button class="search-button" v-on:click="search">Search</b-button>
        </b-input-group-append>
      </b-input-group> -->
      <!-- Other filters -->
      <table class="filter-table">
        <tr>
        </tr>
      </table>

      <!-- Show the events -->
      <div v-for="event in events" v-bind:key="event.id" class="event">
        <EventsPage_Event v-bind:event="event" />
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
      api.events.get({
        q: this.filters.searchString === "" ? null : this.filters.searchString,
      }).then((res) => {
        this.events = res.data;
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
td {
  /* border: 1px dotted black; */
}
.filter-table {
  width: 100%;
  /* border: 1px solid black; */
}
</style>