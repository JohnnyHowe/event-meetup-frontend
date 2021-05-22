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
        <input
          v-model="filterByCategories"
          type="checkbox"
          v-on:change="filterCategories"
        />
      </tr>
      <tr v-if="filterByCategories">
        Showing all events with one or more of the selected
        <div class="container">
          <div
            v-for="option in categoryOptions"
            v-bind:key="option.name"
            class="filter-options"
          >
            {{ option.name }}
            <input
              v-model="option.enabled"
              v-on:change="filterCategories"
              type="checkbox"
            />
          </div>
        </div>
      </tr>
    </table>

    Showing {{showingEvents.length}} of {{events.length}} Results

    <!-- Show the events -->
    <div
      v-for="event in showingEvents"
      v-bind:key="event.eventId"
      class="event"
    >
      <EventsPage_Event v-bind:eventData="event" />
    </div>
    <Pagination
      v-model="pageIndex"
      v-on:change="changePage"
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
      allEvents: [],
      events: [],
      showingEvents: [],
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
    changePage() {
      this.pageIndex = Math.min(this.pageIndex, this.lastPageIndex);
      this.showingEvents = this.events.slice(
        this.pageSize * this.pageIndex,
        this.pageSize * (1 + this.pageIndex)
      );
    },
    onLoad() {
      this.filterCategories();
      this.changePage();
    },
    loadEvents() {
      api.events.get().then((res) => {
        this.events = this.filterForTitle(res.data, this.filters.searchString);
        this.allEvents = this.events;
        this.onLoad();
      });
    },
    search() {
      this.pageIndex = 0;
      this.setLastPageIndex();
      this.loadEvents();
    },
    setLastPageIndex() {
      this.lastPageIndex = Math.floor(this.events.length / this.pageSize);
    },
    async filterCategories() {
      if (this.filterByCategories) {
        let es = [];
        for (let e of this.allEvents) {
          let done = false;
          for (let category of this.categoryOptions) {
            if (category.enabled) {
              if (e.categories.includes(parseInt(category.id))) {
                es.push(e);
                done = true;
                break;
              }
            }
          }
          if (done) continue;
        }
        this.events = es;
      } else {
        this.events = this.allEvents;
      }
      this.setLastPageIndex();
      this.changePage();
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
  text-align: left;
  /* border: 1px solid black; */
}
.grow {
  width: 100%;
}
.container {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  padding-left: 10%;
}
.filter-options {
  white-space: nowrap;
}
</style>