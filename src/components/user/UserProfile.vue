<template>
  <PageContent title="Profile">
    <img v-if="imgSrc != null" class="user-image" v-bind:src="imgSrc" />
    <img class="user-image" v-else src="@/../public/default-user.jpg" />
    <p style="font-size: 20px">
      {{ userData.firstName }} {{ userData.lastName }}
    </p>
    <p style="font-size: 20px">
      {{ userData.email }}
    </p>
  </PageContent>
</template>
<script>
import PageContent from "@/components/other/PageContent.vue";
import api from "@/api";
export default {
  props: ["id"],
  components: {
    PageContent,
  },
  data() {
    return {
      userData: {},
    };
  },
  mounted() {
    this.loadUserData();
    this.loadImage();
  },
  methods: {
    loadUserData() {
      api.users.get(this.id).then((res) => {
        this.userData = res.data;
      });
    },
    loadImage() {
      api.users.images.getSafeURL(this.id).then((res) => {
        this.imgSrc = res;
      });
    },
  },
};
</script>
<style scoped>
.user-image {
  height: 300px;
}
</style>