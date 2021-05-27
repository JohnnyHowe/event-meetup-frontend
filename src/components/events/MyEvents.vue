<template>
  <UserEvents v-if="userId != null" v-bind:userId="userId" />
</template>
<script>
/**
 * Wrapper for UserEvents components
 * All this does is use that component with the user id from store
 */
import UserEvents from "@/components/events/UsersEvents.vue";
import store from "@/store";
import router from "@/routes";
export default {
  components: {
    UserEvents,
  },
  data() {
    return {
      userId: null,
    };
  },
  mounted() {
    if (store.isLoggedIn()) {
      this.userId = store.userStore.user.id;
    } else {
      router.push("/events");
    }
  },
};
</script>