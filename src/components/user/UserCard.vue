<template>
  <table class="main">
      <td>
      <img v-if="imgSrc == null" src="@/../public/default-user.jpg"/>
      <img v-else v-bind:src="imgSrc"/>
      </td>
      <td VALIGN="TOP" style="width:100%; padding:10px">
          <tr>
          {{userData.firstName}}
          <br/>
          </tr>
          <tr>
          {{userData.lastName}}
          </tr>
          <!-- <tr>
          {{userData.attendeeId}}
          </tr>
          <tr>
          {{userData.status}}
          </tr> -->
      </td>
  </table>
</template>
<script>
import api from "@/api";
export default {
    props: ["userData"],
    data: function() {
      return {
        imgSrc: null,
      }
    },
    mounted() {
      this.loadImg();
    },
    methods: {
      loadImg() {
      api.users.images.getSafeURL(this.userData.attendeeId).then((res) => {
        this.imgSrc = res;
      })
      }
    }
};
</script>
<style scoped>
.main {
  border: 1px solid grey;
  border-radius: 5px;
  padding:5px;
  width:100%;
}
img {
    width: 80px;
    height: 80px;
}
</style>