<template>
  <table class="main">
      <td>
      <img src="@/../public/default-user.jpg"/>
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
export default {
    props: ["userData"],
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