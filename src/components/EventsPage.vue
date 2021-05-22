<template>
  <PageContent title="Events">
    <!-- Search bar -->
    <table class="grow">
      <td class="grow">
        <input
          class="grow"
          v-model="filters.searchString"
          type="text"
          placeholder="Search..."
        />
      </td>
      <td>
        <button type="button" v-on:click="search">Search</button>
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
    <Pagination
      v-model="pageIndex"
      v-on:change="loadEvents"
      v-bind:lastPageIndex="lastPageIndex"
    />
  </PageContent>
</template>
<script>
import EventsPage_Event from "@/components/EventsPage_EventCard.vue";
import PageContent from "@/components/PageContent.vue";
import Pagination from "@/components/Pagination.vue";
import api from "@/api";
export default {
  components: {
    EventsPage_Event,
    PageContent,
    Pagination,
  },
  data: function () {
    return {
      events: [],
      pageIndex: 0,
      pageSize: 10,
      lastPageIndex: 0,
      filters: {
        searchString: "",
      },
    };
  },
  mounted() {
    this.loadEvents();
    this.setLastPageIndex();
  },
  methods: {
    loadEvents() {
      api.events
        .get({
          q:
            this.filters.searchString === "" ? null : this.filters.searchString,
          startIndex: this.pageIndex * this.pageSize,
          count: this.pageSize,
        })
        .then((res) => {
          this.events = res.data;
        });
    },
    search() {
      this.pageIndex = 0;
      this.setLastPageIndex();
      this.loadEvents();
    },
    setLastPageIndex() {
      api.events
        .get({
          q:
            this.filters.searchString === "" ? null : this.filters.searchString,
        })
        .then((res) => {
          this.lastPageIndex = Math.floor(res.data.length / this.pageSize);
        });
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