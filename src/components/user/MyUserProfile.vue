<template>
  <PageContent title="Profile">
    <UserProfile v-if="id != null" v-bind:id="id" />
    <button v-on:click="gotoEditPage" style="width:100%">Edit</button>
  </PageContent>
</template>
<script>
import PageContent from "@/components/other/PageContent.vue";
import UserProfile from "@/components/user/UserProfile.vue";
import store from "@/store";
import router from "@/routes";
export default {
  components: { UserProfile, PageContent },
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
  methods: {
    gotoEditPage() {
      router.push("/profile/edit");
    }
  }
};
</script>