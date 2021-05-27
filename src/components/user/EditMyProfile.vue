<template>
  <PageContent title="Edit Profile">

    <p>Any field left unedited will not update account</p>
    <br/>
    <FormInputBar title="First Name" v-model="editedData.firstName"/>
    <FormInputBar title="Last Name" v-model="editedData.lastName"/>
    <FormInputBar title="Email" v-model="editedData.email"/>
    <br/>
    <div v-if="editedData.newPassword" style="text-align:left; padding-left:160px">Confirm current password to change</div>
    <FormInputBar title="New Password" v-model="editedData.newPassword" type="password"/>
    <FormInputBar v-if="editedData.newPassword" title="Current Password" v-model="passwordInput" type="password"/>
    <br/>
    <FormInputBar v-on:change="fileChange" title="Image" type="file" accept=".png,.jpg,.jpeg,.giff" />
    <br/>
    <br/>
    <button v-on:click="submit">Submit</button>
    <br/>
    <br/>
    <button v-on:click="resetForm">Reset Form</button>
  </PageContent>
</template>

<script>
import api from "@/api";
import store from "@/store";
import router from "@/routes";
import PageContent from "@/components/other/PageContent.vue";
import FormInputBar from "@/components/other/FormInputBar.vue";
/**
 * Interface to edit the logged in user
 */
export default {
  components: { PageContent, FormInputBar },
  data() {
    return {
      passwordInput: "",
      userData: {},
      id: null,
      editedData: {},
    };
  },
  mounted() {
    if (store.isLoggedIn()) {
      this.id = store.userStore.user.id;
    } else {
      router.push("/profile");
    }

    this.loadUserData();
    this.loadImage();
  },
  methods: {
    loadUserData() {
      api.users.get(this.id).then((res) => {
        this.userData = res.data;
        this.resetForm();
      });
    },
    loadImage() {
      api.users.images.getSafeURL(this.id).then((res) => {
        this.imgSrc = res;
      });
    },
    resetForm() {
      this.editedData = Object.assign({}, this.userData);
      this.editedData.newPassword = "";
    },
    submit() {
      console.log("submit", this.editedData)
    }
  },
};
</script>
<style scoped>
.user-image {
  height: 300px;
}
</style>