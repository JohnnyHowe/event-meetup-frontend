<template>
  <PageContent title="Edit Profile">
    <div style="text-align: left; padding-left: 160px">
    Leaving these fields unmodified will cause no update to the account
    </div>
    <p v-for="msg in errorMessages" v-bind:key="msg" id="errorMessage">
      {{ msg }}
    </p>
    <FormInputBar title="First Name" v-model="editedData.firstName" />
    <FormInputBar title="Last Name" v-model="editedData.lastName" />
    <FormInputBar title="Email" v-model="editedData.email" />
    <br />
    <br />
    <div style="text-align: left; padding-left: 160px">
    Leave new password blank to keep current
    </div>
    <div
      v-if="editedData.newPassword"
      style="text-align: left; padding-left: 160px"
    >
      Confirm current password to change
    </div>
    <FormInputBar
      title="New Password"
      v-model="editedData.newPassword"
      type="password"
    />
    <FormInputBar
      v-if="editedData.newPassword"
      title="Current Password"
      v-model="passwordInput"
      type="password"
    />
    <br />
    <br />

    <div style="text-align: left; padding-left: 160px">
      Choosing no image will keep current
      </div>
    <FormInputBar title="Remove Image" type="checkbox" v-model="deleteImage" />
    <FormInputBar
      v-if="!deleteImage"
      v-on:change="onFileChange"
      title="Image"
      type="file"
      accept=".png,.jpg,.jpeg,.giff"
    />
    <br />
    <br />
    <button v-on:click="submit">Submit</button>
    <br />
    <br />
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
      deleteImage: false,
      errorMessages: [],
      passwordInput: "",
      userData: {},
      id: null,
      editedData: {},
      image: null,
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
      if (this.errorChecking()) {
        let form = {
          firstName: this.editedData.firstName,
          lastName: this.editedData.lastName,
          email: this.editedData.email,
        };
        if (this.editedData.newPassword) {
          form.password = this.editedData.newPassword;
          form.currentPassword = this.passwordInput;
        }
        api.users
          .patch(this.id, form)
          .then(() => {
            this.trySendImage()
              .then(() => {
                router.push("/profile");
              })
              .catch((e) => {
                this.errorMessages.push(e.response.statusText);
              });
          })
          .catch((e) => {
            this.errorMessages.push(e.response.statusText);
          });
      }
    },
    errorChecking() {
      this.errorMessages = [];
      // fname
      if (!this.editedData.firstName)
        this.errorMessages.push("First name is required");
      // lname
      if (!this.editedData.lastName)
        this.errorMessages.push("Last name is required");
      // email
      if (!/^[^\s@]+@[^\s@]+$/.test(this.editedData.email))
        this.errorMessages.push("Email format invalid");
      // password
      if (this.editedData.newPassword.length != 0) {
        if (this.editedData.newPassword.length < 8) {
          this.errorMessages.push(
            "New password must have at least 8 characters"
          );
        }
        if (this.passwordInput.length == 0) {
          this.errorMessages.push("Current password must be entered");
        }
      }
      return this.errorMessages.length == 0;
    },
    async trySendImage() {
      if (this.deleteImage) {
        return api.users.images.remove(this.id);
      } else if (this.image != null) {
        return api.users.images.put(this.id, this.image);
      }
    },
    onFileChange(e) {
      this.image = e.target.files[0];
    },
  },
};
</script>
<style scoped>
.user-image {
  height: 300px;
}
.grow {
  width: 100%;
}
#errorMessage {
  color: red;
}
</style>