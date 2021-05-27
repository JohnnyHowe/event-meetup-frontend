<template>
  <table v-bind:class="mainClass">
    <td v-cloak class="img">
      <img
        class="img"
        v-if="imgSrc == null"
        src="@/../public/default-user.jpg"
      />
      <img class="img" v-else v-bind:src="imgSrc" />
    </td>
    <td VALIGN="TOP" style="padding: 10px">
      <tr>
        {{
          userData.firstName
        }}
        <br />
      </tr>
      <tr>
        {{
          userData.lastName
        }}
      </tr>
    </td>
    <td v-if="isLoggedInUser" VALIGN="TOP" class="you-text-cell">
      <p>This is you!</p>
    </td>
  </table>
</template>
<script>
import api from "@/api";
import store from "@/store";
export default {
  props: ["userData"],
  data: function () {
    return {
      imgSrc: null,
      isLoggedInUser: false,
      mainClass: "main",
    };
  },
  mounted() {
    this.loadImg();
    if (store.isLoggedIn()) {
      if (store.userStore.user.id == this.userData.attendeeId) {
        this.isLoggedInUser = true;
        this.mainClass = "main-shaded";
      }
    }
  },
  methods: {
    loadImg() {
      api.users.images.getSafeURL(this.userData.attendeeId).then((res) => {
        this.imgSrc = res;
      });
    },
  },
};
</script>
<style scoped>
.main {
  border: 1px solid grey;
  border-radius: 5px;
  padding: 5px;
  width: 100%;
}
.main-shaded {
  border: 1px solid grey;
  border-radius: 5px;
  padding: 5px;
  width: 100%;
  background-color: #dfd;
}
.you-text-cell {
  width: 200px;
  text-align: right;
}
.img {
  width: 80px;
  height: 80px;
}
</style>