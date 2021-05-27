<template>
  <UserProfile v-if="id!=null" v-bind:id="id" />
</template>
<script>
import UserProfile from "@/components/user/UserProfile.vue";
import store from "@/store";
import router from "@/routes";
export default {
  components: { UserProfile },
  data() {
    return {
      id: null,
    };
  },
  mounted() {
    if (store.isLoggedIn()) {
      this.id = store.userStore.user.id;
    } else {
      router.push("/events");
    }
  },
};
</script>