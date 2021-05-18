<template>
  <table class="grow">
    <td id="title">{{ title }}:</td>
    <td class="grow">
      <input v-model="ivalue" class="grow" v-bind:type="type" />
    </td>
  </table>
</template>
<script>
export default {
  props: {
    title: String,
    modelValue: String,
    type: {
        type: String,
        default: "text",
    }
  },
  data() {
    return {
      ivalue: "",
    };
  },
  watch: {
    ivalue: function () {
      this.$emit("update:modelValue", this.ivalue);
    },
  },
};
</script>
<style scoped>
#title {
  white-space: nowrap;
}
.grow {
  width: 100%;
}
</style>