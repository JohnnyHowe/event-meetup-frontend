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
      <tr>
        Filter By Categories:
        <input v-model="filterByCategories" type="checkbox" />
      </tr>
      <tr v-if="filterByCategories">
        <div class="container">
          <div
            v-for="option in categoryOptions"
            v-bind:key="option.name"
            class="filter-options"
          >
            {{ option.name }}
            <input
              v-model="option.enabled"
              v-on:change="updateEnabledCategories"
              type="checkbox"
            />
          </div>
        </div>
      </tr>
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
import store from "@/store";
import api from "@/api";
export default {
  components: {
    EventsPage_Event,
    PageContent,
    Pagination,
  },
  data: function () {
    return {
      filterByCategories: false,
      categoryOptions: [],
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
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      let data = await store.getCategories();
      let cs = new Array(data.length - 1);
      for (const id in data) {
        let name = data[id];
        cs[id - 1] = {
          name,
          enabled: false,
          id,
        };
      }
      this.categoryOptions = cs;
    },

    loadEvents() {
      api.events
        .get({
          q:
            this.filters.searchString === "" ? null : this.filters.searchString,
          startIndex: this.pageIndex * this.pageSize,
          count: this.pageSize,
        })
        .then((res) => {
          this.events = this.filterForTitle(
            res.data,
            this.filters.searchString
          );
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
          this.lastPageIndex = Math.floor(
            this.filterForTitle(res.data, this.filters.searchString).length /
              this.pageSize
          );
        });
    },
    filterForTitle(events, q) {
      let es = [];
      for (let e of events) {
        if (e.title.includes(q)) {
          es.push(e);
        }
      }
      return es;
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
.container {
  display: flex;
  flex-wrap: wrap;
}
.filter-options {
  white-space: nowrap;
}
</style>