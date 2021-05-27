<template>
  <div class="main">
    <table>
      <div v-if="isLoggedIn">
        <td class="user-name">{{ userFullName }}</td>
      </div>
      <td>
        <div class="page-links" v-on:click="gotoEvents">Events</div>
      </td>
      <td>
        <div class="page-links" v-if="isLoggedIn" v-on:click="gotoCreateEvent">
          Create Event
        </div>
      </td>
      <td>
        <div class="page-links" v-if="isLoggedIn" v-on:click="gotoMyEvents">
          My Events
        </div>
      </td>
      <td>
        <div class="page-links" v-if="isLoggedIn" v-on:click="gotoProfile">
          Profile
        </div>
      </td>

      <td style="width: 100%"></td>
      <div v-show="isLoggedIn">
        <div class="page-links" v-on:click="logout">Log Out</div>
      </div>
      <div v-show="!isLoggedIn">
        <div class="page-links" v-on:click="gotoLogin">Log In</div>
      </div>
    </table>
  </div>
</template>
<script>
import router from "@/routes";
import store from "@/store";
export default {
  methods: {
    logout() {
      store.userStore.logout();
      this.gotoLogin();
    },
    gotoLogin() {
      router.push({ path: "/login" });
    },
    gotoEvents() {
      router.push({ path: "/events" });
    },
    gotoCreateEvent() {
      router.push({ path: "/events/add" });
    },
    gotoMyEvents() {
      router.push({ path: "/events/mine" });
    },
    gotoProfile() {
      router.push({ path: "/profile" });
    },
  },
  computed: {
    isLoggedIn() {
      return store.isLoggedIn();
    },
    userFullName() {
      if (store.isLoggedIn()) {
        return (
          store.userStore.user.firstName + " " + store.userStore.user.lastName
        );
      } else {
        return "";
      }
    },
  },
};
</script>
<style scoped>
.main {
  width: 100%;
  background-color: var(--primary);
}
.user-name {
  color: #ddd;
  padding-right: 20px;
  padding-left: 20px;
  font-size: 20px;
  font-style: italic;
  /* white-space: nowrap; */
}
.user-icon {
  font-size: 3em;
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 0px;
  margin: 0px;
}
.page-links {
  color: lightgray;
  padding-top: 23px;
  font-size: 20px;
  cursor: pointer;
  height: 50px;
  width: 150px;
}
</style>